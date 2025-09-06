import Link from "next/link"

export default function Games() {
    return (
        <div className="p-8 min-h-screen text-white flex flex-col gap-6 items-stretch">
            <Link href="https://2d-game-eight.vercel.app" target="_blank" className="w-full">
                <button className="bg-green-500 w-full py-6 rounded text-white text-lg shadow hover:bg-green-600 transition">
                    3D Disaster Response Training
                </button>
            </Link>
            <Link href="https://quizgame-weld.vercel.app/" target="_blank" className="w-full">
                <button className="bg-green-500 w-full py-6 rounded text-white text-lg shadow hover:bg-green-600 transition">
                    Quiz Game
                </button>
            </Link>
        </div>
    )
}
