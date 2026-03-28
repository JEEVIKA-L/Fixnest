import React from 'react';
import { 
 DndContext, 
 closestCenter, 
 KeyboardSensor, 
 PointerSensor, 
 useSensor, 
 useSensors,
 DragEndEvent
} from '@dnd-kit/core';
import { 
 arrayMove, 
 SortableContext, 
 sortableKeyboardCoordinates, 
 rectSortingStrategy 
} from '@dnd-kit/sortable';
import { BoardCard } from './BoardCard';
import { Board } from '../../types';
import { Plus } from 'lucide-react';
import { useBoardStore } from '../../stores/useBoardStore';

interface BoardGridProps {
 boards: Board[];
}

export const BoardGrid = ({ boards }: BoardGridProps) => {
 const { reorderBoards } = useBoardStore();
 
 const sensors = useSensors(
 useSensor(PointerSensor, {
 activationConstraint: {
 distance: 5,
 },
 }),
 useSensor(KeyboardSensor, {
 coordinateGetter: sortableKeyboardCoordinates,
 })
 );

 const handleDragEnd = (event: DragEndEvent) => {
 const { active, over } = event;
 if (over && active.id !== over.id) {
 reorderBoards(active.id as string, over.id as string);
 }
 };

 return (
 <DndContext 
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragEnd={handleDragEnd}
 >
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 <SortableContext 
 items={boards.filter(b => !b.isArchived).map(b => b.id)}
 strategy={rectSortingStrategy}
 >
 {boards.filter(b => !b.isArchived).map((board) => (
 <BoardCard key={board.id} board={board} />
 ))}
 </SortableContext>
 
 <button className="h-32 w-full rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:border-gray-400 hover:text-gray-600 transition-all group">
 <Plus className="group-hover:scale-110 transition-transform" />
 <span className="text-sm font-semibold">Create new board</span>
 </button>
 </div>
 </DndContext>
 );
};
