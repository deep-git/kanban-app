import React from 'react'
import NewColumn from './new-column'
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import DisplayColumns from './display-columns';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface BoardContentProps {
    board: {
        id: string;
        name: string;
        profileId: string;
        createdAt: Date;
        updatedAt: Date;
    } | null
}

const BoardContent = async ({ board }: BoardContentProps) => {

    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    const columns = await db.columns.findMany({
        where: {
            boardId: board?.id,
            profileId: profile?.id
        }
    });

    return (
        <ScrollArea>
            <div className="w-full flex gap-10 p-5 bg-dark-board_background text-card min-h-[calc(100vh-100px)]">
                {columns && columns.map((column) => (
                    <DisplayColumns key={column.id} column={column} />
                ))}
                <NewColumn board={board} />
            </div>
            <ScrollBar orientation="horizontal" className="mb-5" />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default BoardContent