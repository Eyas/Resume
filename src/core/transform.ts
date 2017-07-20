import { Resume, Category, EntityInvolvements, Involvement, InvolvementProperty, InvolvementSublisting, DateRange, ApproximateDate } from "./resume";


export type Pattern<T> = string|RegExp|((t:T)=>boolean);
// TODO: Should a 'concat' merge be a pattern? |{concat: Pattern<T>[]}

export type FilterTransform<Type, XForm> = { filter: Pattern<Type> } & XForm;
export interface IntersectTransform<Type, XForm> {
    sequence: ({ item: Pattern<Type> } & XForm)[];
}
export type ListTransform<Type, XForm> = FilterTransform<Type, XForm> | IntersectTransform<Type, XForm>;

function isFilterTransform<Type, XForm>(xform: ListTransform<Type, XForm>): xform is FilterTransform<Type, XForm> {
    return xform.hasOwnProperty("filter");
}
function isIntersectTransform<Type, XForm>(xform: ListTransform<Type, XForm>): xform is IntersectTransform<Type, XForm> {
    return xform.hasOwnProperty("sequence");
}

export function All(x: Category|EntityInvolvements|Involvement|InvolvementProperty|InvolvementSublisting|string) { return true; }
export function None(x: Category|EntityInvolvements|Involvement|InvolvementProperty|InvolvementSublisting|string) { return false; }

export interface ResumeTransform {
    categories?: ListTransform<Category, CategoryTransform>;
    // person
    // skill
    // recognitions
}
export interface CategoryTransform {
    // Not present === { filter: All }, with no transform present
    entities?: ListTransform<EntityInvolvements, EntityTransform>;
    as?: string;
}
export interface EntityTransform {
    involvements?: ListTransform<Involvement, InvolvementTransform>;
}
export interface InvolvementTransform {
    dates?: DateRangeTransform;
    properties?: ListTransform<InvolvementProperty, PropertyTransform>;
    description?: boolean;
    accomplishments?: ListTransform<string, StringTransform>;
    lists?: ListTransform<InvolvementSublisting, SublistingTransform>;
}
export interface PropertyTransform {
    value?: StringTransform;
}
export interface SublistingTransform {
    list?: ListTransform<string, StringTransform>;
}
export interface StringTransform {
    xform?: string | ((s: string)=>string);
}

export interface DateRangeTransform {
    start?: boolean|ApproximateDateTransform
    end?: boolean|ApproximateDateTransform;
}
export interface ApproximateDateTransform {
    month?: boolean;
    day?: boolean;
}

export type Tester<T> = (pattern: Pattern<T>, item: T) => boolean;

export function TestCategory(pattern: Pattern<Category>, category: Category): boolean {
    if (typeof pattern === "string") {
        return category.name === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(category.name);
    } else if (typeof pattern === "function") {
        return pattern(category);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestCategory(sub_pattern, category));
    } else throw "Invalid Pattern";
}
export function TestEntity(pattern: Pattern<EntityInvolvements>, entity: EntityInvolvements): boolean {
    if (typeof pattern === "string") {
        return entity.short === pattern || entity.entity === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(entity.short) || pattern.test(entity.entity);
    } else if (typeof pattern === "function") {
        return pattern(entity);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestEntity(sub_pattern, entity));
    } else throw "Invalid Pattern";
}
export function TestInvolvement(pattern: Pattern<Involvement>, involvement: Involvement): boolean {
    if (typeof pattern === "string") {
        return involvement.title === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(involvement.title);
    } else if (typeof pattern === "function") {
        return pattern(involvement);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestInvolvement(sub_pattern, involvement));
    } else throw "Invalid Pattern";
}
export function TestProperty(pattern: Pattern<InvolvementProperty>, property: InvolvementProperty): boolean {
    if (typeof pattern === "string") {
        return property.name === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(property.name);
    } else if (typeof pattern === "function") {
        return pattern(property);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestProperty(sub_pattern, property));
    } else throw "Invalid Pattern";
}
export function TestSublisting(pattern: Pattern<InvolvementSublisting>, listing: InvolvementSublisting): boolean {
    if (typeof pattern === "string") {
        return listing.name === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(listing.name);
    } else if (typeof pattern === "function") {
        return pattern(listing);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestSublisting(sub_pattern, listing));
    } else throw "Invalid Pattern";
}
export function TestString(pattern: Pattern<string>, value: string): boolean {
    if (typeof pattern === "string") {
        return value === pattern;
    } else if (pattern instanceof RegExp) {
        return pattern.test(value);
    } else if (typeof pattern === "function") {
        return pattern(value);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestString(sub_pattern, value));
    } else throw "Invalid Pattern";
}

