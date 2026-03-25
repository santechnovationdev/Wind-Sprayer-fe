import React, { useState } from "react";
import { RobatButton } from "./RobatButton";

export const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [darkMode, setDarkMode] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="flex h-screen bg-gray-900 dark:bg-gray-950">

                {/* ===== SIDEBAR ===== */}
                <div className={`
                    fixed md:static z-50 top-0 left-0 h-full w-64
                    bg-gray-800 dark:bg-gray-900
                    transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 transition duration-300
                    flex flex-col justify-between
                `}>

                    {/* Top */}
                    <div>
                        <h2 className="text-2xl font-bold p-5 text-center text-blue-400">
                            Wind Sprayer
                        </h2>

                        <ul className="space-y-2 px-4 mt-7">

                            <li
                                onClick={() => {
                                    setActiveMenu("dashboard");
                                    setSidebarOpen(false);
                                }}
                                className={`p-3 rounded-lg cursor-pointer ${activeMenu === "dashboard"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                📊 Dashboard
                            </li>

                            <li
                                onClick={() => {
                                    setActiveMenu("sprayer");
                                    setSidebarOpen(false);
                                }}
                                className={`p-3 rounded-lg cursor-pointer ${activeMenu === "sprayer"
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                💧 Sprayer Value
                            </li>
                        </ul>
                    </div>

                    {/* Bottom Logout */}
                    <div className="p-4">
                        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">
                            Logout
                        </button>
                    </div>
                </div>

                {/* ===== MAIN ===== */}
                <div className="flex-1 flex flex-col w-full">

                    {/* HEADER */}
                    <div className="bg-gray-800 dark:bg-gray-900 shadow p-4 flex justify-between items-center">

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-white text-xl"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </button>

                        <h1 className="text-lg md:text-xl font-semibold text-gray-200">
                            {activeMenu === "dashboard"
                                ? "Dashboard"
                                : "Sprayer Value"}
                        </h1>

                        {/* Theme Toggle */}
                        {/* <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="bg-gray-700 px-3 py-1 rounded-lg text-white"
                        >
                            {darkMode ? "🌞" : "🌙"}
                        </button> */}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 md:p-6 text-gray-300 overflow-auto">

                        {activeMenu === "dashboard" && (
                            <div>
                                <RobatButton />
                            </div>
                        )}

                        {activeMenu === "sprayer" && (
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-blue-400">
                                    Sprayer Value 💧
                                </h2>
                                <p className="mt-2 text-gray-400">
                                    Live data integration coming soon...
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};