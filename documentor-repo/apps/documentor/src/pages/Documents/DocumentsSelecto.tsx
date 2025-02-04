//
//  DocumentsSelecto.tsx
//  documentor-app
//
//  Created by Sergey Smetannikov on 04.02.2025
//

import { PropsWithChildren, useState, useRef, useEffect } from 'react';
import Selecto from 'react-selecto';
import Moveable from 'react-moveable';
import classes from './doclist.module.css';
import clsx from 'clsx';

interface SelectAndMoveProps extends PropsWithChildren {
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const SelectAndMove = ({ children, onReorder }: SelectAndMoveProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<Array<HTMLElement>>(
    []
  );
  const [items, setItems] = useState<HTMLElement[]>([]);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(
        containerRef.current.getElementsByClassName('selectable')
      ) as HTMLElement[];
      setItems(elements);
    }
  }, [children]);

  const resetStyles = () => {
    items.forEach((item) => {
      item.style.transform = '';
      item.style.transition = '';
      item.style.zIndex = '';
    });
  };

  const handleDragStart = (e: any) => {
    const target = e.target as HTMLElement;
    const index = items.indexOf(target);
    setDragStartIndex(index);

    // Style selected items
    selectedTargets.forEach((item) => {
      item.style.backgroundColor = 'rgba(0, 100, 255, 0.1)';
      item.style.zIndex = '1000';
    });

    // Prepare other items
    items.forEach((item) => {
      if (!selectedTargets.includes(item)) {
        item.style.transition = 'transform 0.3s ease';
      }
    });
  };

  const handleDrag = (e: any) => {
    if (dragStartIndex === null || selectedTargets.length === 0) return;

    const mouseY = e.clientY;
    const selectedIndices = selectedTargets
      .map((target) => items.indexOf(target))
      .sort((a, b) => a - b);
    const groupHeight = selectedTargets.reduce(
      (sum, target) => sum + target.offsetHeight,
      0
    );

    // Calculate potential new position
    let newPosition = 0;
    for (let i = 0; i < items.length; i++) {
      if (!selectedIndices.includes(i)) {
        const rect = items[i].getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;

        if (mouseY < centerY) {
          newPosition = i;
          break;
        }
        newPosition = i + 1;
      }
    }

    // Move non-selected items
    items.forEach((item, index) => {
      if (!selectedTargets.includes(item)) {
        let translateY = 0;

        if (newPosition <= index && index < Math.min(...selectedIndices)) {
          translateY = groupHeight;
        } else if (
          newPosition > index &&
          index > Math.max(...selectedIndices)
        ) {
          translateY = -groupHeight;
        }

        item.style.transform = `translateY(${translateY}px)`;
      }
    });

    // Update selected items position
    selectedTargets.forEach((target) => {
      target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`;
    });
  };

  const handleDragEnd = (e: any) => {
    if (dragStartIndex === null || selectedTargets.length === 0) return;

    const mouseY = e.clientY;
    const selectedIndices = selectedTargets
      .map((target) => items.indexOf(target))
      .sort((a, b) => a - b);

    // Calculate final position
    let newPosition = 0;
    for (let i = 0; i < items.length; i++) {
      if (!selectedIndices.includes(i)) {
        const rect = items[i].getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;

        if (mouseY < centerY) {
          newPosition = i;
          break;
        }
        newPosition = i + 1;
      }
    }

    // Perform reordering for group
    if (newPosition !== dragStartIndex) {
      // Handle group reordering
      selectedIndices.forEach((fromIndex, i) => {
        const adjustedNewPosition =
          newPosition > fromIndex
            ? newPosition - selectedIndices.length + i
            : newPosition + i;
        onReorder(fromIndex, adjustedNewPosition);
      });
    }

    // Reset states and styles
    resetStyles();
    selectedTargets.forEach((target) => {
      target.style.backgroundColor = '';
    });
    setDragStartIndex(null);
    setSelectedTargets([]);
  };

  return (
    <div ref={containerRef} className={clsx(classes.container)}>
      {children}
      <Selecto
        container={containerRef.current}
        dragContainer={containerRef.current}
        selectableTargets={['.selectable']}
        selectByClick={true}
        selectFromInside={false}
        hitRate={100}
        onSelectStart={(e) => {
          items.forEach((item) => {
            item.style.backgroundColor = '';
          });
        }}
        onSelect={(e) => {
          const selected = e.selected as HTMLElement[];
          setSelectedTargets(selected);
          selected.forEach((target) => {
            target.style.backgroundColor = 'rgba(0, 100, 255, 0.1)';
          });
        }}
      />
      <Moveable
        target={selectedTargets}
        draggable={true}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        hideDefaultLines={true}
      />
    </div>
  );
};
