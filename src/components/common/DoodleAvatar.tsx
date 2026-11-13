import React from 'react';
import { Plus } from 'lucide-react';

export type DoodlePresetId =
  | 'karn'
  | 'ohm'
  | 'bank'
  | 'top'
  | 'ploy'
  | 'meen'
  | 'nat'
  | 'art';

interface DoodleAvatarProps {
  preset?: DoodlePresetId;
  seed?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ringClass?: string;
}

const SIZE_CLASSES: Record<NonNullable<DoodleAvatarProps['size']>, string> = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export function resolveDoodlePreset(seed?: string): DoodlePresetId {
  const s = (seed || '').toLowerCase();
  if (s.includes('กานต์') || s.includes('karn')) return 'karn';
  if (s.includes('โอห์ม') || s.includes('ohm')) return 'ohm';
  if (s.includes('แบงค์') || s.includes('bank')) return 'bank';
  if (s.includes('ท็อป') || s.includes('top')) return 'top';
  if (s.includes('พลอย') || s.includes('ploy')) return 'ploy';
  if (s.includes('มีน') || s.includes('meen')) return 'meen';
  if (s.includes('นัท') || s.includes('nat')) return 'nat';
  if (s.includes('อาร์ท') || s.includes('art')) return 'art';
  const list: DoodlePresetId[] = ['karn', 'ohm', 'bank', 'top', 'ploy', 'meen', 'nat', 'art'];
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) | 0;
  }
  return list[Math.abs(hash) % list.length];
}

interface CharacterConfig {
  bg: string;
  skin: string;
  hair: string;
  shirt: string;
  hairStyle: 'spiky' | 'headband' | 'curls' | 'bangs' | 'wavy' | 'bob' | 'afroBeard' | 'baldWisp';
  glasses?: 'orange' | 'teal' | 'black';
  expression: 'smile' | 'grin' | 'smirk' | 'frown' | 'cheer';
}

const CHARACTERS: Record<DoodlePresetId, CharacterConfig> = {
  // User hero: energetic badminton attacker, mint circle, confident grin
  karn: {
    bg: '#bff0d4',
    skin: '#f6c8a8',
    hair: '#1f2937',
    shirt: '#ffffff',
    hairStyle: 'spiky',
    expression: 'grin',
  },
  // Athletic headband striker
  ohm: {
    bg: '#bae6fd',
    skin: '#eab68f',
    hair: '#292524',
    shirt: '#7cd7a0',
    hairStyle: 'headband',
    expression: 'smirk',
  },
  // Tactical defender with round black glasses
  bank: {
    bg: '#ddd6fe',
    skin: '#f5d0b5',
    hair: '#18181b',
    shirt: '#fed7aa',
    hairStyle: 'curls',
    glasses: 'black',
    expression: 'smile',
  },
  // Playful lilac hair (inspired by Matt in reference)
  top: {
    bg: '#cffafe',
    skin: '#fde2d0',
    hair: '#8b7cf6',
    shirt: '#f1f5f9',
    hairStyle: 'bangs',
    expression: 'grin',
  },
  // Wavy blonde hair (inspired by Yuki in reference)
  ploy: {
    bg: '#d9f9e6',
    skin: '#b87654',
    hair: '#fde68a',
    shirt: '#fbbf24',
    hairStyle: 'wavy',
    expression: 'smile',
  },
  // Dark bob + orange glasses (inspired by Sofia in reference)
  meen: {
    bg: '#e0e7ff',
    skin: '#96563b',
    hair: '#111827',
    shirt: '#fef08a',
    hairStyle: 'bob',
    glasses: 'orange',
    expression: 'smile',
  },
  // Fluffy white/light hair + beard + teal glasses (inspired by Richard in reference)
  nat: {
    bg: '#ede9fe',
    skin: '#9f6145',
    hair: '#ffffff',
    shirt: '#ffffff',
    hairStyle: 'afroBeard',
    glasses: 'teal',
    expression: 'smile',
  },
  // Expressive short-crop hero (inspired by Emma in reference)
  art: {
    bg: '#e0f2fe',
    skin: '#c48363',
    hair: '#18181b',
    shirt: '#67e8f9',
    hairStyle: 'baldWisp',
    expression: 'cheer',
  },
};

