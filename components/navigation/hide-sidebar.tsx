"use client";

import React, { useState } from 'react';
import Image from 'next/image'
import { Switch } from '../ui/switch'
import ModeToggle from '../mode-toggle'
import { CgDisplayGrid } from "react-icons/cg";
import { SignOutButton, UserButton } from '@clerk/nextjs';
import NewBoard from '../new-board';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import BoardList from '../board-list';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BiShow } from "react-icons/bi";
import { ScrollArea } from '../ui/scroll-area';

interface HideSidebarProps {
    boards: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]
}

const HideSidebar = ({ boards }: HideSidebarProps) => {

    const [hideSidebar, setHideSidebar] = useState(false);

    return (
        <>
            <div className={cn("sticky left-0 top-0 w-[300px] h-screen bg-light-sidebar dark:bg-dark-sidebar py-7 flex flex-col", {
                "hidden": hideSidebar
            })}>
                <Link href="/dashboard" className="flex gap-3 px-7">
                    <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                    <h1 className="text-4xl text-black dark:text-white font-bold">kanban</h1>
                </Link>

                <div className="mt-10">
                    <p className="uppercase text-dark-gray_text font-semibold px-7">All boards <span>({boards.length})</span></p>

                    <div className="flex flex-col mt-5 gap-1">
                        <ScrollArea className="board_list max-h-[400px] overflow-y-scroll">
                            {boards && boards.map((board) => (
                                <Link key={board.id} href={`/dashboard/${board.id}`}>
                                    <BoardList key={board.id} board={board} />
                                </Link>
                            ))}
                        </ScrollArea>

                        <div className="mt-3 px-7">
                            <NewBoard />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center mt-auto px-7 h-max gap-5">
                    <ModeToggle />

                    <UserButton />

                    <div className="flex gap-3 cursor-pointer" onClick={() => setHideSidebar(true)}>
                        <Image src="/icon-hide-sidebar.svg" alt="Hide" width={20} height={20} className="object-contain" />
                        <span className="text-dark-gray_text">Hide Sidebar</span>
                    </div>
                </div>
            </div >

            <div className={cn("fixed bottom-[20px] left-[20px] w-10 h-10 z-50 ", {
                "hidden": hideSidebar === false
            })}>
                <div className="flex justify-center items-center bg-light-sidebar dark:bg-dark-sidebar w-10 h-10 rounded-full shadow-md" onClick={() => setHideSidebar(false)}>
                    <BiShow className="w-5 h-5 object-contain cursor-pointer text-dark-gray_text hover:text-purple-1 transition" />
                </div>
            </div>
        </>
    )
}

export default HideSidebar