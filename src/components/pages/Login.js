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
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10 transition-colors duration-300 dark:bg-slate-950">
            <div className="w-full max-w-md rounded-[32px] border border-slate-200/70 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition dark:border-slate-800/70 dark:bg-slate-900/95 dark:shadow-slate-950/40">
                <div className="text-center mb-8">
                    <img
                        src={LoginImg}
                        alt="Wind Sprayer Logo"
                        className="mx-auto h-20 w-20 rounded-full border border-slate-200/25 shadow-lg dark:border-slate-700/60"
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-4 dark:text-slate-100">Welcome Back</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Log in to access your agricultural dashboard and automated sprayer controls.
                    </p>
                </div>

                <form onSubmit={HandleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            autoComplete="email"
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                        />
                    </div>

                    {error && <p className="text-center text-sm text-rose-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:brightness-110"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <a href="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200">
                        Create one now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;