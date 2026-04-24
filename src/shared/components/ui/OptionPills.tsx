'use client';

import Image from 'next/image';

export interface ColorPill {
  label: string;
  value: string;
  image: string;
  isSoldOut: boolean;
}
export interface CapacityPill {
  label: string;
  value: string;
}

interface Props {
  selectedCapacity: string;
  selectedColor: string;
  capacities: CapacityPill[];
  colors: ColorPill[];
  onSelectCapacity: (val: string) => void;
  onSelectColor: (val: string) => void;
  capacityLabel: string;
  colorLabel: string;
  soldOutLabel?: string;
}

export default function OptionPills({
  selectedCapacity, selectedColor,
  capacities, colors,
  onSelectCapacity, onSelectColor,
  capacityLabel, colorLabel,
  soldOutLabel = 'Sold out',
}: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p
          id="option-pills-capacity-label"
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]"
        >
          {capacityLabel}
        </p>
        <div
          role="group"
          aria-labelledby="option-pills-capacity-label"
          className="flex flex-wrap gap-2"
        >
          {capacities.map((c) => {
            const active = c.value === selectedCapacity;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onSelectCapacity(c.value)}
                className={
                  'min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition ' +
                  (active
                    ? 'border-[#0055D4] bg-[#0055D4] text-white'
                    : 'border-[#E5E8EB] bg-white text-[#111827]')
                }
                aria-pressed={active}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p
          id="option-pills-color-label"
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]"
        >
          {colorLabel}
        </p>
        <ul
          role="group"
          aria-labelledby="option-pills-color-label"
          className="scrollbar-hide flex gap-3 overflow-x-auto pb-1"
        >
          {colors.map((c) => {
            const active = c.value === selectedColor;
            return (
              <li key={c.value}>
                <button
                  type="button"
                  onClick={() => onSelectColor(c.value)}
                  disabled={c.isSoldOut}
                  aria-pressed={c.isSoldOut ? undefined : active}
                  className={
                    'flex shrink-0 flex-col items-center gap-1 rounded-2xl border p-2 transition ' +
                    (active ? 'border-[#0055D4] bg-[#F0F7FF]' : 'border-[#E5E8EB] bg-white') +
                    (c.isSoldOut ? ' opacity-40' : '')
                  }
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#F9FAFB]">
                    {c.image ? (
                      <Image src={c.image} alt="" fill sizes="48px" className="object-contain p-1" />
                    ) : null}
                  </div>
                  <span className="max-w-[72px] truncate text-[11px] font-semibold text-[#111827]">
                    {c.label}
                  </span>
                  {c.isSoldOut && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#F04452]">
                      {soldOutLabel}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
