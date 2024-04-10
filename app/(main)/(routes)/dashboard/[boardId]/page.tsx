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

    const boards = await db.boards.findMany({
        where: {
            profileId: profile.id
        }
    });

    if (!boards) {
        return null;
    }

    const board = await db.boards.findUnique({
        where: {
            id: params.boardId,
            profileId: profile.id,
        }
    });

    if (!board) {
        return null;
    }

    const columns = await db.columns.findMany({
        where: {
            boardId: board?.id,
            profileId: profile?.id
        }
    });

    if (!columns) {
        return null;
    }

    let columnNames = [];

    for (let i = 0; i < columns.length; i++) {
        columnNames.push({
            id: columns[i].id,
            name: columns[i].name,
        });
    }

    return (
        <div className="relative flex flex-col w-full min-h-screen">
            <Navbar board={board} boards={boards} columnNames={columnNames} columns={columns} />

            <div className="absolute bottom-0 left-0 right-0 w-full">
                <BoardContent board={board} />
            </div>
        </div>
    )
}

export default BoardIdPage