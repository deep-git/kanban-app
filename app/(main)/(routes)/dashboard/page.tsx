import MobileSidebar from '@/components/navigation/mobile-sidebar';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import React from 'react'
import { BiLeftArrow } from 'react-icons/bi';

const Dashboard = async () => {

    const profile = await initialProfile();

    if (!profile) {
        return null;
    }

    const boards = await db.boards.findMany({
        where: {
            profileId: profile.id
        }
    });

    return (
        <div>
            <div className="flex md:hidden items-center px-10 gap-3 w-full h-[100px] bg-light-sidebar dark:bg-dark-sidebar">
                <Image src="/logo-mobile.svg" alt="Logo" width={30} height={30} className="object-contain" />
                <h1 className="text-3xl text-light-text dark:text-dark-text font-bold">kanban</h1>

                <MobileSidebar boards={boards} />
            </div>
            <div className="flex justify-center items-center h-[calc(100vh-100px)] md:h-screen bg-light-board_background dark:bg-dark-board_background">
                <h2 className="flex text-2xl md:text-3xl lg:text-5xl text-purple-1 gap-2 items-center"><BiLeftArrow /> Create your own board!</h2>
            </div>
        </div>
    )
}

export default Dashboard