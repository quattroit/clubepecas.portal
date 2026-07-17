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
import type { UploadQueueItem } from "@/features/dashboard/components/photos/usePhotoUploadQueue";
import type { AdvertisementPhotoDto } from "@/contracts/advertisements/responses";

type PhotoGridProps = {
  photos: AdvertisementPhotoDto[];
  queueItems: UploadQueueItem[];
  disabled?: boolean;
  busyPhotoId?: string | null;
  onReorder: (photos: AdvertisementPhotoDto[]) => void;
  onSetPrimary: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onCancelUpload: (localId: string) => void;
  onRemoveUpload: (localId: string) => void;
};

function PhotoGrid({
  photos,
  queueItems,
  disabled = false,
  busyPhotoId = null,
  onReorder,
  onSetPrimary,
  onDelete,
  onCancelUpload,
  onRemoveUpload,
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

  if (photos.length === 0 && queueItems.length === 0) {
    return (
      <p className="text-muted-foreground text-sm" role="status">
        Nenhuma foto cadastrada ainda.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {photos.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((photo) => photo.id)}
            strategy={rectSortingStrategy}
          >
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            </ul>
          </SortableContext>
        </DndContext>
      ) : null}

      {queueItems.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {queueItems.map((item) => (
            <QueuePhotoCard
              key={item.localId}
              item={item}
              onCancel={onCancelUpload}
              onRemove={onRemoveUpload}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { PhotoGrid };
