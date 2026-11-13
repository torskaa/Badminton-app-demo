import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: 'green' | 'orange' | 'dark' | 'soft';
  rightSlot?: React.ReactNode;
}

const BADGE_CLASSES: Record<NonNullable<SectionHeaderProps['badgeVariant']>, string> = {
  green: 'bg-[#7cd7a0] text-[#000000]',
  orange: 'bg-[#e85729] text-[#ffffff]',
  dark: 'bg-[#000000] text-[#ffffff]',
  soft: 'bg-[#e8f7ee] text-[#000000]',
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  badgeVariant = 'green',
  rightSlot,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <div className="min-w-0 flex-1 text-left">
        <h3 className="text-sm font-bold text-[#000000] leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] font-normal text-[#000000]/65 leading-snug mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot ? (
        <div className="shrink-0 whitespace-nowrap">{rightSlot}</div>
      ) : badge ? (
        <span
          className={`px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold shrink-0 whitespace-nowrap ${BADGE_CLASSES[badgeVariant]}`}
        >
          {badge}
        </span>
      ) : null}
    </div>
  );
};
