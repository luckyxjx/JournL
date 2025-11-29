export const AvatarSVGComponents = {
  // Eyes
  happy: (
    <g>
      <circle cx="35" cy="45" r="3" fill="#2D3748" />
      <circle cx="65" cy="45" r="3" fill="#2D3748" />
      <path d="M30 40 Q35 35 40 40" stroke="#2D3748" strokeWidth="2" fill="none" />
      <path d="M60 40 Q65 35 70 40" stroke="#2D3748" strokeWidth="2" fill="none" />
    </g>
  ),
  sunglasses: (
    <g>
      <rect x="25" y="40" width="20" height="12" rx="6" fill="#1A202C" />
      <rect x="55" y="40" width="20" height="12" rx="6" fill="#1A202C" />
      <line x1="45" y1="46" x2="55" y2="46" stroke="#1A202C" strokeWidth="2" />
    </g>
  ),
  glasses: (
    <g>
      <circle cx="35" cy="46" r="8" fill="none" stroke="#2D3748" strokeWidth="2" />
      <circle cx="65" cy="46" r="8" fill="none" stroke="#2D3748" strokeWidth="2" />
      <line x1="43" y1="46" x2="57" y2="46" stroke="#2D3748" strokeWidth="2" />
      <circle cx="35" cy="46" r="2" fill="#2D3748" />
      <circle cx="65" cy="46" r="2" fill="#2D3748" />
    </g>
  ),
  caring: (
    <g>
      <circle cx="35" cy="45" r="3" fill="#2D3748" />
      <circle cx="65" cy="45" r="3" fill="#2D3748" />
      <path d="M30 42 Q35 38 40 42" stroke="#2D3748" strokeWidth="2" fill="none" />
      <path d="M60 42 Q65 38 70 42" stroke="#2D3748" strokeWidth="2" fill="none" />
    </g>
  ),
  heart_eyes: (
    <g>
      <path d="M30 40 Q35 35 40 40 Q35 45 30 40" fill="#EF4444" />
      <path d="M60 40 Q65 35 70 40 Q65 45 60 40" fill="#EF4444" />
    </g>
  ),
  owl_eyes: (
    <g>
      <circle cx="35" cy="45" r="6" fill="#FCD34D" stroke="#92400E" strokeWidth="2" />
      <circle cx="65" cy="45" r="6" fill="#FCD34D" stroke="#92400E" strokeWidth="2" />
      <circle cx="35" cy="45" r="3" fill="#1F2937" />
      <circle cx="65" cy="45" r="3" fill="#1F2937" />
    </g>
  ),

  // Hats
  simple_hat: (
    <g>
      <ellipse cx="50" cy="25" rx="25" ry="8" fill="#8B4513" />
      <rect x="25" y="20" width="50" height="15" rx="7" fill="#A0522D" />
    </g>
  ),
  fancy_hat: (
    <g>
      <ellipse cx="50" cy="25" rx="28" ry="6" fill="#2D3748" />
      <rect x="22" y="15" width="56" height="20" rx="10" fill="#4A5568" />
      <rect x="45" y="10" width="10" height="8" fill="#E53E3E" />
    </g>
  ),
  beret: (
    <g>
      <circle cx="50" cy="25" r="20" fill="#8B0000" />
      <circle cx="55" cy="20" r="2" fill="#A0522D" />
    </g>
  ),
  grad_cap: (
    <g>
      <rect x="25" y="20" width="50" height="8" fill="#1A202C" />
      <polygon points="20,28 80,28 75,32 25,32" fill="#2D3748" />
      <line x1="75" y1="25" x2="85" y2="15" stroke="#E53E3E" strokeWidth="2" />
      <rect x="83" y="13" width="4" height="4" fill="#E53E3E" />
    </g>
  ),
  crown: (
    <g>
      <polygon points="25,30 35,15 45,25 55,15 65,25 75,15 75,35 25,35" fill="#FFD700" />
      <circle cx="35" cy="20" r="3" fill="#FF6B6B" />
      <circle cx="50" cy="15" r="3" fill="#4ECDC4" />
      <circle cx="65" cy="20" r="3" fill="#FF6B6B" />
    </g>
  ),
  santa_hat: (
    <g>
      <path d="M25 25 Q50 10 75 25 Q70 35 50 30 Q30 35 25 25" fill="#DC2626" />
      <circle cx="75" cy="25" r="4" fill="#F3F4F6" />
      <rect x="20" y="25" width="60" height="8" fill="#F3F4F6" />
    </g>
  ),
  party_hat: (
    <g>
      <polygon points="50,10 35,35 65,35" fill="#8B5CF6" />
      <circle cx="50" cy="10" r="3" fill="#F59E0B" />
      <rect x="40" y="20" width="3" height="3" fill="#EF4444" />
      <rect x="55" y="25" width="3" height="3" fill="#10B981" />
    </g>
  ),
  wizard_hat: (
    <g>
      <polygon points="50,5 40,35 60,35" fill="#1E40AF" />
      <circle cx="45" cy="15" r="1" fill="#FBBF24" />
      <circle cx="55" cy="20" r="1" fill="#FBBF24" />
      <circle cx="48" cy="25" r="1" fill="#FBBF24" />
      <ellipse cx="50" cy="35" rx="15" ry="3" fill="#1E40AF" />
    </g>
  ),

  // Accessories
  camera: (
    <g>
      <rect x="75" y="55" width="15" height="10" rx="2" fill="#2D3748" />
      <circle cx="82" cy="60" r="3" fill="#4A5568" />
      <rect x="79" y="52" width="2" height="3" fill="#2D3748" />
    </g>
  ),
  pen: (
    <g>
      <line x1="75" y1="35" x2="85" y2="25" stroke="#4A5568" strokeWidth="3" />
      <circle cx="85" cy="25" r="1" fill="#E53E3E" />
    </g>
  ),
  scroll: (
    <g>
      <rect x="15" y="50" width="20" height="25" rx="2" fill="#F7FAFC" />
      <line x1="18" y1="55" x2="32" y2="55" stroke="#2D3748" strokeWidth="1" />
      <line x1="18" y1="60" x2="30" y2="60" stroke="#2D3748" strokeWidth="1" />
      <line x1="18" y1="65" x2="32" y2="65" stroke="#2D3748" strokeWidth="1" />
    </g>
  ),
  badge: (
    <g>
      <circle cx="80" cy="35" r="6" fill="#059669" />
      <text x="80" y="38" textAnchor="middle" fontSize="8" fill="white">W</text>
    </g>
  ),

  // Background Effects
  aura: (
    <g>
      <circle cx="50" cy="50" r="45" fill="url(#goldGradient)" opacity="0.3" />
      <defs>
        <radialGradient id="goldGradient">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>
      </defs>
    </g>
  ),
  rainbow_aura: (
    <g>
      <circle cx="50" cy="50" r="45" fill="url(#rainbowGradient)" opacity="0.4" />
      <defs>
        <radialGradient id="rainbowGradient">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="16%" stopColor="#FF8000" />
          <stop offset="33%" stopColor="#FFFF00" />
          <stop offset="50%" stopColor="#00FF00" />
          <stop offset="66%" stopColor="#0080FF" />
          <stop offset="83%" stopColor="#8000FF" />
          <stop offset="100%" stopColor="#FF0080" />
        </radialGradient>
      </defs>
    </g>
  ),
};