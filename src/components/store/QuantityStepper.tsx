import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
};

export function QuantityStepper({ value, onChange, min = 1, max = 10, label }: QuantityStepperProps) {
  const btn =
  'inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors duration-150 hover:bg-charcoal/[0.07] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon';
  return (
    <div className="inline-flex items-center rounded-full border border-charcoal/15" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>);

}