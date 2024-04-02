import Image from 'next/image'
import React from 'react'
import { Switch } from '../ui/switch'
import ModeToggle from '../mode-toggle'
import { CgDisplayGrid } from "react-icons/cg";
import { SignOutButton, UserButton } from '@clerk/nextjs';
import NewBoard from '../new-board';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import BoardList from '../board-list';
import Link from 'next/link';


const Sidebar = async () => {

    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    const boards = await db.boards.findMany({
        where: {
            profileId: profile?.id
        }
    });

    return (
        <div className="sticky left-0 top-0 w-[300px] h-screen bg-dark-sidebar py-7 flex flex-col">
            <Link href="/dashboard">
                <Image src="/logo-light.svg" alt="Logo" width={200} height={75} className="px-7" />
            </Link>

            <div className="mt-10">
                <p className="uppercase text-dark-gray_text font-semibold px-7">All boards <span>({boards.length})</span></p>

                <div className="flex flex-col mt-5 gap-1">

                    {boards && boards.map((board) => (
                        <Link key={board.id} href={`/dashboard/${board.name.toLowerCase().replace(" ", "-")}/${board.id}`}>
                            <BoardList key={board.id} board={board} />
                        </Link>
                    ))}

                    <div className="mt-3 px-7">
                        <NewBoard />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center mt-auto px-7 h-max gap-5">
                <ModeToggle />

                <UserButton />

                <div className="flex gap-3 cursor-pointer">
                    <Image src="/icon-hide-sidebar.svg" alt="Hide" width={20} height={20} className="object-contain" />
                    <span className="text-dark-gray_text">Hide Sidebar</span>
                </div>
            </div>
        </div >
    )
}

export default Sidebar