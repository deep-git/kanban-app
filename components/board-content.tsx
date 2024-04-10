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

    if (!columns) {
        return null;
    }

    let columnNames: {
        id: string,
        name: string
    }[] = [];

    for (let i = 0; i < columns.length; i++) {
        columnNames.push({
            id: columns[i].id,
            name: columns[i].name,
        });
    }

    return (
        <ScrollArea className="w-full">
            <div className="flex gap-10 p-5 bg-light-board_background dark:bg-dark-board_background text-card min-h-[calc(100vh-100px)]">
                {columns && columns.map(async (column) => {
                    const tasks = await db.tasks.findMany({
                        where: {
                            profileId: profile?.id,
                            boardId: board?.id,
                            columnId: column?.id
                        }
                    });

                    const subtasks = await db.subtasks.findMany({
                        where: {
                            columnId: column?.id
                        }
                    })

                    return (
                        <DisplayColumns key={column?.id} column={column} tasks={tasks} subtasks={subtasks} columnNames={columnNames} />

                    )
                })}
                <NewColumn board={board} />

            </div>
            <ScrollBar orientation="horizontal" className="mb-5" />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}

export default BoardContent