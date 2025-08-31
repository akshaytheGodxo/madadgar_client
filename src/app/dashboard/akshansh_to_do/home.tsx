export default function Home() {
  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-500 mb-2">
          🌍 Live Weather Map
        </h1>
        <p className="text-gray-300">
          Explore real-time weather updates and disaster risks worldwide
        </p>
      </div>

      {/* Weather Map */}
      <div className="w-full max-w-6xl mx-auto mb-10 bg-black rounded-2xl shadow-xl overflow-hidden border border-green-500">
        <iframe
          src="/map/index2.html"
          className="w-full h-[600px]"
        />
      </div>

      {/* Disaster Risk Map */}
      <div className="w-full max-w-6xl mx-auto bg-black rounded-2xl shadow-xl overflow-hidden border border-red-500">
        <div className="p-4 bg-gray-900 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">
            ⚠ Disaster Risk Zones
          </h2>
          <p className="text-gray-300 text-sm">
            Visualize potential hazards and risk-prone areas
          </p>
        </div>
        <iframe
          src="/disasterMap/index.html"
          className="w-full h-[600px]"
        />
      </div>
    </div>
  )
}
