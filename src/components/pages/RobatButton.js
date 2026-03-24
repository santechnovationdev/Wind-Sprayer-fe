import React, { useState, useEffect } from "react";

export const RobatButton = () => {
    const API_KEY = "363JOAYIEASLABA7";

    const [mode, setMode] = useState("manual");
    const [activeMove, setActiveMove] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState("MANUAL MODE ON");

    const sendToThingSpeak = (fields) => {
        const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field1=${fields[0]}&field2=${fields[1]}&field3=${fields[2]}&field4=${fields[3]}&field5=${fields[4]}&field6=${fields[5]}`;
        fetch(url).catch(() => { });
    };

    const makePayload = (move, currentMode) => {
        const fields = [0, 0, 0, 0, 0, 0];

        if (currentMode === "auto") fields[4] = 1;
        else fields[5] = 1;

        if (move !== null) fields[move] = 1;

        return fields;
    };

    // Timer
    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && isLocked) {
            setIsLocked(false); // unlock
        }

        return () => clearInterval(interval);
    }, [timer]);

    // Mode change (LOCK APPLIED)
    const handleMode = (type) => {
        if (isLocked) return; // 🚫 block during lock

        setMode(type);
        setActiveMove(null);
        setTimer(15);
        setIsLocked(true);

        sendToThingSpeak(makePayload(null, type));
        setMessage(`${type.toUpperCase()} MODE ON`);
    };

    // Movement
    const handleMovement = (index, name) => {
        if (mode === "manual") return;

        // Same OFF allow
        if (activeMove === index) {
            setActiveMove(null);
            setTimer(0);
            setIsLocked(false);

            sendToThingSpeak(makePayload(null, "auto"));
            setMessage("AUTO MODE ON");
            return;
        }

        if (isLocked) return; // 🚫 block

        setActiveMove(index);
        setTimer(15);
        setIsLocked(true);

        sendToThingSpeak(makePayload(index, "auto"));
        setMessage(`AUTO + ${name.toUpperCase()} ON`);
    };

    const Switch = ({ active, onClick, disabled }) => (
        <div
            onClick={!disabled ? onClick : null}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition ${active ? "bg-green-500" : "bg-gray-300"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <div
                className={`bg-white w-5 h-5 rounded-full shadow transform transition ${active ? "translate-x-7" : ""
                    }`}
            />
        </div>
    );

    const movement = [
        { name: "Forward", index: 0 },
        { name: "Backward", index: 1 },
        { name: "Right", index: 2 },
        { name: "Left", index: 3 },
    ];
    return (
        <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6 rounded-2xl shadow-xl border">
            <div className="w-full max-w-5xl space-y-6">

                {/* Header Card */}
                <div className="bg-white p-6 rounded-3xl shadow-lg text-center transition hover:shadow-xl">
                    <h1 className="text-3xl font-bold tracking-tight">🤖 Robot Control</h1>

                    <p className="mt-3 text-gray-600 font-medium text-lg">
                        {message}
                    </p>

                    {timer > 0 && (
                        <p className="text-yellow-500 font-semibold bg-yellow-100 rounded-xl">
                            Please wait... Next action in {timer}s
                        </p>
                    )}
                </div>

                {/* Main Section */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Mode Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition">
                        <h2 className="text-center font-semibold text-lg mb-5 text-gray-700">
                            ⚙️ Mode Selection
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">Auto</span>
                                <Switch
                                    active={mode === "auto"}
                                    onClick={() => handleMode("auto")}
                                />
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="font-medium text-gray-700">Manual</span>
                                <Switch
                                    active={mode === "manual"}
                                    onClick={() => handleMode("manual")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Movement Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition">
                        <h2 className="text-center font-semibold text-lg mb-5 text-gray-700">
                            Robot Movement
                        </h2>

                        <div className="space-y-4">
                            {movement.map((btn) => (
                                <div
                                    key={btn.index}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition"
                                >
                                    <span className="font-medium text-gray-700">
                                        {btn.name}
                                    </span>

                                    <Switch
                                        active={activeMove === btn.index}
                                        onClick={() => handleMovement(btn.index, btn.name)}
                                        disabled={
                                            mode === "manual" ||
                                            (isLocked && activeMove !== btn.index)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};