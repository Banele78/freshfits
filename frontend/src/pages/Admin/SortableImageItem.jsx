import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical, Star } from "lucide-react";

export const SortableImageItem = ({ image, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 ${
        isDragging
          ? "border-primary scale-[1.02] shadow-lg"
          : "border-border hover:border-primary/30"
      } ${
        index === 0 ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2" : ""
      }`}
    >
      <img
        src={image.preview}
        alt={`Product image ${index + 1}`}
        className="h-full w-full object-cover"
      />

      {index === 0 && (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-foreground/80 px-2 py-1 text-[10px] font-semibold text-background backdrop-blur-sm">
          <Star className="h-3 w-3 fill-current" />
          Cover
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute bottom-2 left-2 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity duration-200 backdrop-blur-sm group-hover:opacity-100 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity duration-200 hover:scale-110 group-hover:opacity-100"
        title="Remove image"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
