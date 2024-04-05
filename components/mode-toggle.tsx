"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'
import { effect } from 'zod';

const ModeToggle = () => {

    const { setTheme } = useTheme();
    const [switchTheme, setSwitchTheme] = useState(false);

    const handleTheme = (e: any) => {
        setSwitchTheme(prev => !prev);
        console.log(e);
        if (e) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    }

    return (
        <div className="flex gap-5 bg-light-board_background dark:bg-dark-board_background w-full px-5 py-4 justify-center items-center rounded-lg">
            <Image src="/icon-light-theme.svg" alt="Light mode" width={20} height={20} className="object-contain" />
            <Switch className="text-purple-1" checked={switchTheme} onCheckedChange={(e) => handleTheme(e)} />
            <Image src="/icon-dark-theme.svg" alt="Dark mode" width={20} height={20} className="object-contain" />
        </div>
    )
}

export default ModeToggle