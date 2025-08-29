"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential.user);
            router.push("/dashboard"); 
        } catch (err: any) {
            console.error("Sign-in error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                    <div className="w-3/5 p-5">
                        <div className="text-left font-bold">
                            <span className="text-green-500">Madad</span>gaar
                        </div>
                        <div className="py-10">
                            <h2 className="text-3xl font-bold text-green-500 mb-2">
                                Sign In to Your Account
                            </h2>
                            <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
                            <p className="text-gray-400 my-3">or use your email account</p>

                            <form
                                onSubmit={handleSignIn}
                                className="flex flex-col items-center"
                            >
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 text-white rounded-xl py-3 w-80 my-2 hover:bg-green-600 transition duration-300 disabled:opacity-50"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                        <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-2"></div>
                        <p className="mb-10">
                            Enter your personal details and start your journey with us
                        </p>
                        <button
                            onClick={() => router.push("/sign-up")}
                            className="bg-white text-green-500 rounded-xl py-3 px-8 hover:bg-gray-100 transition duration-300"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
