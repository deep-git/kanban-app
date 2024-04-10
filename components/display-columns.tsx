"use client";

import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DotSquare, Grab, Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import ListTask from './list-task';
import { db } from '@/lib/db';
import { Reorder } from "framer-motion";
import { cn } from '@/lib/utils';
import { GoGrabber } from "react-icons/go";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface DisplayColumnsProps {
    column: {
        id: string;
        name: string;
        color: string;
        boardId: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    },
    tasks: {
        id: string;
        name: string;
        description: string;
        status: string;
        profileId: string;
        boardId: string;
        columnId: string;
        createdAt: Date;
        updatedAt: Date;
    }[],
    subtasks: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
        columnId: string;
    }[],
    columnNames: {
        id: string;
        name: string;
    }[]
}

const DisplayColumns = ({ column, tasks, subtasks, columnNames }: DisplayColumnsProps) => {

    const [hoverShow, setHoverShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reorderTasks, setReorderTasks] = useState(tasks);
    const [active, setActie] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const boardId = pathname.split("/")[2];

    const handleRefresh = () => {
        router.refresh();
    }

    const handleDeleteColumn = async () => {
        setIsLoading(true);
        const response = await fetch(`/api/board/${boardId}/column/${column.id}`, {
            method: "DELETE"
        });

        router.refresh();
        setIsLoading(false);
    }

    /*
    const handleDragDrop = (results: any) => {
        const { source, destination, type } = results;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (type === "group") {
            const reorderedStores = [...reorderTasks];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedStore] = reorderedStores.splice(sourceIndex, 1);
            reorderedStores.splice(destinationIndex, 0, removedStore);

            return setReorderTasks(reorderedStores);
        }
    }
    */

    return (
        <div onMouseEnter={() => setHoverShow(true)} onMouseLeave={() => setHoverShow(false)} className={cn("flex w-[300px] flex-col gap-5 items-center", {
            "bg-neutral-800/50": active
        })}>

            <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                    <div style={{ backgroundColor: `${column.color}` }} className="w-3 h-3 rounded-full" />
                    <span className="text-dark-gray_text font-semibold uppercase tracking-wide">{column.name}</span>
                </div>

                {hoverShow && (
                    <Popover>
                        <PopoverTrigger>
                            <BsThreeDots className="w-5 h-5 text-dark-gray_text hover:text-purple-1 transition" />
                        </PopoverTrigger>

                        <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background">
                            <button disabled={isLoading} onClick={() => handleDeleteColumn()} className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                <Trash />
                                <span>Delete Column</span>
                            </button>
                        </PopoverContent>
                    </Popover>

                )}
            </div>

            <div className="flex w-full">
                {reorderTasks && reorderTasks.map((task) => (
                    <ListTask key={task.id} task={task} subtasks={subtasks} columnNames={columnNames} handleRefresh={handleRefresh} />
                ))}
            </div>

            {/* 
            <DragDropContext onDragEnd={handleDragDrop}>
                <div className="flex justify-between items-center w-full">
                    <div className="flex gap-3 items-center">
                        <div style={{ backgroundColor: `${column.color}` }} className="w-3 h-3 rounded-full" />
                        <span className="text-dark-gray_text font-semibold uppercase tracking-wide">{column.name}</span>
                    </div>

                    {hoverShow && (
                        <Popover>
                            <PopoverTrigger>
                                <BsThreeDots className="w-5 h-5 text-dark-gray_text hover:text-purple-1 transition" />
                            </PopoverTrigger>

                            <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background">
                                <button disabled={isLoading} onClick={() => handleDeleteColumn()} className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                    <Trash />
                                    <span>Delete Column</span>
                                </button>
                            </PopoverContent>
                        </Popover>

                    )}
                </div>

                <Droppable droppableId="ROOT" type="group">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col w-full gap-3">
                            {reorderTasks && reorderTasks.map((task, index) => (
                                <Draggable draggableId={task.id} key={task.id} index={index}>
                                    {(provided) => (
                                        <div className="flex w-full" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                            <ListTask task={task} subtasks={subtasks} columnNames={columnNames} handleRefresh={handleRefresh} />
                                            <div className="flex justify-center items-center px-2 bg-light-sidebar/70 dark:bg-dark-sidebar/70 cursor-grab active:cursor-grabbing rounded-br-lg rounded-tr-lg">
                                                <GoGrabber className="w-7 h-7 text-purple-1" />
                                            </div>
                                        </div>
                                    )}

                                </Draggable>
                            ))}
                        </div>
                    )}


                </Droppable>
            </DragDropContext>
            */}
        </div>
    )
}

export default DisplayColumns