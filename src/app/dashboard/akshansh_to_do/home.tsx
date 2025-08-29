export default function Home() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
                    🌍 Live Weather Map
                </h1>
                <div className="flex-1 w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <iframe
                        src="/map/index2.html"
                        className="w-full h-full"
                    />
                </div>
        </div>
    )
}