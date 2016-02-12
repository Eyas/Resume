import { Category } from "../core/resume";
import { ResumeTransform, All, None } from "../core/transform";

export var Transform: ResumeTransform = { categories: {
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
                    {item: /Automata/g },
                    {item: /Computer Language/g },
                    {item: /Computer Systems/g },
                    {item: /Algorithms/g },
                    {item: /Distributed Systems/g },
                    {item: /Multicore/g },
                    {item: /Operating System/g },
                    {item: /Interface/g }
                    ]
                }
                },
                {
                item: /Membership/g,
                list: {
                    sequence: [
                    {item: /Phi Beta Kappa/g },
                    {item: /Tau Beta Pi/g },
                    {item: /Eta Kappa Nu/g },
                    {item: /Number Six Club/g, xform: "St. Anthony Hall (Delta Psi Co-Ed Fraternity; The Number Six Club)" }
                    ]
                }
                }
            ]
            }
        }
        }
    },
    {
        item: "Industry Experience",
        entities: { filter: All, /* for now */ }
    },
    {
        item: "Education Experience",
        entities: {
        sequence: [
            {
            item: /CSAIL/g,
            involvements: {
                filter: All,
                accomplishments: { filter: All }
            }
            }
        ]
        }
    },
    {
        item: "Volunteer",
        entities: {
            filter: (entity) => entity.involvements.some(involvement => involvement.dates.start.year > 2012),
            involvements: { filter: All, accomplishments: { filter: None }, description: false }
        }
    }
    ]
} };