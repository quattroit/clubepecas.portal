"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  QueuePhotoCard,
  SavedPhotoCard,
} from "@/features/dashboard/components/photos/PhotoCard";
import { PhotoDropzone } from "@/features/dashboard/components/photos/PhotoDropzone";
import { photoGalleryGridClassName } from "@/features/dashboard/components/photos/photoGalleryLayout";
import type { UploadQueueItem } from "@/features/dashboard/components/photos/usePhotoUploadQueue";
import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";

type PhotoGridProps = {
  photos: AdvertisementPhotoDto[];
  queueItems: UploadQueueItem[];
  disabled?: boolean;
  busyPhotoId?: string | null;
  remaining: number;
  maxPhotos: number;
  usedCount: number;
  maxFileSizeMB: number;
  onReorder: (photos: AdvertisementPhotoDto[]) => void;
  onSetPrimary: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onCancelUpload: (localId: string) => void;
  onRemoveUpload: (localId: string) => void;
  onFilesSelected: (files: FileList | File[]) => void;
};

function PhotoGrid({
  photos,
  queueItems,
  disabled = false,
  busyPhotoId = null,
  remaining,
  maxPhotos,
  usedCount,
  maxFileSizeMB,
  onReorder,
  onSetPrimary,
  onDelete,
  onCancelUpload,
  onRemoveUpload,
  onFilesSelected,
}: PhotoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((photo) => photo.id === active.id);
    const newIndex = photos.findIndex((photo) => photo.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(photos, oldIndex, newIndex));
  };

  const occupied = photos.length + queueItems.length;
  const emptySlots = Math.max(0, maxPhotos - occupied - (remaining > 0 ? 1 : 0));

  return (
    <div className="flex flex-col gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={photos.map((photo) => photo.id)}
          strategy={rectSortingStrategy}
        >
          <ul className={photoGalleryGridClassName}>
            {photos.map((photo) => (
              <SavedPhotoCard
                key={photo.id}
                photo={photo}
                disabled={disabled}
                busy={busyPhotoId === photo.id}
                onSetPrimary={onSetPrimary}
                onDelete={onDelete}
              />
            ))}

            {queueItems.map((item) => (
              <QueuePhotoCard
                key={item.localId}
                item={item}
                onCancel={onCancelUpload}
                onRemove={onRemoveUpload}
              />
            ))}

            {remaining > 0 ? (
              <li>
                <PhotoDropzone
                  disabled={disabled}
                  remaining={remaining}
                  maxPhotos={maxPhotos}
                  usedCount={usedCount}
                  maxFileSizeMB={maxFileSizeMB}
                  onFilesSelected={onFilesSelected}
                />
              </li>
            ) : null}

            {Array.from({ length: emptySlots }).map((_, index) => (
              <li
                key={`empty-${index}`}
                className="border-border/70 bg-muted/40 aspect-square rounded-lg border border-dashed"
                aria-hidden
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <p className="text-muted-foreground text-[11px]">
        JPG, PNG ou WEBP · até {maxFileSizeMB} MB cada
      </p>
    </div>
  );
}

export { PhotoGrid };
