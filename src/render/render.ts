import { ApproximateDate, DateRange, DatesAreEqual } from "../core/resume";

var months: {[month: number]: string} = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

export function RenderApproxDate(date: ApproximateDate): string {
  if (date.day) { }
  if (date.month) {
    return "" + months[date.month] + "\u00A0" + date.year;
  }
  return ""+date.year;
}

export function RenderDateRange(range: DateRange): string {
  if (range.end && DatesAreEqual(range.start, range.end)) {
    return RenderApproxDate(range.start);
  }
  return RenderApproxDate(range.start) + "\u00A0\u2013 " +
    (range.end ? RenderApproxDate(range.end) : "Present");
}
