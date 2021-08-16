interface Array<T> {
  groupBy(f: (g: T) => string): { [group: string]: T[] };
  groupByFlatMap<B>(
    f: (g: T) => string,
    m: (a: T) => B[]
  ): { [group: string]: B[] };
}

Array.prototype.groupBy = function (grouper: (a: any) => string) {
  var g: { [group: string]: any[] } = {};
  this.forEach((item: any) => {
    var grp = grouper(item);
    if (g.hasOwnProperty(grp)) g[grp].push(item);
    else g[grp] = [item];
  });
  return g;
};

Array.prototype.groupByFlatMap = function (
  grouper: (a: any) => string,
  mapper: (a: any) => any[]
) {
  var g: { [group: string]: any[] } = {};
  this.forEach((item: any) => {
    var grp = grouper(item);
    var mapped = mapper(item);
    if (g.hasOwnProperty(grp)) g[grp] = g[grp].concat(mapped);
    else g[grp] = mapped;
  });
  return g;
};
