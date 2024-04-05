"use client";

import { db } from '@/lib/db';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ViewSubtask from './view-subtask';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ListTaskProps {
    task: {
        id: string;
        name: string;
        description: string;
        status: string;
        profileId: string;
        boardId: string;
        columnId: string;
        createdAt: Date;
        updatedAt: Date;
    },
    subtasks: {
        id: string;
        name: string;
        completed: boolean;
        taskId: string;
    }[],
    columnNames: {
        id: string;
        name: string;
    }[],
    handleRefresh: () => void
}

const ListTask = ({ task, subtasks, columnNames, handleRefresh }: ListTaskProps) => {

    const subtaskIds: string[] = [];
    const [viewSubtasks, setViewSubtasks] = useState(subtasks);
    const [addToColumn, setAddToColumn] = useState<string | undefined>(task.status);
    const router = useRouter();
    const [closeDialog, setCloseDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const filterSubtasks = viewSubtasks.filter((subtask) => subtask.taskId === task.id);
        setViewSubtasks(filterSubtasks);
    }, [])

    const handleChangeStatus = (value: string) => {
        setAddToColumn(value);
    }

    const handleSaveTask = async () => {
        const response = await fetch(`/api/task/${task.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                newStatus: addToColumn,
                updatedSubtasks: viewSubtasks
            })
        })

        router.refresh();
        setCloseDialog(false);
    }

    const handleUpdateSubtasks = (subtaskId: string, e: any) => {
        const editSubtask = viewSubtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, ["completed"]: e } : subtask);
        setViewSubtasks(editSubtask);
    }

    const handleDeleteTask = async () => {
        setIsLoading(true)

        const response = await fetch(`/api/task/${task.id}`, {
            method: "DELETE"
        });

        setIsLoading(false);
        router.refresh();
        setCloseDialog(false);
    }

    return (
        <div className="flex w-full justify-start">
            <Dialog open={closeDialog} onOpenChange={() => setCloseDialog(prev => !prev)}>
                <DialogTrigger className="flex w-full justify-start">
                    <div className="w-full px-3 py-4 bg-light-sidebar dark:bg-dark-sidebar shadow-md rounded-bl-lg rounded-tl-lg">
                        <h4 className="text-lg text-black dark:text-white font-semibold text-wrap">{task.name}</h4>
                        <span className="text-sm font-semibold text-dark-gray_text">{viewSubtasks?.filter((subtask) => subtask.completed === true).length} of {viewSubtasks?.length} subtasks</span>
                    </div>
                </DialogTrigger>

                <DialogContent className="bg-light-sidebar dark:bg-dark-sidebar border-light-sidebar dark:border-dark-sidebar text-black dark:text-white">
                    <DialogHeader className="flex flex-col mt-5 gap-3">
                        <div className="flex justify-between items-center gap-3">
                            <DialogTitle>{task.name}</DialogTitle>

                            <Popover>
                                <PopoverTrigger>
                                    <BsThreeDotsVertical className="w-5 h-5 object-contain" />
                                </PopoverTrigger>
                                <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background">
                                    <button disabled={isLoading} onClick={() => handleDeleteTask()} className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                        <Trash />
                                        <span>Delete Task</span>
                                    </button>
                                </PopoverContent>
                            </Popover>

                        </div>
                        <DialogDescription>{task.description}</DialogDescription>
                    </DialogHeader>

                    <div>
                        <h5 className="text-sm">Subtasks ({viewSubtasks?.filter((subtask) => subtask.completed === true).length} of {viewSubtasks?.length})</h5>

                        <ScrollArea className="board_list flex flex-col gap-3 max-h-[300px] overflow-y-scroll">
                            <div className="flex flex-col gap-3 mt-3">

                                {viewSubtasks && viewSubtasks.map((subtask) => (
                                    <ViewSubtask key={subtask.id} task={task} subtask={subtask} handleUpdateSubtasks={handleUpdateSubtasks} />
                                ))}

                            </div>
                        </ScrollArea>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h5 className="text-sm">Status</h5>

                        <Select defaultValue={task.status} onValueChange={(value) => handleChangeStatus(value)}>
                            <SelectTrigger className="border-dark-gray_text/30">
                                <SelectValue defaultValue={task.status} placeholder="Add to Column" />
                            </SelectTrigger>
                            <SelectContent side="top" className="bg-light-board_background dark:bg-dark-board_background border-light-board_background dark:border-dark-board_background text-black dark:text-white">
                                {columnNames && columnNames.map((column) => (
                                    <SelectItem key={column.id} value={column.id}>
                                        {column.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={() => handleSaveTask()}>Save</Button>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ListTask;