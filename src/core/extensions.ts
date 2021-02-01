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

function getJSON(url: string): Promise<Object> {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        var data: Object = JSON.parse(request.responseText);
        resolve(data);
      } else {
        reject(request.status);
      }
    };

    request.onerror = function (ev) {
      reject(ev);
    };

    request.send();
  });
}
