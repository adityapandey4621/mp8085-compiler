"use client"

import React from "react"

// --- Custom CSS Animations for Avatars ---
const avatarStyles = `
  @keyframes blink {
    0%, 96%, 98% { transform: scaleY(1); }
    97% { transform: scaleY(0.1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10%); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0) scaleY(1); }
    50% { transform: translateY(-8%) scaleY(1.05); }
  }
  @keyframes ear-twitch {
    0%, 95%, 100% { transform: rotate(0deg); }
    97% { transform: rotate(10deg); }
    98% { transform: rotate(-5deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  .anim-blink { animation: blink 4s infinite; transform-origin: center; }
  .anim-float { animation: float 3s ease-in-out infinite; }
  .anim-bounce { animation: bounce-slow 2s ease-in-out infinite; }
  .anim-ear { animation: ear-twitch 5s ease-in-out infinite; transform-origin: bottom left; }
  .anim-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .anim-breathe { animation: breathe 4s ease-in-out infinite; }
`

// --- 1. The Owl (Duolingo Vibe) ---
const OwlAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2 anim-float">
    {/* Body */}
    <ellipse cx="50" cy="55" rx="35" ry="40" fill="#78C62A" />
    <ellipse cx="50" cy="65" rx="25" ry="25" fill="#58A700" />
    {/* Eyes */}
    <g className="anim-blink">
      <circle cx="35" cy="40" r="12" fill="white" />
      <circle cx="35" cy="40" r="5" fill="#1A1A1A" />
      <circle cx="65" cy="40" r="12" fill="white" />
      <circle cx="65" cy="40" r="5" fill="#1A1A1A" />
    </g>
    {/* Beak */}
    <path d="M45,50 L55,50 L50,60 Z" fill="#F49000" />
  </svg>
)

// --- 2. The Tech Cat ---
const CatAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
    {/* Ears */}
    <path d="M25,50 L20,20 L45,35 Z" fill="#9333EA" className="anim-ear" />
    <path d="M75,50 L80,20 L55,35 Z" fill="#9333EA" />
    {/* Head */}
    <circle cx="50" cy="60" r="35" fill="#A855F7" className="anim-breathe" />
    {/* Glasses */}
    <path d="M15,55 L45,55 L45,65 L15,65 Z" fill="none" stroke="#FBBF24" strokeWidth="4" rx="4" />
    <path d="M55,55 L85,55 L85,65 L55,65 Z" fill="none" stroke="#FBBF24" strokeWidth="4" rx="4" />
    <line x1="45" y1="60" x2="55" y2="60" stroke="#FBBF24" strokeWidth="4" />
    {/* Eyes (behind glasses) */}
    <g className="anim-blink">
      <circle cx="30" cy="60" r="4" fill="#1A1A1A" />
      <circle cx="70" cy="60" r="4" fill="#1A1A1A" />
    </g>
    {/* Nose/Mouth */}
    <path d="M48,70 L52,70 L50,73 Z" fill="#FBCFE8" />
    <path d="M45,75 Q50,78 55,75" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// --- 3. The Cute Robot ---
const RobotAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2 anim-bounce">
    {/* Antenna */}
    <line x1="50" y1="35" x2="50" y2="15" stroke="#94A3B8" strokeWidth="4" />
    <circle cx="50" cy="15" r="5" fill="#38BDF8" className="anim-glow" />
    {/* Head shape */}
    <rect x="20" y="35" width="60" height="50" rx="12" fill="#0284C7" />
    <rect x="28" y="45" width="44" height="30" rx="6" fill="#0F172A" />
    {/* Face / Eyes */}
    <g className="anim-blink">
      <rect x="35" y="52" width="10" height="15" rx="4" fill="#38BDF8" />
      <rect x="55" y="52" width="10" height="15" rx="4" fill="#38BDF8" />
    </g>
  </svg>
)

// --- 4. The Fire Sprite ---
const FireAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2 anim-float">
    {/* Flame Body */}
    <path d="M50,15 Q75,40 75,65 A25,25 0 0,1 25,65 Q25,40 50,15 Z" fill="#F97316" />
    <path d="M50,35 Q65,55 65,70 A15,15 0 0,1 35,70 Q35,55 50,35 Z" fill="#FDE047" />
    {/* Eyes */}
    <g className="anim-blink">
      <circle cx="40" cy="65" r="5" fill="#1A1A1A" />
      <circle cx="60" cy="65" r="5" fill="#1A1A1A" />
    </g>
    {/* Smile */}
    <path d="M45,75 Q50,80 55,75" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

// --- 5. The Sleepy Bear ---
const BearAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-2 anim-breathe">
    {/* Ears */}
    <circle cx="25" cy="35" r="15" fill="#92400E" />
    <circle cx="75" cy="35" r="15" fill="#92400E" />
    {/* Head */}
    <circle cx="50" cy="60" r="40" fill="#B45309" />
    {/* Muzzle */}
    <ellipse cx="50" cy="70" rx="18" ry="14" fill="#FDE68A" />
    {/* Nose */}
    <ellipse cx="50" cy="65" rx="6" ry="4" fill="#451A03" />
    {/* Sleepy Eyes */}
    <path d="M30,55 Q35,50 40,55" fill="none" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
    <path d="M60,55 Q65,50 70,55" fill="none" stroke="#451A03" strokeWidth="4" strokeLinecap="round" />
    {/* Sleep bubble */}
    <circle cx="85" cy="25" r="6" fill="white" opacity="0.6" className="anim-float" />
    <circle cx="75" cy="15" r="3" fill="white" opacity="0.6" className="anim-float" style={{ animationDelay: "1s" }} />
  </svg>
)

// Default / Unknown
const DefaultAvatar = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full p-3 anim-breathe">
    <circle cx="50" cy="40" r="20" fill="currentColor" opacity="0.8" />
    <path d="M20,90 Q50,60 80,90 Z" fill="currentColor" opacity="0.8" />
  </svg>
)

export const AVATAR_OPTIONS = [
  { id: 1, name: "The Owl",   gradient: "from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40", component: OwlAvatar },
  { id: 2, name: "Tech Cat",  gradient: "from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40", component: CatAvatar },
  { id: 3, name: "Robo Buddy",gradient: "from-sky-100 to-sky-200 dark:from-sky-900/40 dark:to-sky-800/40", component: RobotAvatar },
  { id: 4, name: "Fire Sprite",gradient:"from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40", component: FireAvatar },
  { id: 5, name: "Sleepy Bear",gradient:"from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40", component: BearAvatar },
  { id: 0, name: "Default",   gradient: "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900", component: DefaultAvatar },
]

interface UserAvatarProps {
  avatarId: number
  className?: string
}

export function UserAvatar({ avatarId, className = "w-10 h-10" }: UserAvatarProps) {
  const avatar = AVATAR_OPTIONS.find((a) => a.id === avatarId) || AVATAR_OPTIONS[5]
  const AvatarComponent = avatar.component

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: avatarStyles }} />
      <div
        className={`rounded-full flex items-center justify-center bg-gradient-to-br ${avatar.gradient} shadow-lg shrink-0 overflow-hidden ${className} border border-border/20`}
        title={avatar.name}
      >
        <AvatarComponent />
      </div>
    </>
  )
}
