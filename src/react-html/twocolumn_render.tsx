"use strict";

import { ApproximateDate, DateRange, DatesAreEqual, Resume, Category, EntityInvolvements, SortEntitiesDescending } from "../core/resume";
import { TransformCategories, SelectCategory, All, None } from "../core/transform";
import { RenderApproxDate, RenderDateRange, RenderYearRange } from "../render/render";
import { Transform } from "../data/EyasResumeTransform"
import React = require("react");

export class Static extends React.Component<{resume: Resume}, any> {
    render() {
        var resume = this.props.resume;
        return <html lang="en">
        <head>
          <title>{resume.person.name} &ndash; Resume</title>
          <meta charSet="utf-8" />
          <link rel="stylesheet" type="text/css" href="./css/resume.css" />
          <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
          <link rel="stylesheet" href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,600italic,400italic,300italic,700,700italic' type='text/css' />
        </head>
        <body>
          <TwoColumn resume={resume} />
        </body>
        </html>;
      }
}

class InvolvementRender extends React.Component<{ entity: EntityInvolvements }, any> {
  render() {
    var entity = this.props.entity;

    return <div className="entity">
              <div className="entityTitle">
                <h2>{entity.entity}</h2>
                {entity.location && <div className="location">{entity.location}</div>}
              </div>
              {entity.entityDescription && <p>{entity.entityDescription}</p>}
              {
                entity.involvements.map(involvement => <div className="involvement" key={RenderDateRange(involvement.dates)}>
                  <div className="involvementTitle">
                    <h3>{involvement.title}</h3>
                    <div className="date">{RenderDateRange(involvement.dates)}</div>
                  </div>
                  {involvement.description && <p>{involvement.description}</p>}
                  {involvement.properties && <p className="properties">{involvement.properties.map(
                    prop => <span key={prop.name}><strong>{prop.name}</strong>:&nbsp;{prop.url ? <a href={prop.url} target="_blank">{prop.value}</a> : prop.value} </span>
                  )}</p>}
                  {involvement.accomplishments
                    && involvement.accomplishments.length > 0
                    && (<ul>{involvement.accomplishments.map(acc => (<li key={acc}>{acc}</li>))}</ul>)}
                </div>)
              }
          </div>;
  }
}
class CategoryRender extends React.Component<{category: Category}, any> {
  render() {
    var category = this.props.category;
    return <section className="category">
             <h1>{category.name}</h1>
             {category.entities.map(entity => <InvolvementRender entity={entity} key={entity.entity} />)}
           </section>
  }
}

export class TwoColumn extends React.Component<{ resume: Resume }, any> {
    render() {
      var resume = this.props.resume;
      resume.categories.forEach(category => SortEntitiesDescending(category.entities));
      var person = resume.person;

      {
        const main_categories = TransformCategories(
            resume.categories,
            Transform.categories
        );
        var education = SelectCategory(main_categories, "Education");
        let more_experience = SelectCategory(main_categories, "Education Experience");
        education.entities = education.entities.concat(more_experience.entities);

        var experience = SelectCategory(main_categories, "Experience");

        var volunteer_highlights = SelectCategory(main_categories, "Volunteer");
      }

      function Subtract(selected: Category, full: Category) {
        const full_exp = 
          full.entities.flatMap(e => e.involvements.map(inv =>
            ({ entity: e.short || e.entity, title: inv.title, dates: inv.dates})));
        const selected_exp = 
          selected.entities.flatMap(e => e.involvements.map(inv =>
            ({ entity: e.short || e.entity, title: inv.title})));
        var remaining = full_exp.filter(o_item => !selected_exp.some(t_item => t_item.entity === o_item.entity && t_item.title === o_item.title));
        return remaining;
      }

      var grouped = Subtract(experience, SelectCategory(resume.categories, "Industry Experience"))
        .groupBy(item => `${item.title} at ${item.entity}`);
      var other_experience = Object.getOwnPropertyNames(grouped).map(title => ({ title: title, years: grouped[title].map(item=>item.dates.start.year) }))

      var other_volunteer = Subtract(volunteer_highlights, SelectCategory(resume.categories, "Volunteer"));

      var listing_obj = education.entities.flatMap(ent => ent.involvements).flatMap(inv => inv.lists).groupByFlatMap((g => g.name), (l => l.list));
      var education_listings = Object.getOwnPropertyNames(listing_obj).map(k => ({name: k, list: listing_obj[k]})).filter(x => x.list.length > 0);

      return <div className="resume">
          <header>
            <div className="person">
              <span className="name">{person.name}</span>
              {person.links.github && <a href={"https://github.com/" + person.links.github} className="identity"><i className="fa fa-github" />@{person.links.github}</a>}
              {person.links.stackOverflow && <a href={"http://stackoverflow.com/users/" + person.links.stackOverflow[0] + "/" + person.links.stackOverflow[1]} className="identity"><i className="fa fa-stack-overflow"/>{person.links.stackOverflow[1]}</a> }
            </div>
            <div className="info">
              <span>{person.address.mailing}</span>
              <span>{person.phone.mobile || person.phone.home || person.phone.work}</span>
              <span>{person.email.personal || person.email.work}</span>
            </div>
          </header>
          <div className="content">
            <article><CategoryRender category={experience} key={experience.name} /></article>
            <aside>
              <h3>Skills</h3>
              <p>
                {
                  resume.skills.map(skill => <span key={skill.name}>
                    <strong>{skill.name}</strong>: {skill.skills.map(sk => <span className="skill" key={sk}>{sk}</span>)}
                  </span>)
                }
              </p>
              <h3>Other Experience</h3>
              <ul>{other_experience.map(exp => <li key={exp.title}><strong>{exp.title}</strong> ({exp.years.join(' & ')})</li>)}</ul>
            </aside>
          </div>
          <div className="content">
            <article><CategoryRender category={education} key={education.name}/></article>
            <aside>
              {
                education_listings.map(list =>
                  <div key={list.name}>
                    <h3>{list.name}</h3>
                    <ul>
                      {list.list.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>)
              }
              {
              //   recognitions.map(recog => <div>
              //       <h3>{recog.name}</h3>
              //       <ul>
              //       {recog.recognitions.map(r => <li>&lsquo;{Pad(r.date.year % 100, 2)}:&nbsp;{r.description}</li>)}
              //       </ul>
              //     </div>)
              }
            </aside>
          </div>
          <div className="content">
            <article><CategoryRender category={volunteer_highlights} key={volunteer_highlights.name}/></article>
            <aside>
              <h3>Other Volunteering</h3>
              <ul>{other_volunteer.map(v => <li key={v.entity}>{v.title} at {v.entity}{v.dates.end && ` (${RenderYearRange(v.dates)})`}</li>)}</ul>
            </aside>
          </div>
      </div>;
    }
}
