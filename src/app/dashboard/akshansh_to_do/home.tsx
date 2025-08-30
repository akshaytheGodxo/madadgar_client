export default function Home() {
  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-500 mb-2">
          🌍 Live Weather Map
        </h1>
        <p className="text-gray-300">
          Explore real-time weather updates across the globe
        </p>
      </div>

      {/* Map Container */}
      <div className="w-full max-w-6xl mx-auto bg-black rounded-2xl shadow-xl overflow-hidden border border-green-500">
        <iframe
          src="/map/index2.html"
          className="w-full h-[600px]"
        />
      </div>

      {/* Extra Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-black rounded-2xl shadow-md p-6 border border-green-500">
          <h2 className="text-xl font-bold text-green-500 mb-2">📍 Location</h2>
          <p className="text-gray-300">Track live weather data for your area or any region in real time.</p>
        </div>

        <div className="bg-black rounded-2xl shadow-md p-6 border border-green-500">
          <h2 className="text-xl font-bold text-green-500 mb-2">⛅ Weather Layers</h2>
          <p className="text-gray-300">Overlay temperature, precipitation, and wind layers for deeper insights.</p>
        </div>

        <div className="bg-black rounded-2xl shadow-md p-6 border border-green-500">
          <h2 className="text-xl font-bold text-green-500 mb-2">⚡ Alerts</h2>
          <p className="text-gray-300">Get notified about severe weather conditions in your region instantly.</p>
        </div>
      </div>
    </div>
  )
}
