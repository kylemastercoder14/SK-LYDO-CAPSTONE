import React from "react";

const TechAssistant = () => {
  return (
    <div id='officials' className="min-h-screen bg-gray-100">
      {/* Mobile & Tablet: 2x2 grid */}
      {/* Desktop: 4-column row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-full min-h-screen">
        {/* SK PEDERASYON Section */}
        <div className="group relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/sk-pederasyon.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/60 via-purple-500/60 to-blue-600/60 group-hover:backdrop-blur-sm transition-all duration-300" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest mb-2 text-shadow-lg">
                SK
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-widest text-shadow-lg">
                PEDERASYON
              </div>
            </div>
            <div className="absolute text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-6xl sm:text-7xl lg:text-9xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                1
              </span>
            </div>
          </div>
        </div>

        {/* SK CHAIRMAN Section */}
        <div className="group relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/sk-chairman.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/60 via-pink-500/60 to-red-600/60 group-hover:backdrop-blur-sm transition-all duration-300" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest mb-2 text-shadow-lg">
                SK
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-widest text-shadow-lg">
                CHAIRMAN
              </div>
            </div>
            <div className="absolute text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-6xl sm:text-7xl lg:text-9xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                75
              </span>
            </div>
          </div>
        </div>

        {/* LYDO OFFICIALS Section */}
        <div className="group relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/sk-lydo.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 via-blue-600/60 to-cyan-600/60 group-hover:backdrop-blur-sm transition-all duration-300" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <div className="text-3xl sm:text-4xl font-bold tracking-widest mb-2 text-shadow-lg">
                LYDO
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-widest text-shadow-lg">
                OFFICIALS
              </div>
            </div>
            <div className="absolute text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-6xl sm:text-7xl lg:text-9xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                1
              </span>
            </div>
          </div>
        </div>

        {/* SK KAGAWAD Section */}
        <div className="group relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/sk-kagawad.jpg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/60 via-orange-500/60 to-red-500/60 group-hover:backdrop-blur-sm transition-all duration-300" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-4 sm:p-6 lg:p-8">
            <div className="text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest mb-2 text-shadow-lg">
                SK
              </div>
              <div className="text-xl sm:text-2xl font-semibold tracking-widest text-shadow-lg">
                KAGAWAD
              </div>
            </div>
            <div className="absolute text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-6xl sm:text-7xl lg:text-9xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                525
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechAssistant;
