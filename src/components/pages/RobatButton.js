// import React, { useState, useEffect } from "react";

// export const RobatButton = () => {
//     const API_KEY = "363JOAYIEASLABA7";

//     const [mode, setMode] = useState("manual");
//     const [activeMove, setActiveMove] = useState(null);
//     const [timer, setTimer] = useState(0);
//     const [isLocked, setIsLocked] = useState(false);
//     const [message, setMessage] = useState("MANUAL MODE ON");

//     const sendToThingSpeak = (fields) => {
//         const url = `https://api.thingspeak.com/update?api_key=${API_KEY}&field1=${fields[0]}&field2=${fields[1]}&field3=${fields[2]}&field4=${fields[3]}&field5=${fields[4]}&field6=${fields[5]}`;
//         fetch(url).catch(() => { });
//     };

//     const makePayload = (move, currentMode) => {
//         const fields = [0, 0, 0, 0, 0, 0];

//         if (currentMode === "auto") fields[4] = 1;
//         else fields[5] = 1;

//         if (move !== null) fields[move] = 1;

//         return fields;
//     };

//     // Timer
//     useEffect(() => {
//         let interval;

//         if (timer > 0) {
//             interval = setInterval(() => {
//                 setTimer((prev) => prev - 1);
//             }, 1000);
//         } else if (timer === 0 && isLocked) {
//             setIsLocked(false); // unlock
//         }

//         return () => clearInterval(interval);
//     }, [timer]);

//     // Mode change (LOCK APPLIED)
//     const handleMode = (type) => {
//         if (isLocked) return; // 🚫 block during lock

//         setMode(type);
//         setActiveMove(null);
//         setTimer(15);
//         setIsLocked(true);

//         sendToThingSpeak(makePayload(null, type));
//         setMessage(`${type.toUpperCase()} MODE ON`);
//     };

//     // Movement
//     const handleMovement = (index, name) => {
//         if (mode === "manual") return;

//         // Same OFF allow
//         if (activeMove === index) {
//             setActiveMove(null);
//             setTimer(0);
//             setIsLocked(false);

//             sendToThingSpeak(makePayload(null, "auto"));
//             setMessage("AUTO MODE ON");
//             return;
//         }

//         if (isLocked) return; // 🚫 block

//         setActiveMove(index);
//         setTimer(15);
//         setIsLocked(true);

//         sendToThingSpeak(makePayload(index, "auto"));
//         setMessage(`AUTO + ${name.toUpperCase()} ON`);
//     };

//     const Switch = ({ active, onClick, disabled }) => (
//         <div
//             onClick={!disabled ? onClick : null}
//             className={`w-14 h-7 flex items-center rounded-full p-1 transition ${active ? "bg-green-500" : "bg-gray-300"
//                 } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//         >
//             <div
//                 className={`bg-white w-5 h-5 rounded-full shadow transform transition ${active ? "translate-x-7" : ""
//                     }`}
//             />
//         </div>
//     );

//     const movement = [
//         { name: "Forward", index: 0 },
//         { name: "Backward", index: 1 },
//         { name: "Right", index: 2 },
//         { name: "Left", index: 3 },
//     ];
//     return (
//         <div className="bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6 rounded-2xl shadow-xl border">
//             <div className="w-full max-w-5xl space-y-6">

//                 {/* Header Card */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg text-center transition hover:shadow-xl">
//                     <h1 className="text-3xl font-bold tracking-tight">🤖 Robot Control</h1>

//                     <p className="mt-3 text-gray-600 font-medium text-lg">
//                         {message}
//                     </p>

//                     {timer > 0 && (
//                         <p className="text-yellow-500 font-semibold bg-yellow-100 rounded-xl">
//                             Please wait... Next action in {timer}s
//                         </p>
//                     )}
//                 </div>

//                 {/* Main Section */}
//                 <div className="grid md:grid-cols-2 gap-6">

//                     {/* Mode Card */}
//                     <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition">
//                         <h2 className="text-center font-semibold text-lg mb-5 text-gray-700">
//                             ⚙️ Mode Selection
//                         </h2>

//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
//                                 <span className="font-medium text-gray-700">Auto</span>
//                                 <Switch
//                                     active={mode === "auto"}
//                                     onClick={() => handleMode("auto")}
//                                 />
//                             </div>

//                             <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
//                                 <span className="font-medium text-gray-700">Manual</span>
//                                 <Switch
//                                     active={mode === "manual"}
//                                     onClick={() => handleMode("manual")}
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Movement Card */}
//                     <div className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition">
//                         <h2 className="text-center font-semibold text-lg mb-5 text-gray-700">
//                             Robot Movement
//                         </h2>

//                         <div className="space-y-4">
//                             {movement.map((btn) => (
//                                 <div
//                                     key={btn.index}
//                                     className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition"
//                                 >
//                                     <span className="font-medium text-gray-700">
//                                         {btn.name}
//                                     </span>

