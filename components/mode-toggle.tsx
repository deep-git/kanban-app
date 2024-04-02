"use client";

import Image from 'next/image'
import React, { useState } from 'react'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'

const ModeToggle = () => {

    const { setTheme } = useTheme();
    const [switchTheme, setSwitchTheme] = useState(false);

    const handleTheme = () => {
        setSwitchTheme(prev => !prev);
        if (switchTheme) {
            setTheme("light");
        } else {
            setTheme("dark")
        }
    }

    return (
        <div className="flex gap-5 bg-dark-board_background w-full px-5 py-4 justify-center items-center rounded-lg">
            <Image src="/icon-light-theme.svg" alt="Light mode" width={20} height={20} className="object-contain" />
            <Switch className="text-purple-1" checked={switchTheme} onCheckedChange={() => handleTheme()} />
            <Image src="/icon-dark-theme.svg" alt="Dark mode" width={20} height={20} className="object-contain" />
        </div>
    )
}

export default ModeToggle