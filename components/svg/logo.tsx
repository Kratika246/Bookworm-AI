export default function Logo() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      gap: "60px"
    }}>

      {/* Main Logo */}
      <div style={{ textAlign: "center" }}>
        <svg width="320" height="120" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5c842" />
              <stop offset="50%" stopColor="#e8a020" />
              <stop offset="100%" stopColor="#c97b00" />
            </linearGradient>
            <linearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f0e6c8" />
              <stop offset="100%" stopColor="#ddd0aa" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Book Icon */}
          {/* Left page */}
          <rect x="18" y="20" width="30" height="70" rx="3" ry="3" fill="url(#pageGrad)" opacity="0.85"/>
          {/* Spine */}
          <rect x="46" y="18" width="6" height="74" rx="2" fill="url(#goldGrad)"/>
          {/* Right page */}
          <rect x="50" y="20" width="30" height="70" rx="3" ry="3" fill="#f8f0d8"/>

          {/* Page lines - left */}
          <line x1="24" y1="36" x2="42" y2="36" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="24" y1="44" x2="42" y2="44" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="24" y1="52" x2="42" y2="52" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="24" y1="60" x2="42" y2="60" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="24" y1="68" x2="38" y2="68" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Page lines - right */}
          <line x1="56" y1="36" x2="74" y2="36" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="56" y1="44" x2="74" y2="44" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="56" y1="52" x2="74" y2="52" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="56" y1="60" x2="74" y2="60" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="56" y1="68" x2="70" y2="68" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>

          {/* Bookmark ribbon */}
          <polygon points="70,18 77,18 77,42 73.5,38 70,42" fill="url(#goldGrad)" filter="url(#glow)"/>

          {/* Wordmark */}
          <text x="100" y="72" fontSize="42" fontWeight="700" fill="#f5f0e0" letterSpacing="-1"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Bookified
          </text>

          {/* Underline accent */}
          <rect x="100" y="82" width="210" height="2" rx="1" fill="url(#goldGrad)" opacity="0.7"/>
        </svg>

        {/* Tagline */}
        <p style={{
          color: "#8a7a5a",
          fontSize: "12px",
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginTop: "8px"
        }}>
          Your Library, Reimagined
        </p>
      </div>

      {/* Icon-only variant */}
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#444", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "16px" }}>Icon Variant</p>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1608"/>
              <stop offset="100%" stopColor="#0d0d18"/>
            </linearGradient>
            <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5c842"/>
              <stop offset="100%" stopColor="#c97b00"/>
            </linearGradient>
          </defs>
          <rect width="80" height="80" rx="18" fill="url(#bgGrad)"/>
          <rect x="10" y="16" width="24" height="50" rx="3" fill="#f0e6c8" opacity="0.9"/>
          <rect x="32" y="14" width="5" height="54" rx="2" fill="url(#goldGrad2)"/>
          <rect x="35" y="16" width="24" height="50" rx="3" fill="#f8f0d8"/>
          <line x1="15" y1="27" x2="30" y2="27" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="15" y1="33" x2="30" y2="33" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="15" y1="39" x2="30" y2="39" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="40" y1="27" x2="55" y2="27" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="40" y1="33" x2="55" y2="33" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="40" y1="39" x2="55" y2="39" stroke="#c4b080" strokeWidth="1.2" strokeLinecap="round"/>
          <polygon points="50,14 57,14 57,33 53.5,29 50,33" fill="url(#goldGrad2)"/>
        </svg>
      </div>

      {/* Dark card variant */}
      <div style={{
        background: "#12121a",
        border: "1px solid #2a2a3a",
        borderRadius: "16px",
        padding: "32px 48px",
        textAlign: "center"
      }}>
        <p style={{ color: "#444", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>Card Variant</p>
        <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5c842"/>
              <stop offset="100%" stopColor="#c97b00"/>
            </linearGradient>
          </defs>
          <rect x="2" y="6" width="19" height="46" rx="2" fill="#f0e6c8" opacity="0.8"/>
          <rect x="20" y="4" width="4" height="50" rx="2" fill="url(#g3)"/>
          <rect x="23" y="6" width="19" height="46" rx="2" fill="#f8f0d8"/>
          <polygon points="35,4 40,4 40,20 37.5,17 35,20" fill="url(#g3)"/>
          <text x="52" y="38" fontSize="28" fontWeight="700" fill="#f5f0e0" letterSpacing="-0.5"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            Bookified
          </text>
        </svg>
      </div>

    </div>
  );
}