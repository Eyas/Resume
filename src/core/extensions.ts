export function group<T>(
  items: T[],
  grouper: (a: T) => string
): { [group: string]: T[] } {
  const g: { [group: string]: T[] } = {};
  for (const item of items) {
    const groupKey = grouper(item);
    if (groupKey in g) g[groupKey].push(item);
    else g[groupKey] = [item];
  }
  return g;
}

export function collate<T, I>(
  items: T[],
  grouper: (a: T) => string,
  mapper: (a: T) => I[]
): { [group: string]: I[] } {
  const g: { [group: string]: I[] } = {};

  for (const item of items) {
    const groupKey = grouper(item);
    const mapped = mapper(item);

    if (groupKey in g) {
      g[groupKey] = g[groupKey].concat(mapped);
    } else {
      g[groupKey] = mapped;
    }
  }
  return g;
}