export function SelectCategory(
    list: Category[],
    pattern: Pattern<Category>): Category {
    
    return list.find(cat => TestCategory(pattern, cat));
}

export function ListTransformer<Type, XForm>(
    list: Type[],
    transform: ListTransform<Type, XForm>,
    transformer: (t: Type, x: XForm) => Type,
    tester: Tester<Type>): Type[] {

    if (isFilterTransform(transform)) {
        var glob: Pattern<Type> = transform.filter;

        var filtered = list.filter(item => tester(glob, item));
        return filtered.map(item => transformer(item, transform));

    } else if (isIntersectTransform(transform)) {

        var intersected: Type[] = [];
        transform.sequence.forEach(int => {
            var filtered = (list.filter(item => tester(int.item, item)))[0];
            if (filtered) {
                intersected.push(transformer(filtered, int));
            }
        });

        return intersected;

    } else throw "Unknown transform";
}

export function TransformCategories(
    categories: Category[],
    filter: ListTransform<Category, CategoryTransform>): Category[] {
    return ListTransformer(
        categories,
        filter,
        TransformCategory,
        TestCategory
    );
}
export function TransformEntities(
    entities: EntityInvolvements[],
    filter: ListTransform<EntityInvolvements, EntityTransform>): EntityInvolvements[] {
    return ListTransformer(
        entities,
        filter,
        TransformEntity,
        TestEntity
    );
}
export function TransformInvolvements(
    involvements: Involvement[],
    filter: ListTransform<Involvement, InvolvementTransform>): Involvement[] {
    return ListTransformer(
        involvements,
        filter,
        TransformInvolvement,
        TestInvolvement
    );
}
export function TransformProperties(
    properties: InvolvementProperty[],
    filter: ListTransform<InvolvementProperty, PropertyTransform>): InvolvementProperty[] {
    return ListTransformer(
        properties,
        filter,
        TransformProperty,
        TestProperty
    );
}
export function TransformSublistings(
    lists: InvolvementSublisting[],
    filter: ListTransform<InvolvementSublisting, SublistingTransform>): InvolvementSublisting[] {
    return ListTransformer(
        lists,
        filter,
        TransformSublisting,
        TestSublisting
    );
}
export function TransformStrings(
    strings: string[],
    filter: ListTransform<string, StringTransform>): string[] {
    return ListTransformer(
        strings,
        filter,
        TransformString,
        TestString
    );
}

export function TransformResume(
    resume: Resume,
    filter: ResumeTransform) : Resume {
    var ret: Resume = {
        person: resume.person,
        categories: filter.categories === undefined ?
            resume.categories :
            TransformCategories(resume.categories, filter.categories),
        skills: resume.skills,
        recognitions: resume.recognitions
    };
    return ret;
}

export function TransformCategory(
    category: Category,
    filter: CategoryTransform): Category {
    var ret: Category = {
        name: filter.as || category.name,
        entities:
            filter.entities === undefined ?
                category.entities :
                TransformEntities(category.entities, filter.entities)
    };

    return ret;
}

export function TransformEntity(
    entity: EntityInvolvements,
    filter: EntityTransform): EntityInvolvements {
    var ret: EntityInvolvements = {
        entity: entity.entity,
        involvements:
            filter.involvements === undefined ?
                entity.involvements :
                TransformInvolvements(entity.involvements, filter.involvements)
    };

    if (entity.short) ret.short = entity.short;
    if (entity.entityDescription) ret.entityDescription = entity.entityDescription;
    if (entity.location) ret.location = entity.location;

    return ret;
}

