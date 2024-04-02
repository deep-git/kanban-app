"use client";

import React, { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

interface DisplayColumnsProps {
    column: {
        id: string;
        name: string;
        color: string;
        boardId: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

const DisplayColumns = ({ column }: DisplayColumnsProps) => {

    const [hoverShow, setHoverShow] = useState(false);
    const [activatePopover, setActivatePopover] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const boardId = pathname.split("/")[3];

    const handleDeleteColumn = async () => {
        const response = await fetch(`/api/board/${boardId}/column/${column.id}`, {
            method: "DELETE"
        });

        router.refresh();
    }

    return (
        <div onMouseEnter={() => setHoverShow(true)} onMouseLeave={() => setHoverShow(false)} className="w-[300px]">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <div style={{ backgroundColor: `${column.color}` }} className="w-3 h-3 rounded-full" />
                    <span className="text-dark-gray_text font-semibold uppercase tracking-wide">{column.name}</span>
                </div>

                {hoverShow && (
                    <Popover>
                        <PopoverTrigger>
                            <BsThreeDots className="w-5 h-5 text-dark-gray_text hover:text-purple-1 transition" />
                        </PopoverTrigger>

                        <PopoverContent className="bg-dark-board_background border-dark-board_background">
                            <div onClick={() => handleDeleteColumn()} className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                <Trash />
                                <span>Delete Column</span>
                            </div>
                        </PopoverContent>
                    </Popover>

                )}

            </div>
        </div>
    )
}

export default DisplayColumns