"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Trash } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import axios from 'axios';
import AddNewTaskForm from '../add-new-task';
import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import HideSidebar from './hide-sidebar';
import Link from 'next/link';
import BoardList from '../board-list';
import NewBoard from '../new-board';
import ModeToggle from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';
import { ScrollArea } from '../ui/scroll-area';
import MobileSidebar from './mobile-sidebar';

interface NavbarProps {
    board: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null,
    boards?: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }[],
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
    }[]
}

const Navbar = ({ board, boards, columnNames, columns }: NavbarProps) => {

    const router = useRouter();
    const [closeDialog, setCloseDialog] = useState(false);
    const [closePopover, setClosePopover] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    const boardId = pathname.split("/")[3];

    const handleDeleteBoard = async () => {
        const response = await axios.delete(`/api/board/${board?.id}/delete`);

        setCloseDialog(false);

        console.log(boards?.length);

        if (boards?.length) {
            if (boards?.length > 1) {
                router.push(`/dashboard/${boards[0]?.id}`);
            } else {
                router.push("/dashboard");
            }
        }
        router.refresh();
    }

    const handleCloseDialog = () => {
        setCloseDialog(false);
    }

    return (
        <div className="sticky top-0 right-0 flex w-full flex-wrap items-center h-[100px] px-4 md:px-7 bg-light-navbar dark:bg-dark-navbar text-card">
            <div className="flex gap-3 md:gap-0 justify-center items-center">
                <Image src="/logo-mobile.svg" alt="Mobile logo" width={30} height={30} className="object-contain md:hidden" />
                <h2 className="text-light-text dark:text-dark-text text-lg sm:text-xl lg:text-3xl truncate max-w-24 sm:max-w-52 lg:max-w-96 font-semibold">{board?.name}</h2>

                <MobileSidebar boards={boards} />
            </div>

            <div className="flex justify-center items-center gap-2 md:gap-5 w-max ml-auto">
                <Dialog open={closeDialog} onOpenChange={() => setCloseDialog(prev => !prev)}>
                    <DialogTrigger>
                        <div className="flex gap-1 bg-purple-1 hover:bg-purple-1/70 text-white rounded-[25px] md:rounded-lg px-5 py-2 md:px-3 md:py-3 font-bold md:font-normal shadow-md">+ <span className="hidden md:flex">Add New Task</span></div>
                    </DialogTrigger>

                    <AddNewTaskForm boardId={boardId} columnNames={columnNames} columns={columns} handleCloseDialog={handleCloseDialog} />
                </Dialog>

                <Popover>
                    <PopoverTrigger>
                        <BsThreeDotsVertical className="w-6 h-6 hover:text-purple-1 text-light-gray_text dark:text-white" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-light-board_background dark:bg-dark-board_background border-[1px] border-light-board_background dark:border-dark-board_background shadow-lg">
                        <Dialog open={closePopover} onOpenChange={() => setClosePopover(prev => !prev)}>
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
                                    <DialogClose asChild className="px-3 py-2 text-black hover:bg-slate-100 dark:text-white dark:hover:text-black cursor-pointer transition rounded-lg">
                                        <div>Close</div>
                                    </DialogClose>
                                    <button className="bg-red-600 hover:bg-red-600/90 text-white px-3 py-2 rounded-lg" onClick={() => handleDeleteBoard()}>Delete</button>
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