"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical } from "lucide-react";

interface DragReorderProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, dragHandle: React.ReactNode) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
}

export default function DragReorder<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
}: DragReorderProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragItemRef = useRef<T | null>(null);

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

  const DragHandle = ({ index }: { index: number }) => (
    <button
      type="button"
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={() => handleDrop(index)}
      onDragEnd={handleDragEnd}
      className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-0.5 touch-none"
      title="Drag to reorder"
    >
      <GripVertical size={16} />
    </button>
  );

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
