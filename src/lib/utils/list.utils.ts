export function lookup<T>(list: T[], predicate: (t: T) => boolean): [pos: T[], neg: T[]] {
  const pos: T[] = []
  const neg: T[] = []

  for (const item of list) {
    const pushList = predicate(item) ? pos : neg
    pushList.push(item)
  }

  return [pos, neg]
}

export function groupBy<T, K extends string | number | symbol>(
  list: T[],
  key: (t: T) => K
): Record<K, T[]> {
  const map: Record<string | number | symbol, T[]> = {}

  for (const item of list) {
    const k = key(item)
    if (!map[k]) map[k] = []
    map[k]?.push(item)
  }

  return map
}
