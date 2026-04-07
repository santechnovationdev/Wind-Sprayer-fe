import React, { useState, useContext } from "react";
import { DContext } from "../../context/Datacontext";
import LoginImg from "../../assets/Logo.jpg";

const Register = () => {
    const { setIsAuth, setCurrentUser, BeURL } = useContext(DContext);

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !contact || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${BeURL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ fullname: name, email, contact, password }),
            });

            const data = await res.json();
            if (data.success) {
                setIsAuth(true);
                setCurrentUser(data.user);
                window.location.href = "/";
            } else {
                setError(data.message || "Registration failed");
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
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-4 dark:text-slate-100">Create your account</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Secure setup in seconds for your farm automation dashboard.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {[
                        { label: 'Full Name', value: name, onChange: setName, type: 'text', autoComplete: 'name' },
                        { label: 'Contact Number', value: contact, onChange: setContact, type: 'tel', autoComplete: 'tel' },
                        { label: 'Email Address', value: email, onChange: setEmail, type: 'email', autoComplete: 'email' },
                        { label: 'Password', value: password, onChange: setPassword, type: 'password', autoComplete: 'new-password' },
                        { label: 'Confirm Password', value: confirmPassword, onChange: setConfirmPassword, type: 'password', autoComplete: 'new-password' },
                    ].map((field, idx) => (
                        <div key={idx}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field.label}</label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={field.label}
                                autoComplete={field.autoComplete}
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500"
                            />
                        </div>
                    ))}

                    {error && <p className="text-center text-sm text-rose-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:brightness-110"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;