export function inverseLerp(a: number, b: number, value: number): number {
  return (value - a) / (b - a);
}