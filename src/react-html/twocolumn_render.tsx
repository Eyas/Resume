import {
  Resume,
  Category,
  EntityInvolvements,
  Involvement,
  SortEntitiesDescending,
} from "../core/resume";
import {
  TransformCategories,
  SelectCategory,
  InvolvementsByTag,
} from "../core/transform";
import {
  RenderDateRange,
  RenderYearRange,
  RenderUrlText,
} from "../render/render";
import { Transform } from "../data/EyasResumeTransform";
import "../core/extensions";

import * as React from "react";
import { collate, group } from "../core/extensions";

function assert<T>(input: T | undefined): T {
  if (!input) throw new Error("'undefined' unexpected.");
  return input;
}

function Subtract(selected: Category, full: Category) {
  const full_exp = full.entities.flatMap((e) =>
    e.involvements.map((inv) => ({
      entity: e.short || e.entity,
      title: inv.title,
      dates: inv.dates,
    }))
  );
  const selected_exp = selected.entities.flatMap((e) =>
    e.involvements.map((inv) => ({
      entity: e.short || e.entity,
      title: inv.title,
    }))
  );
  const remaining = full_exp.filter(
    (o_item) =>
      !selected_exp.some(
        (t_item) =>
          t_item.entity === o_item.entity && t_item.title === o_item.title
      )
  );
  return remaining;
}

export const Static: React.FC<{
  resume: Resume;
  Head: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
}> = ({ resume, Head, Body }) => {
  return (
    <>
      <Head>
        <title>{resume.person.name} &ndash; Resume</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={`Resume for ${resume.person.name}`} />
        <link rel="stylesheet" type="text/css" href="./css/resume.css" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,600italic,400italic,300italic,700,700italic"
          type="text/css"
        />
      </Head>
      <Body>
        <TwoColumn resume={resume} />
      </Body>
    </>
  );
};

