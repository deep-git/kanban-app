"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Trash } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';

interface NavbarProps {
    board: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null
}

const Navbar = ({ board }: NavbarProps) => {

    const router = useRouter();
    const [closeDialog, setCloseDialog] = useState(false);

    const handleDeleteBoard = async () => {
        const response = await axios.delete(`/api/board/${board?.id}/delete`);

        setCloseDialog(false);
        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="sticky top-0 right-0 flex items-center h-[100px] px-7 py-10 bg-dark-navbar text-card">
            <h2 className="text-3xl truncate">{board?.name}</h2>

            <div className="flex justify-center items-center gap-5 w-max ml-auto">
                <Button className="bg-purple-1 hover:bg-purple-1/70">+ Add New Task</Button>

                <Popover>
                    <PopoverTrigger>
                        <BsThreeDotsVertical className="w-6 h-6 hover:text-purple-1" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-dark-board_background border-[1px] border-dark-board_background shadow-lg">
                        <Dialog open={closeDialog} onOpenChange={() => setCloseDialog(prev => !prev)}>
                            <DialogTrigger className="w-full">
                                <div className="flex gap-3 text-red-600 hover:bg-red-600/10 px-2 py-2 rounded-lg cursor-pointer w-full">
                                    <Trash />
                                    <span>Delete Board</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Board</DialogTitle>
                                    <DialogDescription>Are you sure you would like to delete this board? This action cannot be undone.</DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="ghost">Close</Button>
                                    </DialogClose>
                                    <Button onClick={() => handleDeleteBoard()} variant="destructive">Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default Navbar