import {
  Resume,
  Category,
  EntityInvolvements,
  Involvement,
  InvolvementProperty,
  InvolvementSublisting,
  DateRange,
  ApproximateDate,
} from "./resume";

export type Pattern<T> = string | RegExp | ((t: T) => boolean);
export type ScalarXForm<T> = { as?: T | ((t: T) => T) };
// TODO: Should a 'concat' merge be a pattern? |{concat: Pattern<T>[]}

export type FilterTransform<Type> = {
  filter: Pattern<Type>;
  first?: number;
} & Transform<Type>;

export interface IntersectTransform<Type> {
  sequence: ReadonlyArray<{ item: Pattern<Type> } & Transform<Type>>;
}

export type ListTransform<Type> =
  | FilterTransform<Type>
  | IntersectTransform<Type>;

function isFilterTransform<Type>(
  xform: ListTransform<Type>
): xform is FilterTransform<Type> {
  return xform.hasOwnProperty("filter");
}
function isIntersectTransform<Type>(
  xform: ListTransform<Type>
): xform is IntersectTransform<Type> {
  return xform.hasOwnProperty("sequence");
}

type Certain<T> = T extends null | undefined ? never : T;
export type Transform<Type> = Type extends object
  ? {
      readonly [K in keyof Type]?: Certain<Type[K]> extends DateRange
        ? DateRangeTransform
        : Certain<Type[K]> extends ReadonlyArray<infer Item>
        ? ListTransform<Item>
        : ScalarXForm<Certain<Type[K]>>;
    }
  : ScalarXForm<Type>;

export function All() {
  return true;
}
export function None() {
  return false;
}

export interface DateRangeTransform {
  start?: boolean | ApproximateDateTransform;
  end?: boolean | ApproximateDateTransform;
}
export interface ApproximateDateTransform {
  month?: boolean;
  day?: boolean;
}

export type Tester<T> = (pattern: Pattern<T>, item: T) => boolean;

export function TestCategory(
  pattern: Pattern<Category>,
  category: Category
): boolean {
  if (typeof pattern === "string") {
    return category.name === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(category.name);
  } else if (typeof pattern === "function") {
    return pattern(category);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestCategory(sub_pattern, category));
  } else throw new Error("Invalid Pattern");
}
export function TestEntity(
  pattern: Pattern<EntityInvolvements>,
  entity: EntityInvolvements
): boolean {
  if (typeof pattern === "string") {
    return entity.short === pattern || entity.entity === pattern;
  } else if (pattern instanceof RegExp) {
    return (
      (entity.short && pattern.test(entity.short)) ||
      pattern.test(entity.entity)
    );
  } else if (typeof pattern === "function") {
    return pattern(entity);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestEntity(sub_pattern, entity));
  } else throw new Error("Invalid Pattern");
}
export function TestInvolvement(
  pattern: Pattern<Involvement>,
  involvement: Involvement
): boolean {
  if (typeof pattern === "string") {
    return involvement.title === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(involvement.title);
  } else if (typeof pattern === "function") {
    return pattern(involvement);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestInvolvement(sub_pattern, involvement));
  } else throw new Error("Invalid Pattern");
}
export function TestProperty(
  pattern: Pattern<InvolvementProperty>,
  property: InvolvementProperty
): boolean {
  if (typeof pattern === "string") {
    return property.name === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(property.name);
  } else if (typeof pattern === "function") {
    return pattern(property);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestProperty(sub_pattern, property));
  } else throw new Error("Invalid Pattern");
}
export function TestSublisting(
  pattern: Pattern<InvolvementSublisting>,
  listing: InvolvementSublisting
): boolean {
  if (typeof pattern === "string") {
    return listing.name === pattern;
  } else if (pattern instanceof RegExp) {
    return pattern.test(listing.name);
  } else if (typeof pattern === "function") {
    return pattern(listing);
    // } else if (pattern.concat) {
    //     return pattern.concat.some(sub_pattern => TestSublisting(sub_pattern, listing));
  } else throw new Error("Invalid Pattern");
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
  } else throw new Error("Invalid Pattern");
}

export function SelectCategory(
  list: Category[],
  pattern: Pattern<Category>
): Category | undefined {
  return list.find((cat) => TestCategory(pattern, cat));
}

export function MakeListTransformer<Type>(
  transformer: (t: Type, x: undefined | Transform<Type>) => Type,
  tester: Tester<Type>
): (list: Type[], transform: undefined | ListTransform<Type>) => Type[] {
  return (list, transform) => {
    if (!transform) return list;
    if (isFilterTransform(transform)) {
      const glob: Pattern<Type> = transform.filter;
      return list
        .filter((item) => tester(glob, item))
        .slice(0, transform.first)
        .map((item) => transformer(item, transform));
    } else if (isIntersectTransform(transform)) {
      const intersected: Type[] = [];
      transform.sequence.forEach((int) => {
        const filtered = list.filter((item) => tester(int.item, item))[0];
        if (filtered) {
          intersected.push(transformer(filtered, int));
        }
      });

      return intersected;
    } else throw new Error("Unknown transform");
  };
}

export function MakeTransformer<Type>(
  transformer: (input: Type, filter: Transform<Type>) => Type
): (input: Type, filter: undefined | Transform<Type>) => Type {
  return (input, filter) => {
    if (!filter) return input;
    return transformer(input, filter);
  };
}

