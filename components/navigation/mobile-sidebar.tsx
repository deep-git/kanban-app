import React from 'react';
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
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface MobileSidebarProps {
    boards: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]
}

const MobileSidebar = ({ boards }: MobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger>
                <ChevronDown className="w-4 h-4 text-purple-1 md:hidden" />
            </SheetTrigger>
            <SheetContent className="bg-light-sidebar dark:bg-dark-sidebar flex flex-col">
                <Link href="/dashboard" className="flex gap-3">
                    <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                    <h1 className="text-4xl text-black dark:text-white font-bold">kanban</h1>
                </Link>

                <div className="mt-10">
                    <p className="uppercase text-dark-gray_text font-semibold px-7">All boards <span>({boards.length})</span></p>

                    <div className="flex flex-col mt-5 gap-1">
                        <ScrollArea className="max-h-[400px] overflow-y-scroll">
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
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileSidebar