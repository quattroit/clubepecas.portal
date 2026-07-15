import type {
  CreateAdvertisementRequest,
  CreatePhotoRequest,
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

/**
 * Serviços de anúncios.
 * Listagem do painel: `getMine` via `useMyAdvertisements`.
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

  createPhoto(advertisementId: string, payload: CreatePhotoRequest) {
    return api
      .post<AdvertisementPhotoDto>(
        `/api/v1/advertisements/${advertisementId}/photos`,
        payload,
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

  deletePhoto(advertisementId: string, photoId: string) {
    return api
      .delete<DeletePhotoResponse>(
        `/api/v1/advertisements/${advertisementId}/photos/${photoId}`,
      )
      .then((response) => response.data);
  },
};
