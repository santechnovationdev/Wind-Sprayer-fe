import React, { useEffect, useMemo, useState } from "react";

export const HomeTwo = () => {
    const [feedsTwo, setFeedsTwo] = useState([]);

    const urlTwo = process.env.REACT_APP_ThinkSpeak_URL_Two;

    useEffect(() => {
        if (!urlTwo) return;

        let interval;

        const fetchData = async () => {
            try {
                const res = await fetch(urlTwo);
                const json = await res.json();

                if (!json?.feeds?.length) return;

                setFeedsTwo(json.feeds);
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        fetchData();
        interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [urlTwo]);

    // ✅ Auto Mode (field5)
    const autoFeeds = useMemo(() => {
        return feedsTwo
            .filter(f => f.field5 === "1")
            .slice(-10)
            .reverse();
    }, [feedsTwo]);


    console.log("Auto feeds", autoFeeds)

    // ✅ Manual Mode (field6)
    const manualFeeds = useMemo(() => {
        return feedsTwo
            .filter(f => f.field6 === "1")
            .slice(-10)
            .reverse();
    }, [feedsTwo]);

    const getStatus = (value) => value === "1" ? "ON" : "OFF";

    const getBadge = (value) =>
        value === "1"
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-500";

    const getTime = (date) =>
        new Date(date).toLocaleString();

    return (
        <div className="p-4 md:p-6 space-y-8">

            {/* 🔥 AUTO MODE TABLE */}
            <div>
                <h2 className="text-xl font-bold mb-3">
                    🚜 Auto Mode History (Last 10)
                </h2>

                <div className="overflow-x-auto rounded-2xl bg-white shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-sm">ID</th>
                                <th className="px-4 py-3 text-sm">Time</th>
                                <th className="px-4 py-3 text-sm">Forward</th>
                                <th className="px-4 py-3 text-sm">Backward</th>
                                <th className="px-4 py-3 text-sm">Right</th>
                                <th className="px-4 py-3 text-sm">Left</th>
                            </tr>
                        </thead>

                        <tbody>
                            {autoFeeds.length > 0 ? (
                                autoFeeds.map(feed => (
                                    <tr key={feed.entry_id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-center">{feed.entry_id}</td>
                                        <td className="px-4 py-3 text-sm text-center">{getTime(feed.created_at)}</td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${getBadge(feed.field1)}`}>
                                                {getStatus(feed.field1)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${getBadge(feed.field2)}`}>
                                                {getStatus(feed.field2)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${getBadge(feed.field3)}`}>
                                                {getStatus(feed.field3)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${getBadge(feed.field4)}`}>
                                                {getStatus(feed.field4)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">
                                        No Auto Mode records
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🔥 MANUAL MODE TABLE */}
            <div>
                <h2 className="text-xl font-bold mb-3">
                    🛠 Manual Mode History (Last 10)
                </h2>

                <div className="overflow-x-auto rounded-2xl bg-white shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-sm">ID</th>
                                <th className="px-4 py-3 text-sm">Time</th>
                                <th className="px-4 py-3 text-sm">Manual Mode</th>
                            </tr>
                        </thead>

                        <tbody>
                            {manualFeeds.length > 0 ? (
                                manualFeeds.map(feed => (
                                    <tr key={feed.entry_id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-center">{feed.entry_id}</td>
                                        <td className="px-4 py-3 text-sm text-center">{getTime(feed.created_at)}</td>

                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 text-xs rounded ${getBadge(feed.field6)}`}>
                                                {getStatus(feed.field6)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-6 text-gray-500">
                                        No Manual Mode records
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};