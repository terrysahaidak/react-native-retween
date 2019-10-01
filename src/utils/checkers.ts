import { AnimatedInputValue, RGBColor } from 'src/common';

export function isNumber(v: any): v is number {
  return typeof v === 'number';
}

export function isRGB(value: AnimatedInputValue): value is RGBColor {
  const color = value as RGBColor;

  return (
    typeof color === 'object' &&
    isNumber(color.r) &&
    isNumber(color.g) &&
    isNumber(color.b)
  );
}
