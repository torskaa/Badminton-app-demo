import React from 'react';
import { DoodleAvatar } from './DoodleAvatar';

export interface StackMember {
  id: string;
  name: string;
}

interface JoinedAvatarStackProps {
  members: StackMember[];
  totalCount?: number;
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const BADGE_SIZE_CLASSES: Record<NonNullable<JoinedAvatarStackProps['size']>, string> = {
  xs: 'w-8 h-8 text-[11px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
};

export const JoinedAvatarStack: React.FC<JoinedAvatarStackProps> = ({
  members,
  totalCount,
  maxVisible = 4,
  size = 'sm',
  onClick,
  className = '',
}) => {
  const visibleMembers = members.slice(0, maxVisible);
  const actualTotal = Math.max(totalCount ?? members.length, members.length);
  const remaining = Math.max(0, actualTotal - visibleMembers.length);
  const badgeText = remaining > 99 ? '+99' : `+${remaining}`;

  const content = (
    <div
      className={`inline-flex items-center -space-x-2.5 ${className}`}
    >
      {visibleMembers.map((member) => (
        <div
          key={member.id}
          className="rounded-full ring-2 ring-[#1f2937] bg-[#ffffff] shrink-0"
        >
          <DoodleAvatar
            seed={member.name}
            size={size}
            ringClass="border-0"
          />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className={`${BADGE_SIZE_CLASSES[size]} rounded-full bg-[#ffffff] text-[#000000] ring-2 ring-[#1f2937] flex items-center justify-center font-bold tabular-nums tracking-tight shrink-0 select-none`}
        >
          {badgeText}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="no-doodle inline-flex items-center cursor-pointer transition-transform active:scale-95"
      >
        {content}
      </button>
    );
  }

  return content;
};