export const TransformResume = MakeTransformer<Resume>((resume, transform) => ({
  person: resume.person,
  categories: TransformCategories(resume.categories, transform.categories),
  skills: resume.skills, // TODO
  recognitions: resume.recognitions, // TODO
}));

export const TransformCategory = MakeTransformer<Category>(
  (category, transform) => ({
    name: TransformString(category.name, transform.name),
    entities:
      transform.entities === undefined
        ? category.entities
        : TransformEntities(category.entities, transform.entities),
  })
);

export const TransformCategories = MakeListTransformer<Category>(
  TransformCategory,
  TestCategory
);

export const TransformEntity = MakeTransformer<EntityInvolvements>(
  (entity, filter) => ({
    ...entity,

    involvements:
      filter.involvements === undefined
        ? entity.involvements
        : TransformInvolvements(entity.involvements, filter.involvements),
  })
);

export const TransformEntities = MakeListTransformer(
  TransformEntity,
  TestEntity
);

export const TransformInvolvement = MakeTransformer<Involvement>(
  (involvement, filter) => {
    const ret: Involvement = {
      dates: filter.dates
        ? FilterDateRange(involvement.dates, filter.dates)
        : involvement.dates,
      title: involvement.title,
    };
    if (involvement.short) ret.short = involvement.short;
    if (involvement.description) {
      if (filter.description === undefined)
        ret.description = involvement.description;
      else
        ret.description = TransformString(
          involvement.description,
          filter.description
        );
    }
    if (involvement.accomplishments) {
      if (filter.accomplishments === undefined)
        ret.accomplishments = involvement.accomplishments;
      else
        ret.accomplishments = TransformStrings(
          involvement.accomplishments,
          filter.accomplishments
        );
    }
    if (involvement.properties) {
      if (filter.properties === undefined)
        ret.properties = involvement.properties;
      else
        ret.properties = TransformProperties(
          involvement.properties,
          filter.properties
        );
    }
    if (involvement.lists) {
      if (filter.lists === undefined) ret.lists = involvement.lists;
      else ret.lists = TransformSublistings(involvement.lists, filter.lists);
    }

    return ret;
  }
);

export const TransformInvolvements = MakeListTransformer<Involvement>(
  TransformInvolvement,
  TestInvolvement
);

export const TransformProperty = MakeTransformer<InvolvementProperty>(
  (prop, xform) => ({
    name: prop.name,
    value: xform.value ? TransformString(prop.value, xform.value) : prop.value,
  })
);

export const TransformProperties = MakeListTransformer<InvolvementProperty>(
  TransformProperty,
  TestProperty
);

export const TransformSublisting = MakeTransformer<InvolvementSublisting>(
  (list, xform) => ({
    name: list.name,
    list:
      xform.list === undefined
        ? list.list
        : TransformStrings(list.list, xform.list),
  })
);

export const TransformSublistings = MakeListTransformer<InvolvementSublisting>(
  TransformSublisting,
  TestSublisting
);

export const TransformString = MakeTransformer<string>((str, xform) => {
  if (typeof xform.as === "string") {
    return xform.as;
  } else if (typeof xform.as === "undefined") {
    return str;
  } else {
    return xform.as(str);
  }
});

export const TransformStrings = MakeListTransformer<string>(
  TransformString,
  TestString
);

export function FilterDateRange(
  range: DateRange,
  filter: DateRangeTransform
): DateRange {
  if (filter.start === false) {
    if (!range.end)
      throw new Error("Filtering to only end, but Range has no end.");
    if (filter.end === true) {
      return { start: range.end, end: range.end };
    }
    if (filter.end) {
      const e = FilterApproximateDate(
        range.end,
        filter.end as ApproximateDateTransform
      );
      return { start: e, end: e };
    }
    throw new Error("bad call");
  }

  const start =
    filter.start === true || filter.start === undefined
      ? range.start
      : FilterApproximateDate(range.start, filter.start);

  const end =
    filter.end === false
      ? range.start
      : range.end &&
        (filter.end === true || filter.end === undefined
          ? range.end
          : FilterApproximateDate(range.end, filter.end));

  return { start, end };
}

export function FilterApproximateDate(
  date: ApproximateDate,
  filter: ApproximateDateTransform
): ApproximateDate {
  const ret: ApproximateDate = { year: date.year };
  if (filter.day !== false && date.day) ret.day = date.day;
  if (filter.month !== false && date.month) ret.month = date.month;
  return ret;
}

export function InvolvementsByTag(
  categories: Category[],
  tags: string | string[]
): {
  involvement: Involvement;
  entity: EntityInvolvements;
  category: Category;
}[] {
  const exploded = categories.flatMap((c) =>
    c.entities.flatMap((e) =>
      e.involvements
        .filter((i) => i.tags && i.tags.length > 0)
        .map((i) => ({ involvement: i, entity: e, category: c }))
    )
  );

  if (typeof tags === "string") {
    return exploded.filter(
      (e) => (e.involvement.tags || []).indexOf(tags) >= 0
    );
  }

  // eh, just do the O(n^2) for now, easier
  return exploded.filter((e) =>
    (e.involvement.tags || []).some((tag) => tags.indexOf(tag) >= 0)
  );

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
