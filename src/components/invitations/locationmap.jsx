"use client"

function LocationMap({ address }) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="text-center p-4 text-pink-800">
                <p className="mt-2">{address}</p>
                <a
                    href={`https://maps.app.goo.gl/yrb8QzRVQfJG8dyz9?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700"
                >
                    Ver en Google Maps
                </a>
            </div>
        </div>
    )
}

export default LocationMap
