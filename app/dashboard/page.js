"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logout } from "@/services/auth";
import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
    LayoutDashboard,
    LogOut,
    User,
    Settings,
    BarChart3,
    Bell,
    Search,
    Zap,
} from "lucide-react";

export default function Dashboard() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState(null);

    const router = useRouter();

    // 🔐 Protect route + get user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            router.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
            setIsLoggingOut(false);
        }
    };

    const stats = [
        { label: "Active Projects", value: "12", icon: Zap, color: "text-blue-500" },
        { label: "Total Revenue", value: "$4,250", icon: BarChart3, color: "text-emerald-500" },
        { label: "Account Status", value: "Premium", icon: User, color: "text-violet-500" },
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">

            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-white/5 backdrop-blur-xl hidden md:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="text-white h-5 w-5" fill="currentColor" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Auth Dashboard</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Overview" active />
                    <NavItem icon={BarChart3} label="Analytics" />
                    <NavItem icon={Settings} label="Settings" />
                </nav>

                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto group"
                >
                    <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    {isLoggingOut ? "Signing out..." : "Logout"}
                </button>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col">

                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0f172a]/50 backdrop-blur-md sticky top-0 z-20">

                    <div className="relative w-96 hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search analytics..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
                        </button>

                        {/* 👤 User Avatar */}
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 border border-white/20 flex items-center justify-center text-xs font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8 max-w-7xl mx-auto w-full">

                    {/* 👋 Welcome Section */}
                    <header className="mb-10">
                        <h2 className="text-3xl font-bold text-white">
                            Welcome back{user?.displayName ? `, ${user.displayName}` : ""} 👋
                        </h2>

                        <p className="text-slate-400 mt-1">
                            {user?.email
                                ? `Logged in as ${user.email}`
                                : "Loading user info..."}
                        </p>
                    </header>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                            >
                                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart Placeholder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full h-64 bg-white/5 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-500"
                    >
                        <BarChart3 className="h-10 w-10 mb-4 opacity-20" />
                        <p>Your analytics visualization will appear here.</p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

// Nav Item Component
function NavItem({ icon: Icon, label, active = false }) {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
        >
            <Icon className="h-5 w-5" />
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
}