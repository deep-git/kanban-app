import BoardContent from '@/components/board-content';
import Navbar from '@/components/navigation/navbar'
import { ScrollArea } from '@/components/ui/scroll-area';
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import React from 'react'

const BoardIdPage = async ({ params }: { params: { boardName: string, boardId: string } }) => {

    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    const board = await db.boards.findUnique({
        where: {
            id: params.boardId,
            profileId: profile.id,
        }
    });

    return (
        <div className="w-[calc(200vh-170px)]">

            <Navbar board={board} />

            <BoardContent board={board} />
        </div>
    )
}

export default BoardIdPage