export function TransformInvolvement(
    involvement: Involvement,
    filter: InvolvementTransform): Involvement {
    var ret: Involvement = {
        dates: filter.dates ? FilterDateRange(involvement.dates, filter.dates) : involvement.dates,
        title: involvement.title
    };
    if (involvement.short) ret.short = involvement.short;
    if (filter.description !== false && involvement.description) ret.description = involvement.description;
    if (involvement.accomplishments) {
        if (filter.accomplishments === undefined) ret.accomplishments = involvement.accomplishments;
        else ret.accomplishments = TransformStrings(involvement.accomplishments, filter.accomplishments);
    }
    if (involvement.properties) {
        if (filter.properties === undefined) ret.properties = involvement.properties;
        else ret.properties = TransformProperties(involvement.properties, filter.properties);
    }
    if (involvement.lists) {
        if (filter.lists === undefined) ret.lists = involvement.lists;
        else ret.lists = TransformSublistings(involvement.lists, filter.lists);
    }

    return ret;
}

export function TransformProperty(prop: InvolvementProperty, xform: PropertyTransform): InvolvementProperty {
    return {
        name: prop.name,
        value: xform.value ? TransformString(prop.value, xform.value) :  prop.value
    };
}

export function TransformSublisting(list: InvolvementSublisting, xform: SublistingTransform): InvolvementSublisting {
    return {
        name: list.name,
        list: xform.list === undefined ? list.list : TransformStrings(list.list, xform.list)
    };
}

export function TransformString(str: string, xform: StringTransform): string {
    var xf = xform.xform;
    if (typeof xf === "string") {
        return xf;
    } else if (typeof xf === "undefined") {
        return str;
    } else {
        return xf(str);
    }
}

export function FilterDateRange(range: DateRange, filter: DateRangeTransform): DateRange {
    if (filter.start === false && filter.end === true) return { start: range.end, end: range.end};
    if (filter.start === false && filter.end) {
        var e = FilterApproximateDate(range.end, <ApproximateDateTransform>filter.end);
        return {start: e, end: e};
    }
    if (filter.start === false) throw "bad call";

    var ret: DateRange = {
        start: filter.start !== true && filter.start ? FilterApproximateDate(range.start, filter.start) : range.start
    };
    if (range.end) {
        if (filter.end === true) ret.end = range.end;
        if (filter.end) ret.end = FilterApproximateDate(range.end, <ApproximateDateTransform>filter.end);
    }
    return ret;
}

export function FilterApproximateDate(date: ApproximateDate, filter: ApproximateDateTransform): ApproximateDate {
    var ret: ApproximateDate = {year: date.year};
    if (filter.day !== false && date.day) ret.day = date.day;
    if (filter.month !== false && date.month) ret.month = date.month;
    return ret;
}

export function InvolvementsByTag(categories: Category[], tags: string | string[]): ({involvement: Involvement, entity: EntityInvolvements, category: Category})[] {
    const exploded = categories.flatMap(c => c.entities.flatMap(e => e.involvements.filter(i => i.tags && i.tags.length > 0).map(i => ({involvement: i, entity: e, category: c}))));

    if (typeof tags === "string") {
        return exploded.filter(e => e.involvement.tags.indexOf(tags) >= 0);
    }

    // eh, just do the O(n^2) for now, easier
    return exploded.filter(e => e.involvement.tags.some(tag => tags.indexOf(tag) >= 0));

    // var byTag = new Map<string, {involvement: Involvement, entity: EntityInvolvements, category: Category}[]>();
    // // populate byTag below (since values appear multiple times)
    // exploded.forEach(exp => exp.involvement.tags.forEach(tag => {
    //     if (byTag.has(tag)) byTag.get(tag).push(exp);
    //     else byTag.set(tag, [ exp ]);
    // }));
    // var returned = new Set<Involvement>(); // can be weakset
    // // this is not idempotent, sorry :(
    // return tags.flatMap(tag => byTag.has(tag) ? byTag.get(tag).filter(x => !returned.has(x.involvement)) : []);
}
