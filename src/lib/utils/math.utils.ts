// Create a function to map a value between 2 ranges

export const range = (
  value: number,
  [sourceMin, sourceMax]: [number, number],
  [targetMin, targetMax]: [number, number]
) => {
  return ((value - sourceMin) * (targetMax - targetMin)) / (sourceMax - sourceMin) + targetMin
}
