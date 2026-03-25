import React, { useState, useContext } from "react";
import { DContext } from "../../context/Datacontext";
import LoginImg from "../../assets/Logo.jpg";

const Login = () => {
    const { setIsAuth, setCurrentUser, BeURL } = useContext(DContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const HandleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const res = await fetch(`${BeURL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                setIsAuth(true);
                setCurrentUser(data.user);
                window.location.href = "/";
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Server error. Try again!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-700 px-4 py-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <img
                        src={LoginImg}
                        alt="wind sprayer logo"
                        className="mx-auto h-20 w-20 rounded-full shadow-lg border border-white/20"
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-white mt-4">Welcome Back</h1>
                    <p className="mt-2 text-sm text-slate-200">Login to access your dashboard and robot controls</p>
                </div>

                <form onSubmit={HandleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-200 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-200 font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                        />
                    </div>

                    {error && <p className="text-center text-sm text-rose-400">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center text-slate-300 mt-5">
                    Don't have an account?{' '}
                    <a href="/register" className="text-cyan-300 font-semibold hover:text-cyan-100 underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;