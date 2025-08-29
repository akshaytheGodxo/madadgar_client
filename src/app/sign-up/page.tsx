"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
export default function SignUp() {
    const [email, setEmail] = useState("");
    const [type, setType] = useState("individual");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                type: type,
                currentBadges: 0,
                createdAt: new Date()
            })
            console.log("User signed up:", user);

            router.push("/dashboard?tab=home"); 
        } catch (err: any) {
            console.error("Signup error:", err.message);
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
                                Create Account
                            </h2>
                            <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
                            <div className="flex justify-center my-2">
                                <button className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                    <img
                                        src="https://img.icons8.com/color/48/000000/google-logo.png"
                                        alt="Google"
                                        className="h-6 w-6"
                                    />
                                </button>
                                <button className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                    <img

                                        src="https://img.icons8.com/ios-filled/50/000000/facebook-new.png"
                                        alt="Facebook"
                                        className="h-6 w-6"
                                    />
                                </button>
                                <button className="border-2 border-gray-200 rounded-full p-3 mx-1">
                                    <img
                                        src="https://img.icons8.com/ios-filled/50/000000/twitter.png"
                                        alt="Twitter"
                                        className="h-6 w-6"
                                    />
                                </button>
                            </div>
                            <p className="text-gray-400 my-3">or use your email for registration</p>
                            <div className="flex flex-col items-center">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <select
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="individual">Individual</option>
                                    <option value="organization">Organization</option>
                                </select>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="border-2 border-gray-200 rounded-xl p-3 w-80 my-2"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button onClick={handleSignup} className="bg-green-500 text-white rounded-xl py-3 w-80 my-2 hover:bg-green-600 transition duration-300">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-2"></div>
                        <p className="mb-10">To keep connected with us please login with your personal info</p>
                        <button className="bg-white text-green-500 rounded-xl py-3 px-8 hover:bg-gray-100 transition duration-300">
                            <a href="/sign-in">Sign In</a>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}