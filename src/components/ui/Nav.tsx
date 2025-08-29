'use client';
import Link from "next/link";
import {auth} from "@/lib/firebase";
export default function Navbar() {
    const user = auth.currentUser;

    return (
        <nav className="p-6 flex sm:flex-row flex-col items-center justify-between">
            <div>
                <h1 className="text-4xl font-[Metrophobic]"><span className="text-green-500">Madad</span>gaar</h1>
            </div>
            {/*  */}
            <div className="flex gap-6 text-lg font-[Metrophobic]">
                <Link href={'/about'}>About us</Link>
                <Link href={'/contacts'}>Contact us</Link>
                <Link href={'/faqs'}>FAQs</Link>
            </div>

            <div className="flex gap-6 font-semibold">
                {!user ? (<div className="flex gap-6 font-semibold">
                    <button className="bg-transparent  "><Link href={'/sign-in'}>Login</Link></button>
                    <button className="bg-black w-40 h-14 rounded-lg items-center justify-center">
                        <Link href={'/sign-up'} className="text-white">Create an account?</Link>
                    </button>
                </div>) : (<button className="bg-black w-40 h-14 rounded-lg text-white"> 
                    <Link href={'/dashboard?tab=home'}>Go to Dashboard</Link>
                </button>)}
            </div>
        </nav>
    )
}