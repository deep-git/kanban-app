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
import HideSidebar from './hide-sidebar';


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

    if (!boards) {
        return null;
    }

    return (
        <HideSidebar boards={boards} />
    )
}

export default Sidebar