import React, { useEffect, useState } from "react";

const API_KEY = "1M1U0ROK5S25TR85";
const MOVEMENT_BUTTONS = [
    { key: "forward", label: "Forward" },
    { key: "backward", label: "Backward" },
    { key: "right", label: "Right" },
    { key: "left", label: "Left" },
];

const formatThingSpeakUrl = (payload) => {
    const params = new URLSearchParams({
        api_key: API_KEY,
        field1: String(payload.forward),
        field2: String(payload.backward),
        field3: String(payload.right),
        field4: String(payload.left),
        field5: String(payload.auto),
        field6: String(payload.manual),
        field7: String(payload.sprayer),
    });
    return `https://api.thingspeak.com/update?${params.toString()}`;
};

const ToggleButton = ({ active, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition ${active ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
        {active ? "Active" : "Off"}
    </button>
);

export const RobatButton = () => {
    const [isAuto, setIsAuto] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState("MANUAL MODE");

    const sendToThingSpeak = (btn, autoMode) => {
        const payload = {
            forward: 0,
            backward: 0,
            right: 0,
            left: 0,
            sprayer: 0,
            auto: autoMode ? 1 : 0,
            manual: autoMode ? 0 : 1,
        };

        if (btn) {
            payload[btn] = 1;
        }

        fetch(formatThingSpeakUrl(payload)).catch(() => {
            // ignore errors for now
        });
    };

    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && isLocked) {
            setIsLocked(false);
        }

        return () => clearInterval(interval);
    }, [timer, isLocked]);

    const handleModeToggle = () => {
        if (isLocked || activeButton !== null) return;

        const nextMode = !isAuto;
        setIsAuto(nextMode);
        setTimer(15);
        setIsLocked(true);
        sendToThingSpeak(null, nextMode);
        setMessage(nextMode ? "AUTO MODE ON" : "MANUAL MODE ON");
    };

    const handleControlToggle = (btn) => {
        if (activeButton === btn) {
            setActiveButton(null);
            setTimer(0);
            setIsLocked(false);
            sendToThingSpeak(null, isAuto);
            setMessage(isAuto ? "AUTO MODE" : "MANUAL MODE");
            return;
        }

        if (activeButton !== null || isLocked) return;

        setActiveButton(btn);
        setTimer(15);
        setIsLocked(true);
        sendToThingSpeak(btn, isAuto);
        setMessage(`${btn.toUpperCase()} ON`);
    };

    return (
        <section className=" border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/30">
            <div className="grid w-full mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Robot dashboard</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900">Wind Sprayer Control</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-3xl bg-emerald-50 p-4 text-slate-900 ring-1 ring-emerald-100">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
                        <p className="mt-2 text-xl font-semibold">{message}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-slate-900 ring-1 ring-slate-200">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Timer</p>
                        <p className="mt-2 text-xl font-semibold text-emerald-700">{timer > 0 ? `${timer}s` : "Ready"}</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Mode control</h3>
                            <p className="text-sm text-slate-500">Switch between manual and automatic operation.</p>
                        </div>
                        <ToggleButton
                            active={isAuto}
                            onClick={handleModeToggle}
                            disabled={activeButton !== null || isLocked}
                        />
                    </div>

                    <div className="mt-6 grid gap-3">
                        <div className="rounded-3xl border border-emerald-100 bg-white p-4">
                            <p className="text-sm text-slate-500">Current mode</p>
                            <p className="mt-2 text-xl font-semibold text-slate-900">{isAuto ? "Automatic" : "Manual"}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-500">Sprayer</p>
                                    <p className="mt-1 text-sm text-slate-400">Toggle the spray output</p>
                                </div>
                                <ToggleButton
                                    active={activeButton === "sprayer"}
                                    onClick={() => handleControlToggle("sprayer")}
                                    disabled={(activeButton !== null && activeButton !== "sprayer") || isLocked}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Movement controls</h3>
                        <p className="text-sm text-slate-500">Activate one direction at a time.</p>
                    </div>
                    <div className="mt-6 grid gap-3">
                        {MOVEMENT_BUTTONS.map((item) => {
                            const active = activeButton === item.key;
                            const disabled = (activeButton !== null && !active) || isLocked;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => handleControlToggle(item.key)}
                                    disabled={disabled}
                                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${active
                                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                                        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-900">{item.label}</p>
                                            <p className="mt-1 text-xs text-slate-500">{active ? "Running" : disabled ? "Locked" : "Tap to activate"}</p>
                                        </div>
                                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                                            {active ? "ON" : "OFF"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
          </div>
        </section>
    );
};
