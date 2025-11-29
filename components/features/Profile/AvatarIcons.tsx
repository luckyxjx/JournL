// Full Body Avatar coordinate system: 100x100 SVG viewBox
// Head: center (50,35), radius 20
// Body: center (50,75), rx=20, ry=25
// Arms: left (25,65), right (75,65)
// Eyes: left(45,32), right(55,32)
// Mouth: (45-55, 40)
// Hat zone: y(5-25)
// Clothing zone: body area (30-70, 50-100)
// Accessories: arms/chest area
// Background effects: full canvas (0-100)

// Base Avatar Body Parts
export const AvatarBaseParts = {
  body: (
    <g>
      {/* Body */}
      <ellipse cx="50" cy="75" rx="20" ry="25" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2" />
      {/* Head */}
      <circle cx="50" cy="35" r="20" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2" />
      {/* Arms */}
      <ellipse cx="25" cy="65" rx="8" ry="15" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2" />
      <ellipse cx="75" cy="65" rx="8" ry="15" fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="2" />
      {/* Default Eyes */}
      <circle cx="45" cy="32" r="2" fill="#2D3748" />
      <circle cx="55" cy="32" r="2" fill="#2D3748" />
      {/* Default Mouth */}
      <path d="M45 40 Q50 43 55 40" stroke="#2D3748" strokeWidth="2" fill="none" />
    </g>
  )
};

