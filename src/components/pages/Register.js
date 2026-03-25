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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-700 px-4 py-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <img
                        src={LoginImg}
                        alt="Wind Sprayer Logo"
                        className="mx-auto h-20 w-20 rounded-full shadow-lg border border-white/20"
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-white mt-4">Create your account</h1>
                    <p className="mt-2 text-sm text-slate-200">Secure setup in seconds with Wind Sprayer</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {[
                        { value: name, onChange: setName, type: 'text', placeholder: 'Full Name' },
                        { value: contact, onChange: setContact, type: 'tel', placeholder: 'Contact Number' },
                        { value: email, onChange: setEmail, type: 'email', placeholder: 'Email Address' },
                        { value: password, onChange: setPassword, type: 'password', placeholder: 'Password' },
                        { value: confirmPassword, onChange: setConfirmPassword, type: 'password', placeholder: 'Confirm Password' },
                    ].map((field, idx) => (
                        <div key={idx}>
                            <label className="block text-sm text-slate-200 font-medium mb-1">{field.placeholder}</label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full mt-1 p-3 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                            />
                        </div>
                    ))}

                    {error && <p className="text-center text-sm text-rose-400">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-slate-300 mt-5">
                    Already have an account?{' '}
                    <a href="/login" className="text-cyan-300 font-semibold hover:text-cyan-100 underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;