"use client";

import React, { useState } from 'react';
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from './ui/input';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { v4 as uuidv4 } from "uuid";
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { usePathname, useRouter } from 'next/navigation';

interface AddNewTaskContainerProps {
    columnNames: {
        id: string;
        name: string;
    }[],
    columns: {
        id: string;
        name: string;
        color: string;
        boardId: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }[],
    handleCloseDialog: () => void
}

const AddNewTaskContainer = ({ columnNames, columns, handleCloseDialog }: AddNewTaskContainerProps) => {

    const pathname = usePathname();
    const router = useRouter();

    const boardId = pathname.split("/")[2];

    const subtasks = [
        {
            id: uuidv4(),
            taskName: "",
            completed: false
        },
        {
            id: uuidv4(),
            taskName: "",
            completed: false
        },
    ];

    const [addSubtask, setAddSubtask] = useState(subtasks);
    const [addToColumn, setAddToColumn] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [closeDialog, setCloseDialog] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const formSchema = z.object({
        title: z.string().min(1, {
            message: "Title must not be empty.",
        }),
        description: z.string(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log("COLUMN", addToColumn);
        if (addToColumn !== "" && addToColumn !== undefined) {
            const response = await fetch(`/api/board/${boardId}/task`, {
                method: "POST",
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    subtasks: addSubtask,
                    status: addToColumn
                })
            }).finally(() => {
                handleCloseDialog();
                router.refresh();
                setIsLoading(false);
            });
        } else {
            setError("All fields must be filled in");
        }
    }

    const removeItem = (taskId: string) => {
        const filterTask = addSubtask.filter((task) => task.id !== taskId);
        setAddSubtask(filterTask);
    }

    const addItem = () => {
        let newItem = {
            id: uuidv4(),
            taskName: "",
            completed: false
        };

        setAddSubtask(prev => [...prev, newItem]);
    }

    const editItem = (e: any, subtaskId: string) => {
        const { value } = e.target;
        const editName = addSubtask.map((task) => task.id === subtaskId ? { ...task, ["taskName"]: value } : task);
        setAddSubtask(editName);
    }

    return (
        <DialogContent className="bg-light-sidebar dark:bg-dark-sidebar border-light-sidebar dark:border-dark-sidebar text-black dark:text-white p-7">
            <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Take coffee break" className="bg-light-sidebar dark:bg-dark-sidebar border-dark-gray_text/30" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little." className="bg-light-sidebar dark:bg-dark-sidebar border-dark-gray_text/30" {...field} />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="mt-3">
                        <ScrollArea className="task_scroll max-h-44 w-full px-2 overflow-y-scroll">
                            <Label>Subtasks</Label>
                            <div className="flex flex-col gap-3 mt-3">
                                {addSubtask && addSubtask.map((subtask) => (
                                    <div key={subtask.id} className="flex gap-3 justify-center items-center">
                                        <Input className="bg-light-sidebar dark:bg-dark-sidebar border-dark-gray_text/30" placeholder="e.g. Make coffee" value={subtask.taskName} onChange={(e) => editItem(e, subtask.id)} required />
                                        <X onClick={() => removeItem(subtask.id)} className="w-6 h-6 text-dark-gray_text" />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <Button onClick={() => addItem()} type="button" className="w-full text-purple-1 font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-white dark:hover:bg-slate-200 mt-3">+ Add New Subtask</Button>
                    </div>

                    <div className="flex mt-3 flex-col gap-3">
                        <Label>Status</Label>
                        <Select onValueChange={(value) => setAddToColumn(value)}>
                            <SelectTrigger className="border-dark-gray_text/30">
                                <SelectValue placeholder="Add to Column" />
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

                    {error && (
                        <span className="text-sm text-red-600 font-normal">{error}</span>
                    )}
                    <Button className="bg-purple-1 hover:bg-purple-1/90 text-white w-full" type="submit" disabled={isLoading}>Create Task</Button>
                </form>
            </Form>
        </DialogContent>
    )
}

export default AddNewTaskContainer