import { DateRangesIntersect, Resume } from "../core/resume";
import { All, Transform as XForm } from "../core/transform";

export const Transform: XForm<Resume> = {
  categories: {
    sequence: [
      {
        item: "Education",
        entities: {
          filter: "MIT",
          involvements: {
            filter: All,
            dates: { start: false, end: true },
            lists: {
              sequence: [
                {
                  item: /Coursework/g,
                  list: {
                    sequence: [
                      { item: /Computer Language/g },
                      { item: /Distributed Systems/g },
                      { item: /Multicore/g },
                      { item: /Operating System/g },
                      { item: /Interface/g },
                    ],
                  },
                },
                {
                  item: /Membership/g,
                  list: {
                    sequence: [
                      { item: /Phi Beta Kappa/g },
                      { item: /Tau Beta Pi/g },
                      { item: /Eta Kappa Nu/g },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
      {
        item: "Industry Experience",
        name: { as: "Experience" },
        entities: {
          filter: (entity) =>
            entity.involvements.some((inv) => inv.dates.start.year > 2013),
          involvements: {
            filter: (involvement) => involvement.dates.start.year > 2013,
          },
        },
      },
      {
        item: "Industry Experience",
        name: { as: "Other Experience" },
        entities: {
          filter: (entity) =>
            entity.involvements.some(
              (inv) =>
                inv.dates.start.year <= 2013 && !inv.tags?.includes("intern"),
            ),
          involvements: {
            filter: (involvement) =>
              involvement.dates.start.year <= 2013 &&
              !involvement.tags?.includes("intern"),
          },
        },
      },
      {
        item: "Education Experience",
        entities: {
          filter: (entity) =>
            entity.involvements.some((involvement) =>
              DateRangesIntersect({ start: { year: 2013 } }, involvement.dates),
            ),
        },
      },
      {
        item: "Volunteer",
        entities: {
          filter: (entity) =>
            entity.involvements.some(
              (involvement) =>
                (involvement.tags || []).indexOf("highlight") >= 0,
            ),
          first: 3,
          // filter: (entity) => entity.involvements.some(involvement => involvement.dates.start.year > 2013),
          // filter: (entity) => entity.involvements.some(involvement => CompareDatesAscending(involvement.dates.start, { year: 2016, month: 6}) >= 0 )
          // involvements: {
          //     filter: All,
          //     description: false,
          //     accomplishments: { filter: None }
          // }
        },
      },
      {
        item: "Side Projects",
        name: { as: "Selected Writings" },
        entities: {
          filter: /Writings/,
        },
      },
    ],
  },
};