export const AvatarSVGComponents = {
  // --- EYES (Centered at x=45 and x=55, y=32) ---
  happy: (
    <g>
      {/* Eyes */}
      <circle cx="45" cy="32" r="3" fill="#2D3748" />
      <circle cx="55" cy="32" r="3" fill="#2D3748" />
      {/* Brows/Cheeks */}
      <path d="M41 28 Q45 24 49 28" stroke="#2D3748" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M51 28 Q55 24 59 28" stroke="#2D3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  sunglasses: (
    <g>
      {/* Lenses */}
      <rect x="30" y="40" width="18" height="12" rx="4" fill="#1A202C" />
      <rect x="52" y="40" width="18" height="12" rx="4" fill="#1A202C" />
      {/* Bridge */}
      <line x1="48" y1="46" x2="52" y2="46" stroke="#1A202C" strokeWidth="2" />
      {/* Shine */}
      <line x1="32" y1="42" x2="36" y2="46" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    </g>
  ),
  glasses: (
    <g>
      <circle cx="40" cy="45" r="8" fill="rgba(255,255,255,0.2)" stroke="#2D3748" strokeWidth="2" />
      <circle cx="60" cy="45" r="8" fill="rgba(255,255,255,0.2)" stroke="#2D3748" strokeWidth="2" />
      <line x1="48" y1="45" x2="52" y2="45" stroke="#2D3748" strokeWidth="2" />
      {/* Pupils visible through glasses */}
      <circle cx="40" cy="45" r="2" fill="#2D3748" />
      <circle cx="60" cy="45" r="2" fill="#2D3748" />
    </g>
  ),
  caring: (
    <g>
      <circle cx="40" cy="45" r="3" fill="#2D3748" />
      <circle cx="60" cy="45" r="3" fill="#2D3748" />
      {/* Gentle eyebrows */}
      <path d="M37 42 Q40 39 43 42" stroke="#2D3748" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M57 42 Q60 39 63 42" stroke="#2D3748" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  heart_eyes: (
    <g>
      <path d="M36 43 Q40 38 44 43 Q40 48 36 43" fill="#EF4444" transform="scale(1.2) translate(-6, -6)" />
      <path d="M56 43 Q60 38 64 43 Q60 48 56 43" fill="#EF4444" transform="scale(1.2) translate(-10, -6)" />
    </g>
  ),
  owl_eyes: (
    <g>
      {/* Outer rings */}
      <circle cx="40" cy="45" r="7" fill="#FCD34D" stroke="#92400E" strokeWidth="2" />
      <circle cx="60" cy="45" r="7" fill="#FCD34D" stroke="#92400E" strokeWidth="2" />
      {/* Pupils */}
      <circle cx="40" cy="45" r="3" fill="#1F2937" />
      <circle cx="60" cy="45" r="3" fill="#1F2937" />
    </g>
  ),

  // --- HATS (Aligned to top of head y=15) ---
  simple_hat: (
    <g>
      {/* Brim */}
      <ellipse cx="50" cy="22" rx="30" ry="8" fill="#8B4513" />
      {/* Dome */}
      <path d="M35 22 Q35 5 50 5 Q65 5 65 22" fill="#A0522D" />
    </g>
  ),
  fancy_hat: (
    <g>
      {/* Brim */}
      <ellipse cx="50" cy="20" rx="32" ry="6" fill="#2D3748" />
      {/* Top Hat Body */}
      <rect x="32" y="2" width="36" height="18" rx="2" fill="#4A5568" />
      {/* Ribbon */}
      <rect x="32" y="15" width="36" height="5" fill="#E53E3E" />
    </g>
  ),
  beret: (
    <g>
      {/* Tilted Beret Body */}
      <path d="M30 20 Q50 5 75 25 Q70 30 50 25 Q35 28 30 20" fill="#8B0000" />
      {/* Stem */}
      <rect x="55" y="12" width="4" height="4" rx="2" fill="#A0522D" />
    </g>
  ),
  grad_cap: (
    <g>
      {/* Cap Diamond */}
      <polygon points="50,10 80,20 50,30 20,20" fill="#2D3748" stroke="#1A202C" strokeWidth="1" />
      {/* Cap Base */}
      <path d="M30 23 L30 35 Q50 40 70 35 L70 23" fill="#2D3748" />
      {/* Tassel */}
      <line x1="50" y1="10" x2="80" y2="25" stroke="#E53E3E" strokeWidth="2" />
      <circle cx="80" cy="25" r="2" fill="#E53E3E" />
    </g>
  ),
  crown: (
    <g>
      <path d="M30 25 L30 15 L40 22 L50 10 L60 22 L70 15 L70 25 Q50 30 30 25" fill="#FFD700" stroke="#B45309" strokeWidth="1" />
      <circle cx="30" cy="15" r="2" fill="#FF6B6B" />
      <circle cx="50" cy="10" r="2" fill="#4ECDC4" />
      <circle cx="70" cy="15" r="2" fill="#FF6B6B" />
    </g>
  ),
  santa_hat: (
    <g>
      {/* Droopy part */}
      <path d="M30 20 Q50 0 70 20 Q85 35 90 40" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      {/* Pom pom */}
      <circle cx="90" cy="40" r="5" fill="#F3F4F6" />
      {/* White Trim */}
      <rect x="25" y="18" width="50" height="10" rx="5" fill="#F3F4F6" />
    </g>
  ),
  party_hat: (
    <g>
      {/* Cone */}
      <polygon points="50,5 35,25 65,25" fill="#8B5CF6" />
      {/* Pom Pom */}
      <circle cx="50" cy="5" r="3" fill="#F59E0B" />
      {/* Decorations */}
      <circle cx="45" cy="18" r="2" fill="#EF4444" />
      <circle cx="55" cy="15" r="2" fill="#10B981" />
    </g>
  ),
  wizard_hat: (
    <g>
      {/* Brim */}
      <ellipse cx="50" cy="25" rx="25" ry="5" fill="#1E40AF" />
      {/* Cone (crumpled) */}
      <path d="M35 25 L45 5 L55 10 L65 25" fill="#1E40AF" />
      {/* Stars */}
      <circle cx="45" cy="15" r="1" fill="#FBBF24" />
      <circle cx="50" cy="10" r="1" fill="#FBBF24" />
    </g>
  ),

  // --- ACCESSORIES (Adjusted to avoid clipping x=0 or x=100) ---
  camera: (
    <g>
      {/* Strap */}
      <path d="M40 70 Q50 90 60 70" stroke="#2D3748" strokeWidth="2" fill="none" />
      {/* Body */}
      <rect x="35" y="70" width="30" height="20" rx="3" fill="#2D3748" />
      {/* Lens */}
      <circle cx="50" cy="80" r="6" fill="#4A5568" stroke="#718096" strokeWidth="2" />
      {/* Flash */}
      <rect x="58" y="72" width="4" height="3" fill="#CBD5E0" />
    </g>
  ),
  pen: (
    <g>
      {/* Behind Ear area: x(70-85), y(17-32) */}
      <line x1="75" y1="30" x2="85" y2="15" stroke="#F6AD55" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="30" x2="77" y2="27" stroke="#2D3748" strokeWidth="4" />
      <polygon points="85,15 87,12 83,12" fill="#2D3748" />
    </g>
  ),
  scroll: (
    <g>
      {/* Held in front/side x=70 */}
      <rect x="65" y="55" width="20" height="25" fill="#FFF7ED" stroke="#C2410C" strokeWidth="1" rx="2" transform="rotate(-10 75 67)" />
      <line x1="68" y1="60" x2="80" y2="60" stroke="#C2410C" strokeWidth="1" transform="rotate(-10 75 67)" />
      <line x1="68" y1="65" x2="78" y2="65" stroke="#C2410C" strokeWidth="1" transform="rotate(-10 75 67)" />
    </g>
  ),
  badge: (
    <g>
      {/* Pinned to chest area x=70, y=70 */}
      <circle cx="70" cy="70" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      <path d="M70 70 L70 85 L65 80" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      <path d="M70 70 L70 85 L75 80" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
      <text x="70" y="74" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E" style={{fontSize: "8px"}}>1</text>
    </g>
  ),

  // --- CLOTHING ---
  t_shirt: (
    <g>
      <ellipse cx="50" cy="75" rx="18" ry="23" fill="#3B82F6" />
      <rect x="32" y="52" width="36" height="46" rx="18" fill="#3B82F6" />
    </g>
  ),
  dress: (
    <g>
      <ellipse cx="50" cy="75" rx="25" ry="25" fill="#EC4899" />
      <path d="M25 75 Q50 85 75 75 L70 100 L30 100 Z" fill="#EC4899" />
    </g>
  ),
  hoodie: (
    <g>
      <ellipse cx="50" cy="75" rx="20" ry="25" fill="#6B7280" />
      <path d="M30 50 Q50 45 70 50 L70 75 Q50 80 30 75 Z" fill="#6B7280" />
      <circle cx="50" cy="25" r="22" fill="none" stroke="#6B7280" strokeWidth="3" />
    </g>
  ),
  suit: (
    <g>
      <ellipse cx="50" cy="75" rx="18" ry="23" fill="#1F2937" />
      <rect x="32" y="52" width="36" height="46" rx="18" fill="#1F2937" />
      <rect x="47" y="52" width="6" height="30" fill="#FFFFFF" />
      <rect x="45" y="60" width="10" height="4" fill="#DC2626" />
    </g>
  ),

  // --- BACKGROUNDS ---
  aura: (
    <g>
      <circle cx="50" cy="50" r="48" fill="url(#goldGradient)" opacity="0.4" />
      <defs>
        <radialGradient id="goldGradient" cx="0.5" cy="0.5" r="0.5">
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFA500" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </g>
  ),
  rainbow_aura: (
    <g>
      <circle cx="50" cy="50" r="48" fill="url(#rainbowGradient)" opacity="0.3" />
      <defs>
        <radialGradient id="rainbowGradient" cx="0.5" cy="0.5" r="0.5">
           <stop offset="0%" stopColor="#FF0000" />
           <stop offset="20%" stopColor="#FFFF00" />
           <stop offset="40%" stopColor="#00FF00" />
           <stop offset="60%" stopColor="#0000FF" />
           <stop offset="80%" stopColor="#8000FF" />
           <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  ),
};