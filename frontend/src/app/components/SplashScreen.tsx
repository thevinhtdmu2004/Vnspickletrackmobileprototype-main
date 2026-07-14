export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A9396] via-[#0E7C7B] to-[#005F73] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>

      <div className="text-center relative z-10">
        {/* Logo Container */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute inset-0 blur-2xl opacity-50">
            <div className="w-40 h-40 mx-auto bg-white/30 rounded-full"></div>
          </div>

          {/* Logo */}
          <div className="relative w-40 h-40 mx-auto bg-white rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            {/* Pickleball Paddle & Ball Icon */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Paddle */}
              <ellipse cx="45" cy="35" rx="18" ry="22" fill="#0E7C7B" />
              <rect x="41" y="55" width="8" height="25" rx="4" fill="#0E7C7B" />
              <rect x="38" y="75" width="14" height="6" rx="3" fill="#0E7C7B" />

              {/* Ball with holes */}
              <circle cx="65" cy="50" r="16" fill="#F4A261" />
              <circle cx="60" cy="45" r="2.5" fill="white" />
              <circle cx="68" cy="45" r="2.5" fill="white" />
              <circle cx="64" cy="52" r="2.5" fill="white" />
              <circle cx="58" cy="54" r="2.5" fill="white" />
              <circle cx="70" cy="54" r="2.5" fill="white" />

              {/* VNS Text on paddle */}
              <text x="45" y="40" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">VNS</text>
            </svg>
          </div>
        </div>

        {/* App Name */}
        <div className="mb-3">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            VNS PickleTrack
          </h1>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto mb-3"></div>
          <p className="text-white/90 text-base">Quản lý lớp Pickleball</p>
        </div>

        {/* Loading Animation */}
        <div className="mt-16 mb-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>

        <p className="text-white/80 text-sm animate-pulse">Đang tải...</p>

        {/* Version & Footer */}
        <div className="mt-20 space-y-2">
          <p className="text-white/60 text-xs">Phiên bản 1.0.0</p>
          <p className="text-white/50 text-xs">© 2026 VNS Technology</p>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
