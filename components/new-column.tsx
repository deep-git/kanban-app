"use client";

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { columnColours } from '@/constants'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation';

interface NewColumnProps {
    board: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null
}

const NewColumn = ({ board }: NewColumnProps) => {

    const [nameColumn, setNameColumn] = useState("");
    const [colorValue, setColorValue] = useState("");
    const [error, setError] = useState<string | undefined>();
    const [closePopover, setClosePopover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreateColumn = async () => {

        setIsLoading(true);

        if (nameColumn !== "" && colorValue !== "") {
            const response = await fetch(`/api/board/${board?.id}/column`, {
                method: "POST",
                body: JSON.stringify({
                    name: nameColumn,
                    color: colorValue
                }
                )
            }).then((res) => {
                if (res.ok) {
                    setNameColumn("");
                    setColorValue("");
                    setError(undefined);
                    setClosePopover(false);
                    router.refresh();
                }
            });
        } else {
            setError("All fields must be filled.");
        }

        setIsLoading(false);
    }

    return (
        <div className="flex justify-center items-center w-[300px] bg-light-new_column dark:bg-dark-new_column hover:bg-light-new_column/70 dark:hover:bg-dark-new_column/70 text-dark-gray_text hover:text-purple-1">

            <Popover open={closePopover} onOpenChange={() => setClosePopover(prev => !prev)}>
                <PopoverTrigger>
                    <h3 className="text-2xl font-semibold cursor-pointer">+ New Column</h3>
                </PopoverTrigger>
                <PopoverContent side="top" className="bg-light-board_background dark:bg-dark-board_background border-purple-1 border-[2px] text-dark-gray_text">
                    <h4 className="text-purple-1 font-semibold">Create New Column</h4>

                    <div className="flex flex-col mt-3 gap-2">
                        <Label>Name</Label>
                        <Input placeholder="Column name" className="bg-light-sidebar dark:bg-dark-sidebar border-light-board_background dark:border-dark-board_background text-purple-1" value={nameColumn} onChange={(e) => setNameColumn(e.target.value)} />
                    </div>

                    <div className="flex flex-col mt-3 gap-2">
                        <Label>Colour</Label>

                        <Select onValueChange={(value) => setColorValue(value)}>
                            <SelectTrigger className="bg-light-board_background dark:bg-dark-board_background border-light-sidebar dark:border-dark-sidebar border-[2px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-light-board_background dark:bg-dark-board_background text-black dark:text-white border-none">
                                {columnColours && columnColours.map((colour) => (
                                    <SelectItem key={colour.label} value={colour.color}>
                                        <div className="flex gap-3 justify-center items-center">
                                            <div style={{ backgroundColor: `${colour.color}` }} className="w-3 h-3 rounded-full" />
                                            {colour.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <span className="text-red-600 font-normal text-sm">{error}</span>
                    )}

                    <div className="w-max ml-auto mt-5">
                        <Button disabled={isLoading} onClick={() => handleCreateColumn()} className="bg-purple-1 hover:bg-purple-1/70 text-white">Create</Button>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
    )
}

export default NewColumn