//                                     <Switch
//                                         active={activeMove === btn.index}
//                                         onClick={() => handleMovement(btn.index, btn.name)}
//                                         disabled={
//                                             mode === "manual" ||
//                                             (isLocked && activeMove !== btn.index)
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };











import React, { useState, useEffect } from "react";

export const RobatButton = () => {
    const API_KEY = "1M1U0ROK5S25TR85";

    const [isAuto, setIsAuto] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [message, setMessage] = useState("MANUAL MODE");

    // ================= API =================
    const sendToThingSpeak = (btn, autoMode) => {
        const data = {
            forward: 0,
            backward: 0,
            right: 0,
            left: 0,
            sprayer: 0,
            auto: autoMode ? 1 : 0,
            manual: autoMode ? 0 : 1,
        };

        if (btn) data[btn] = 1;

        const url = `https://api.thingspeak.com/update?api_key=${API_KEY}
        &field1=${data.forward}
        &field2=${data.backward}
        &field3=${data.right}
        &field4=${data.left}
        &field5=${data.auto}
        &field6=${data.manual}
        &field7=${data.sprayer}`;

        fetch(url).catch(() => { });
    };

    // ================= TIMER =================
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

    // ================= MODE =================
    const handleModeToggle = () => {
        if (isLocked || activeButton !== null) return;

        const newMode = !isAuto;
        setIsAuto(newMode);

        setTimer(15);
        setIsLocked(true);

        sendToThingSpeak(null, newMode);
        setMessage(newMode ? "AUTO MODE ON" : "MANUAL MODE ON");
    };

    // ================= CONTROL BUTTONS =================
    const handleToggle = (btn) => {
        // OFF
        if (activeButton === btn) {
            setActiveButton(null);
            setTimer(0);
            setIsLocked(false);

            sendToThingSpeak(null, isAuto);
            setMessage(isAuto ? "AUTO MODE" : "MANUAL MODE");
            return;
        }

        // BLOCK
        if (activeButton !== null || isLocked) return;

        // ON
        setActiveButton(btn);
        setTimer(15);
        setIsLocked(true);

        sendToThingSpeak(btn, isAuto);
        setMessage(`${btn.toUpperCase()} ON`);
    };

    // ================= SWITCH =================
    const Switch = ({ active, onClick, disabled }) => (
        <div
            onClick={!disabled ? onClick : null}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition ${active ? "bg-blue-600" : "bg-gray-600"
                } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <div
                className={`bg-gray-200 w-5 h-5 rounded-full shadow transform transition ${active ? "translate-x-7" : ""
                    }`}
            />
        </div>
    );

    const movementButtons = ["forward", "backward", "right", "left"];

    return (
        <div className="bg-indigo-100 px-5 py-5 rounded-xl">
            <div className="mx-auto space-y-6">
                {/* HEADER */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-700 rounded-2xl shadow-xl border border-gray-800 p-5 w-full">
                    <h1 className="text-xl md:text-2xl font-bold text-center text-blue-400">
                        🤖 Wind Spray Control
                    </h1>

                    <p className="text-center text-gray-300 mt-2">{message}</p>

                    {timer > 0 && (
                        <p className="text-center text-red-400 font-semibold mt-2">
                            ⏳ Wait {timer}s
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ================= CARD 1 : MODE + SPRAYER ================= */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-5">
                        <h2 className="text-lg font-semibold text-blue-400 mb-4">
                            Mode & Sprayer
                        </h2>

                        <div className="space-y-3">
                            {/* AUTO / MANUAL */}
                            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
                                <span className="text-gray-300">
                                    Mode (Auto / Manual)
                                </span>
                                <Switch
                                    active={isAuto}
                                    onClick={handleModeToggle}
                                    disabled={activeButton !== null || isLocked}
                                />
                            </div>

                            {/* SPRAYER */}
                            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
                                <span className="text-gray-300">Sprayer</span>
                                <Switch
                                    active={activeButton === "sprayer"}
                                    onClick={() => handleToggle("sprayer")}
                                    disabled={
                                        (activeButton !== null &&
                                            activeButton !== "sprayer") ||
                                        isLocked
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ================= CARD 2 : MOVEMENT ================= */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-5">
                        <h2 className="text-lg font-semibold text-blue-400 mb-4">
                            Movement
                        </h2>

                        <div className="space-y-3">
                            {movementButtons.map((btn) => (
                                <div
                                    key={btn}
                                    className="flex justify-between items-center p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
                                >
                                    <span className="capitalize text-gray-300">
                                        {btn}
                                    </span>

                                    <Switch
                                        active={activeButton === btn}
                                        onClick={() => handleToggle(btn)}
                                        disabled={
                                            (activeButton !== null &&
                                                activeButton !== btn) ||
                                            isLocked
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