export const DoodleAvatar: React.FC<DoodleAvatarProps> = ({
  preset,
  seed,
  size = 'md',
  className = '',
  ringClass = 'border-2 border-[#000000]',
}) => {
  const id = preset ?? resolveDoodlePreset(seed);
  const c = CHARACTERS[id];

  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden shrink-0 ${ringClass} ${className}`}
      style={{ backgroundColor: c.bg }}
      aria-label={seed || id}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full block">
        {/* Background fill */}
        <circle cx="50" cy="50" r="50" fill={c.bg} />

        {/* Back Hair Layer */}
        {c.hairStyle === 'wavy' && (
          <path
            d="M22,88 C14,68 18,34 32,20 C44,10 64,12 75,24 C86,38 88,68 80,90 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'bob' && (
          <path
            d="M26,82 C20,62 22,26 42,18 C58,13 76,22 76,46 C76,66 74,78 72,84 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'afroBeard' && (
          <path
            d="M19,86 C13,66 15,28 34,17 C50,9 72,14 82,30 C90,48 86,74 78,88 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'bangs' && (
          <path
            d="M32,68 L28,84 L38,80 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        )}

        {/* Shoulders & Shirt */}
        <path
          d="M16,102 C20,82 33,76 50,76 C67,76 80,82 84,102 Z"
          fill={c.shirt}
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Shirt Collar Detail */}
        <path
          d="M37,77 Q50,86 63,77"
          fill="none"
          stroke="#000000"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Neck */}
        <path
          d="M42,64 L42,79 Q50,84 58,79 L58,64"
          fill={c.skin}
          stroke="#000000"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Left Ear */}
        <path
          d="M31,46 C25,45 24,54 30,56"
          fill={c.skin}
          stroke="#000000"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
        <path
          d="M28,49 C27,51 28,53 30,53"
          fill="none"
          stroke="#000000"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Head Silhouette */}
        <path
          d="M31,42 C30,25 41,19 53,20 C66,21 72,30 72,45 C72,60 63,71 51,71 C39,71 31,61 31,42 Z"
          fill={c.skin}
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Beard (Nat preset) */}
        {c.hairStyle === 'afroBeard' && (
          <path
            d="M33,49 C33,66 42,73 53,73 C65,73 72,63 72,48 C68,53 62,54 54,53 C46,52 38,54 33,49 Z"
            fill="#18181b"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        )}

        {/* Front Hair Styles */}
        {c.hairStyle === 'spiky' && (
          <path
            d="M30,42 C29,26 39,15 53,16 C67,16 74,25 73,37 C68,31 61,28 53,30 C46,25 40,28 36,37 L32,44 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'headband' && (
          <>
            <path
              d="M30,35 C30,21 42,14 55,15 C66,16 72,24 72,34 Z"
              fill={c.hair}
              stroke="#000000"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M30,32 Q52,27 72,33 L72,39 Q52,33 30,38 Z"
              fill="#e85729"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </>
        )}
        {c.hairStyle === 'curls' && (
          <path
            d="M29,43 C27,32 32,20 44,17 C55,14 69,18 73,29 C65,26 57,28 49,30 C42,32 36,36 33,44 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'bangs' && (
          <path
            d="M30,43 C29,25 40,16 55,17 C68,18 74,26 73,34 C65,30 53,29 39,34 L34,43 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'wavy' && (
          <path
            d="M31,43 C31,26 42,19 55,20 C67,21 73,28 73,36 C66,29 56,28 48,32 C41,34 36,39 33,44 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'bob' && (
          <path
            d="M31,37 C34,21 47,17 61,20 C69,22 73,28 73,35 L42,34 C38,35 34,39 32,44 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'afroBeard' && (
          <path
            d="M32,33 C36,20 50,16 64,20 C71,23 73,29 73,33 C63,29 45,28 32,33 Z"
            fill={c.hair}
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        )}
        {c.hairStyle === 'baldWisp' && (
          <g fill="none" stroke="#000000" strokeWidth="2.1" strokeLinecap="round">
            <path d="M46,21 C45,15 49,13 51,15" />
            <path d="M53,20 C54,14 58,13 59,16" />
            <path d="M59,22 C62,17 65,17 65,20" />
          </g>
        )}

        {/* Eyebrows */}
        <path
          d="M44,37 Q48,34 52,37"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M59,37 Q63,34 67,37"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <ellipse cx="48" cy="43" rx="2.4" ry="3.2" fill="#000000" />
        <ellipse cx="62" cy="43" rx="2.4" ry="3.2" fill="#000000" />
        <circle cx="47.3" cy="41.8" r="0.9" fill="#ffffff" />
        <circle cx="61.3" cy="41.8" r="0.9" fill="#ffffff" />

        {/* Nose */}
        <path
          d="M57,44 L60,51 L55,52"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glasses Overlay */}
        {c.glasses && (
          <g
            fill="none"
            stroke={
              c.glasses === 'orange'
                ? '#e85729'
                : c.glasses === 'teal'
                  ? '#15803d'
                  : '#000000'
            }
            strokeWidth="2.1"
          >
            <circle cx="48" cy="43" r="6.5" />
            <circle cx="63" cy="43" r="6.5" />
            <path d="M54.5,43 L56.5,43" />
            <path d="M41.5,43 L32,45" />
          </g>
        )}

        {/* Mouth Expressions */}
        {c.expression === 'grin' && (
          <path
            d="M46,57 Q55,64 63,56 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
        )}
        {c.expression === 'smile' && (
          <path
            d="M48,58 Q55,62 61,57"
            fill="none"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
        {c.expression === 'smirk' && (
          <path
            d="M49,59 Q56,61 62,56"
            fill="none"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
        {c.expression === 'frown' && (
          <path
            d="M49,61 Q55,57 61,61"
            fill="none"
            stroke="#000000"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
        {c.expression === 'cheer' && (
          <ellipse
            cx="55"
            cy="59"
            rx="4.2"
            ry="5"
            fill="#e85729"
            stroke="#000000"
            strokeWidth="2.1"
          />
        )}
      </svg>
    </div>
  );
};

export const DoodleAddSlot: React.FC<{
  label?: string;
  onClick?: () => void;
  size?: 'sm' | 'md';
}> = ({ label = 'Add', onClick, size = 'md' }) => {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
    >
      <div
        className={`${dim} rounded-full border-2 border-dashed border-[#000000]/45 bg-[#ffffff] group-hover:bg-[#7cd7a0]/30 group-hover:border-[#000000] flex items-center justify-center transition-colors`}
      >
        <Plus className="w-4 h-4 text-[#000000]/65 group-hover:text-[#000000]" />
      </div>
      {label && (
        <span className="text-[11px] font-bold text-[#000000]/65 group-hover:text-[#000000] whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
};
