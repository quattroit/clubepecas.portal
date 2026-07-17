import type {
  CreateAdvertisementRequest,
  UpdateAdvertisementRequest,
  UpdatePhotoOrderRequest,
} from "@/contracts/advertisements/requests";
import type {
  AdvertisementBySlugResponse,
  AdvertisementDetailDto,
  AdvertisementPhotoDto,
  CreateAdvertisementResponse,
  DeleteAdvertisementResponse,
  DeletePhotoResponse,
  GetMyAdvertisementsResponse,
  GetPhotosResponse,
  UpdatePhotoOrderResponse,
} from "@/contracts/advertisements/responses";
import { api } from "@/lib/api";

type UploadPhotoOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
};

/**
 * Serviços de anúncios.
 */
export const advertisementService = {
  create(payload: CreateAdvertisementRequest) {
    return api
      .post<CreateAdvertisementResponse>("/api/v1/advertisements", payload)
      .then((response) => response.data);
  },

  getMine() {
    return api
      .get<GetMyAdvertisementsResponse>("/api/v1/advertisements/me")
      .then((response) => response.data);
  },

  getById(id: string) {
    return api
      .get<AdvertisementDetailDto>(`/api/v1/advertisements/${id}`)
      .then((response) => response.data);
  },

  getBySlug(slug: string) {
    return api
      .get<AdvertisementBySlugResponse>(`/api/v1/advertisements/${slug}`)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdateAdvertisementRequest) {
    return api
      .put<AdvertisementDetailDto>(`/api/v1/advertisements/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string) {
    return api
      .delete<DeleteAdvertisementResponse>(`/api/v1/advertisements/${id}`)
      .then((response) => response.data);
  },

  uploadPhoto(
    advertisementId: string,
    file: File,
    options?: UploadPhotoOptions,
  ) {
    const formData = new FormData();
    formData.append("file", file);

    return api
      .post<AdvertisementPhotoDto>(
        `/api/v1/advertisements/${advertisementId}/photos/upload`,
        formData,
        {
          signal: options?.signal,
          timeout: 120_000,
          onUploadProgress: (event) => {
            if (!options?.onProgress || !event.total) return;
            const progress = Math.round((event.loaded / event.total) * 100);
            options.onProgress(progress);
          },
        },
      )
      .then((response) => response.data);
  },

  getPhotos(advertisementId: string) {
    return api
      .get<GetPhotosResponse>(
        `/api/v1/advertisements/${advertisementId}/photos`,
      )
      .then((response) => response.data);
  },

  updatePhotoOrder(advertisementId: string, payload: UpdatePhotoOrderRequest) {
    return api
      .put<UpdatePhotoOrderResponse>(
        `/api/v1/advertisements/${advertisementId}/photos/order`,
        payload,
      )
      .then((response) => response.data);
  },

  setPrimaryPhoto(advertisementId: string, photoId: string) {
    return api
      .put(
        `/api/v1/advertisements/${advertisementId}/photos/${photoId}/primary`,
      )
      .then((response) => response.data);
  },

  deletePhoto(advertisementId: string, photoId: string) {
    return api
      .delete<DeletePhotoResponse>(
        `/api/v1/advertisements/${advertisementId}/photos/${photoId}`,
      )
      .then((response) => response.data);
  },
};
