export interface Resume {
    person: Contact;
    categories: Category[];
    skills: SkillCategory[];
    recognitions: RecognitionCategory[];
}

export interface Biography {
    birth: {
       place?: string;
       date?: Date;
    };
    gender?: string;
    pronouns?: string;
    nationality?: string[];
    tagline?: string;
}

export interface Contact {
    name: string;
    phone: {
        home?: string;
        mobile?: string;
        work?: string;
    };
    email: {
        personal?: string;
        work?: string;
    };
    address: {
        mailing?: string;
    };
    links: {
        github?: string;
        stackOverflow?: [number, string];
    };
    biography: Biography;
}

export interface Category {
    name: string;
    entities: EntityInvolvements[];
}

export interface DateRange {
    start: ApproximateDate;
    // if !range.end, range is start--present
    // for single-month, use range.end = range.start
    end?: ApproximateDate;
}

// represents the person's sequence of involvements
// with a particular institution
export interface EntityInvolvements {
    entity: string;
    short?: string;
    entityDescription?: string;
    location?: string;
    involvements: Involvement[];
}

export interface Involvement {
    dates: DateRange;
    title: string;
    short?: string;
    properties?: InvolvementProperty[];
    description?: string;
    accomplishments?: string[];
    lists?: InvolvementSublisting[];
    url?: string;
    tags?: string[]; // for search
}

export interface InvolvementProperty {
    // e.g., GPA = { name: "GPA", value: "3.6/4.0" };
    name: string;
    value: string;
    url?: string;
}

export interface InvolvementSublisting {
    // e.g., Courses = { name: "Highlighted Coursework", value: ["CS 101", ...]}
    name: string;
    list: string[];
}

export interface SkillCategory {
    name: string;
    skills: string[];
}

export interface RecognitionCategory {
    name: string;
    recognitions: Recognition[];
}

export interface Recognition {
    date: ApproximateDate;
    description: string;
    more?: string;
}

export interface ApproximateDate {
    year: number;
    month?: number;
    day?: number;
}

export function MakeDate(year: number, month?: number, day?: number): ApproximateDate {
    if (month && day) return {
        year: year, month: month, day: day
    };
    if (month) return {
        year: year, month: month
    };
    return { year: year };
}

export function DatesAreEqual(first: ApproximateDate, second: ApproximateDate) {
    if (first === second) return true;
    if (first.year !== second.year) return false;
    if (first.month !== second.month) return false;
    return first.day === second.day;
}

export function CompareDatesAscending(first: ApproximateDate, second: ApproximateDate): number {
    // first < second  : return -1
    // first == second : return  0
    // first > second  : return +1
    if (first.year < second.year) return -1;
    if (first.year > second.year) return +1;

    if (first.month && second.month) {
        if (first.month < second.month) return -1;
        if (first.month > second.month) return +1;

    } else {
        // whichever has a month defined is greater
        if (first.month) return +1;
        else if (second.month) return -1;
        else return 0;
    }

    // if we are here, then:
    // 1. first.year == second.year
    // 2. first.month == second.month

    if (first.day && second.day) {
        if (first.day < second.day) return -1;
        if (first.day > second.day) return +1;
    } else {
        if (first.day) return +1;
        if (second.day) return -1;
        else return 0;
    }

    return 0;
  }

export function CompareDatesDescending(first: ApproximateDate, second: ApproximateDate): number {
    return -CompareDatesAscending(first, second);
}

export function CompareDateRangeAscending(first: DateRange, second: DateRange): number {
    return CompareDatesAscending(first.start, second.start);
}

export function CompareDateRangeDescending(first: DateRange, second: DateRange): number {
    if (!first.end && second.end) { return -1; }
    if (!second.end && first.end) { return +1; }
    if (!first.end && !second.end) { return CompareDatesDescending(first.start, second.start) }
    return CompareDatesDescending(first.end, second.end);
}

export function SortEntitiesDescending(entities: EntityInvolvements[]): void {
    entities.forEach(e => {
        e.involvements.sort((f, s) => CompareDateRangeDescending(f.dates, s.dates));
    });

    entities.sort((a, b) => {
    if (a.involvements.length === 0 && b.involvements.length === 0) return 0;
    if (a.involvements.length === 0) return +1; // always put at the end
    if (b.involvements.length === 0) return -1; // always put at the end

    return CompareDateRangeDescending(a.involvements[0].dates, b.involvements[0].dates);
    });
}

export function IsDateInRange(date: ApproximateDate, range: DateRange) {
    // start           end
    //  /               /
    // <---- range ---->
    //     \
    //      \ date
    const start_cmp = CompareDatesAscending(range.start, date);

    if (start_cmp > 0) return false; // date range starts aftern date.

    return !range.end || ( CompareDatesAscending(range.end, date) >= 0 );
}

export function DateRangesIntersect(first: DateRange, second:DateRange): boolean {
    const start_cmp = CompareDatesAscending(first.start, second.start);

    if (start_cmp > 0) return DateRangesIntersect(second, first);

    // after this point, `first` always comes at the
    // same(ish) time or before `second`...

    // if first goes to the present, then it subsumes second always.
    if (!first.end) return true;

    const inter_cmp = CompareDatesAscending(first.end, second.start);

    // the first range either ends before the second starts (no inersection)
    // or after (intersection)
    return inter_cmp >= 0;
}
