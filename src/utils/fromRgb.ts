import { AnimatedInputValue } from 'src/common';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBProp extends RGB {
  __color: boolean;
}

export function isRGB(value: AnimatedInputValue): value is RGBProp {
  return typeof value === 'object' && (value as RGBProp).__color;
}

export function fromRgb(rgb: RGB): RGBProp {
  return {
    ...rgb,
    __color: true,
  };
}
