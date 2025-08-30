import Link from "next/link"
export default function Games() {
    return (
        <div className="p-8  min-h-screen text-white">
            <button className="bg-green-500 w-full h-14">
                <Link href="http://2d-game-eight.vercel.app " target="_blank">Start Playing</Link>
            </button>
        </div>
    )
}