const InvolvementRender: React.FC<{
  involvement: Involvement;
}> = ({ involvement }) => {
  return (
    <div className="involvement">
      <div className="involvementTitle">
        <h3>{involvement.title}</h3>
        <div className="date">{RenderDateRange(involvement.dates)}</div>
      </div>
      {involvement.description && <p>{involvement.description}</p>}
      {involvement.properties && (
        <p className="properties">
          {involvement.properties.map((prop) => (
            <span key={prop.name}>
              <strong>{prop.name}</strong>:&nbsp;
              {prop.url ? (
                <a href={prop.url} target="_blank">
                  {prop.value}
                </a>
              ) : (
                prop.value
              )}{" "}
            </span>
          ))}
        </p>
      )}
      {involvement.accomplishments && involvement.accomplishments.length > 0 && (
        <ul>
          {involvement.accomplishments.map((acc) => (
            <li key={acc}>{acc}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const EntityRender: React.FC<{ entity: EntityInvolvements }> = ({ entity }) => {
  return (
    <div className="entity">
      <div className="entityTitle">
        <h2>{entity.entity}</h2>
        {entity.location && <div className="location">{entity.location}</div>}
      </div>
      {entity.entityDescription && <p>{entity.entityDescription}</p>}
      {entity.involvements.map((involvement) => (
        <InvolvementRender
          involvement={involvement}
          key={involvement.title + "_" + RenderDateRange(involvement.dates)}
        />
      ))}
    </div>
  );
};

const CategoryRender: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <section className="category">
      <h1>{category.name}</h1>
      {category.entities.map((entity, idx) => (
        <EntityRender entity={entity} key={entity.entity + "_" + idx} />
      ))}
    </section>
  );
};

const MiniCategory: React.FC<{ category: Category }> = ({ category }) => {
  const grouped = group(
    category.entities
      .map((invs) =>
        invs.involvements.map((inv) => ({
          entity: invs.short || invs.entity,
          title: inv.short || inv.title,
          dates: inv.dates,
        }))
      )
      .flat(),
    (item) => `${item.title} at ${item.entity}`
  );

  const exp_list = Object.getOwnPropertyNames(grouped).map((title) => ({
    title,
    dates: grouped[title].map((i) => i.dates),
  }));

  return (
    <section className="mini-category">
      <h3>{category.name}</h3>
      <ul>
        {exp_list.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong> (
            {item.dates.map(RenderYearRange).join(" & ")})
          </li>
        ))}
      </ul>
    </section>
  );
};

export const TwoColumn: React.FC<{ resume: Resume }> = ({ resume }) => {
  resume.categories.forEach((category) =>
    SortEntitiesDescending(category.entities)
  );
  const person = resume.person;

  const main_categories = TransformCategories(
    resume.categories,
    Transform.categories
  );

  const education = assert(SelectCategory(main_categories, "Education"));
  const experience = assert(SelectCategory(main_categories, "Experience"));
  const volunteer_highlights = assert(
    SelectCategory(main_categories, "Volunteer")
  );
  const other_volunteer = Subtract(
    volunteer_highlights,
    assert(SelectCategory(resume.categories, "Volunteer"))
  ).filter((element) => !element.dates.end || element.dates.end.year > 2009);

  let other_experience: Category;
  {
    other_experience = assert(
      SelectCategory(main_categories, "Other Experience")
    );
    const education_experience = assert(
      SelectCategory(main_categories, "Education Experience")
    );
    other_experience.entities.push(...education_experience.entities);
  }

  const listing_obj = collate(
    education.entities
      .map((ent) => ent.involvements)
      .flat()
      .map((inv) => inv.lists || [])
      .flat(),
    (g) => g.name,
    (l) => l.list
  );
  const education_listings = Object.getOwnPropertyNames(listing_obj)
    .map((k) => ({ name: k, list: listing_obj[k] }))
    .filter((x) => x.list.length > 0);

  const side_projects = InvolvementsByTag(resume.categories, "project").filter(
    (p) => p.involvement.dates.start.year >= 2015
  );

  return (
    <div className="resume">
      <header>
        <div className="person">
          <span className="name">{person.name}</span>
          {person.links.github && (
            <a
              rel="me noopener"
              href={"https://github.com/" + person.links.github}
              className="identity"
            >
              <i className="fa fa-github" />@{person.links.github}
            </a>
          )}
          {person.links.stackOverflow && (
            <a
              rel="me noopener"
              href={
                "http://stackoverflow.com/users/" +
                person.links.stackOverflow[0] +
                "/" +
                person.links.stackOverflow[1]
              }
              className="identity"
            >
              <i className="fa fa-stack-overflow" />
              {person.links.stackOverflow[1]}
            </a>
          )}
          {person.links.personal && (
            <a
              rel="me noopener"
              href={person.links.personal}
              className="identity"
            >
              <i className="fa fa-globe" />
              {person.links.personal.replace(/^http(s?):\/\//, "")}
            </a>
          )}
        </div>
        <div className="info">
          <span>{person.address.mailing}</span>
          <span>
            {person.phone.mobile || person.phone.home || person.phone.work}
          </span>
          <span>{person.email.personal || person.email.work}</span>
        </div>
      </header>
      <div className="content">
        <article>
          <CategoryRender category={experience} key={experience.name} />
        </article>
        <aside>
          <h3>Skills</h3>
          <p>
            {resume.skills.map((skill) => (
              <span key={skill.name}>
                <strong>{skill.name}</strong>:{" "}
                {skill.skills.map((sk) => (
                  <span className="skill" key={sk}>
                    {sk}
                  </span>
                ))}
              </span>
            ))}
          </p>
          <MiniCategory category={other_experience} />
          <h3>Side Projects</h3>
          <ul>
            {side_projects.map((p, idx) => (
              <li key={p.involvement.title + "_" + idx}>
                {p.involvement.description || p.involvement.title}{" "}
                {p.involvement.url && (
                  <a href={p.involvement.url}>
                    {RenderUrlText(p.involvement.url)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="content">
        <article>
          <CategoryRender category={education} key={education.name} />
        </article>
        <aside>
          {education_listings.map((list) => (
            <div key={list.name}>
              <h3>{list.name}</h3>
              <ul>
                {list.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>
      <div className="content">
        <article>
          <CategoryRender
            category={volunteer_highlights}
            key={volunteer_highlights.name}
          />
        </article>
        <aside>
          <h3>Other Volunteering</h3>
          <ul>
            {other_volunteer.map((v) => (
              <li key={v.entity + "_" + v.title}>
                {v.title} at {v.entity} ({RenderYearRange(v.dates)})
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};
