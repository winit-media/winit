"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface DragReorderProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandle: React.ReactNode) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export default function DragReorder<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
}: DragReorderProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [touchChecked, setTouchChecked] = useState(false);
  const dragItemRef = useRef<T | null>(null);

  if (!touchChecked) {
    setTouchChecked(true);
    setIsTouch(isTouchDevice());
  }

  const handleDragStart = useCallback(
    (index: number) => {
      setDragIndex(index);
      dragItemRef.current = items[index];
    },
    [items]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null || index === dragIndex) return;
      setOverIndex(index);
    },
    [dragIndex]
  );

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) {
        setDragIndex(null);
        setOverIndex(null);
        return;
      }
      const newItems = [...items];
      const [moved] = newItems.splice(dragIndex, 1);
      newItems.splice(index, 0, moved);
      onReorder(newItems);
      setDragIndex(null);
      setOverIndex(null);
    },
    [items, onReorder, dragIndex]
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const moveItem = useCallback(
    (index: number, direction: "up" | "down") => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= items.length) return;
      const newItems = [...items];
      const [moved] = newItems.splice(index, 1);
      newItems.splice(newIndex, 0, moved);
      onReorder(newItems);
    },
    [items, onReorder]
  );

  const DragHandle = ({ index }: { index: number }) => {
    if (isTouch) {
      return (
        <div className="flex flex-col items-center justify-center shrink-0">
          <button
            type="button"
            onClick={() => moveItem(index, "up")}
            disabled={index === 0}
            className="text-gray-400 hover:text-brand disabled:opacity-30 p-0.5 min-w-[28px] min-h-[28px] flex items-center justify-center"
            title="Move up"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => moveItem(index, "down")}
            disabled={index === items.length - 1}
            className="text-gray-400 hover:text-brand disabled:opacity-30 p-0.5 min-w-[28px] min-h-[28px] flex items-center justify-center"
            title="Move down"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      );
    }
    return (
      <button
        type="button"
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={() => handleDrop(index)}
        onDragEnd={handleDragEnd}
        className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-0.5 touch-none min-w-[28px] min-h-[28px] flex items-center justify-center"
        title="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>
    );
  };

  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          onDragEnd={handleDragEnd}
          className={`transition-all ${
            dragIndex === index ? "opacity-40" : ""
          } ${overIndex === index && dragIndex !== index ? "border-t-2 border-brand pt-1" : ""}`}
        >
          {renderItem(item, index, <DragHandle index={index} />)}
        </div>
      ))}
    </div>
  );
}
