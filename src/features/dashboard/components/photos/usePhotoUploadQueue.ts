"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";
import { getFriendlyErrorMessage } from "@/lib/auth/messages";
import { ApiError, isCanceledError } from "@/lib/errors";
import { advertisementService } from "@/services/advertisement.service";
import {
  fileFingerprint,
  validatePhotoFile,
} from "@/features/dashboard/components/photos/photoValidation";

export type UploadStatus =
  | "queued"
  | "uploading"
  | "done"
  | "error"
  | "cancelled";

export type UploadQueueItem = {
  localId: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number;
  errorMessage?: string;
  fingerprint: string;
};

const MAX_CONCURRENT = 3;

type UsePhotoUploadQueueOptions = {
  advertisementId: string;
  maxPhotos: number;
  usedCount: number;
  maxFileSizeMB: number;
  onUploadCompleted: (photo: AdvertisementPhotoDto) => void;
};

export function usePhotoUploadQueue({
  advertisementId,
  maxPhotos,
  usedCount,
  maxFileSizeMB,
  onUploadCompleted,
}: UsePhotoUploadQueueOptions) {
  const [items, setItems] = useState<UploadQueueItem[]>([]);
  const abortControllersRef = useRef(new Map<string, AbortController>());
  const activeCountRef = useRef(0);
  const inFlightRef = useRef(new Set<string>());
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const updateItem = useCallback(
    (localId: string, patch: Partial<UploadQueueItem>) => {
      setItems((current) =>
        current.map((item) =>
          item.localId === localId ? { ...item, ...patch } : item,
        ),
      );
    },
    [],
  );

  const processQueue = useCallback(() => {
    const next = itemsRef.current.find(
      (item) =>
        item.status === "queued" && !inFlightRef.current.has(item.localId),
    );
    if (!next) return;
    if (activeCountRef.current >= MAX_CONCURRENT) return;

    inFlightRef.current.add(next.localId);
    const controller = new AbortController();
    abortControllersRef.current.set(next.localId, controller);
    activeCountRef.current += 1;
    updateItem(next.localId, { status: "uploading", progress: 0 });

    void advertisementService
      .uploadPhoto(advertisementId, next.file, {
        signal: controller.signal,
        onProgress: (progress) => {
          updateItem(next.localId, { progress });
        },
      })
      .then((photo) => {
        updateItem(next.localId, {
          status: "done",
          progress: 100,
        });
        onUploadCompleted(photo);
        URL.revokeObjectURL(next.previewUrl);
        setItems((current) =>
          current.filter((item) => item.localId !== next.localId),
        );
      })
      .catch((error: unknown) => {
        if (isCanceledError(error) || controller.signal.aborted) {
          updateItem(next.localId, {
            status: "cancelled",
            progress: 0,
            errorMessage: "Envio cancelado.",
          });
          return;
        }

        const message =
          error instanceof ApiError
            ? getFriendlyErrorMessage(error)
            : "Falha de conexão ao enviar a imagem.";

        updateItem(next.localId, {
          status: "error",
          errorMessage: message,
        });
      })
      .finally(() => {
        inFlightRef.current.delete(next.localId);
        abortControllersRef.current.delete(next.localId);
        activeCountRef.current = Math.max(0, activeCountRef.current - 1);
        queueMicrotask(() => processQueue());
      });
  }, [advertisementId, onUploadCompleted, updateItem]);

  useEffect(() => {
    const queued = items.filter((item) => item.status === "queued").length;
    const slots = MAX_CONCURRENT - activeCountRef.current;
    for (let i = 0; i < Math.min(queued, slots); i += 1) {
      processQueue();
    }
  }, [items, processQueue]);

  useEffect(() => {
    return () => {
      for (const item of itemsRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
      for (const controller of abortControllersRef.current.values()) {
        controller.abort();
      }
    };
  }, []);

  const enqueueFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const existingFingerprints = new Set(
        itemsRef.current.map((item) => item.fingerprint),
      );

      const accepted: UploadQueueItem[] = [];
      const rejectionMessages: string[] = [];
      let available = Math.max(
        0,
        maxPhotos -
          usedCount -
          itemsRef.current.filter(
            (item) =>
              item.status === "queued" || item.status === "uploading",
          ).length,
      );

      for (const file of list) {
        const fingerprint = fileFingerprint(file);
        if (existingFingerprints.has(fingerprint)) {
          rejectionMessages.push(`"${file.name}": arquivo já selecionado.`);
          continue;
        }

        const validation = validatePhotoFile(file, maxFileSizeMB);
        if (!validation.ok) {
          rejectionMessages.push(validation.message);
          continue;
        }

        if (available <= 0) {
          rejectionMessages.push(
            `Limite de ${maxPhotos} fotos atingido. "${file.name}" não foi adicionado.`,
          );
          continue;
        }

        existingFingerprints.add(fingerprint);
        available -= 1;
        accepted.push({
          localId: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          status: "queued",
          progress: 0,
          fingerprint,
        });
      }

      if (accepted.length > 0) {
        setItems((current) => [...current, ...accepted]);
      }

      return rejectionMessages;
    },
    [maxFileSizeMB, maxPhotos, usedCount],
  );

  const cancelItem = useCallback((localId: string) => {
    const controller = abortControllersRef.current.get(localId);
    controller?.abort();

    setItems((current) => {
      const target = current.find((item) => item.localId === localId);
      if (!target) return current;

      if (target.status === "queued" || target.status === "error") {
        URL.revokeObjectURL(target.previewUrl);
        return current.filter((item) => item.localId !== localId);
      }

      return current.map((item) =>
        item.localId === localId
          ? {
              ...item,
              status: "cancelled" as const,
              errorMessage: "Envio cancelado.",
            }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((localId: string) => {
    const controller = abortControllersRef.current.get(localId);
    controller?.abort();

    setItems((current) => {
      const target = current.find((item) => item.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.localId !== localId);
    });
  }, []);

  const clearFinished = useCallback(() => {
    setItems((current) => {
      for (const item of current) {
        if (item.status === "cancelled" || item.status === "error") {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      return current.filter(
        (item) =>
          item.status !== "cancelled" && item.status !== "error",
      );
    });
  }, []);

  const remainingSlots = Math.max(
    0,
    maxPhotos -
      usedCount -
      items.filter(
        (item) => item.status === "queued" || item.status === "uploading",
      ).length,
  );

  return {
    items,
    remainingSlots,
    canAddMore: remainingSlots > 0,
    enqueueFiles,
    cancelItem,
    removeItem,
    clearFinished,
    isUploading: items.some((item) => item.status === "uploading"),
  };
}
