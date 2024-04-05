import Navbar from '@/components/navigation/navbar'
import Sidebar from '@/components/navigation/sidebar'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div className="hidden md:flex">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1">
                {children}
            </div>
        </div>
    )
}

export default MainLayout