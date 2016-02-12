"use strict";

import { ApproximateDate, DateRange, DatesAreEqual, Resume, Category, EntityInvolvements, SortEntitiesDescending } from "../core/resume";
import { TransformCategories, All, None } from "../core/transform";
import { RenderApproxDate, RenderDateRange } from "../render/render";
import { Transform } from "../data/EyasResumeTransform"
import React = require("react");

// credit: stackoverflow.com/a/10073788/864313
function Pad(n: number, width: number, char?: string): string {
    char = (char && char[0]) || '0';
    var strn = '' + n;
    return strn.length > width ? strn : (new Array(width - strn.length + 1).join(char) + strn);
}

export class Static extends React.Component<Resume, any> {
    private tc: TwoColumn;
    private name: string;
    constructor (resume: Resume) {
        super();
        this.tc = new TwoColumn(resume);
        this.name = resume.person.name;
    }
    render() {
        var self = this;
        return <html>
        <head>
          <title>{self.name} &ndash; Resume</title>
          <meta content="text/html;charset=utf-8" http-equiv="Content-Type"/>
          <link rel="stylesheet" type="text/css" href="./css/resume.css" />
          <link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" />
        </head>
        <body>
        {self.tc.render()}
        </body>
        </html>;
      }
  }

export class TwoColumn extends React.Component<Resume, any> {
    private resume: Resume;
    constructor (resume: Resume) {
        super();
        var self = this;
        resume.categories.forEach(category => SortEntitiesDescending(category.entities));

        this.resume = resume;
    }
    render() {
        var self = this;
        var resume = this.resume;
        var person = this.resume.person;

        var recognitions = this.resume.recognitions;
        var v2 = TransformCategories(
            this.resume.categories,
            {
                sequence: [
                    {
                        item: "Volunteer",
                        entities: {
                            filter: All,
                            involvements: { sequence: [ { item: All /* selects first */ } ]}
                        }
                    }
                ]
            }
      );
      var volunteer = v2[0].entities.flatMap(ei => ei.involvements.map(inv => (ei.short || ei.entity) + " " + inv.title));

      var main_categories = TransformCategories(
          this.resume.categories,
          Transform.categories
      );

      var listing_obj = main_categories.flatMap(cat => cat.entities).flatMap(ent => ent.involvements).flatMap(inv => inv.lists).groupByFlatMap((g => g.name), (l => l.list));
      var listings = Object.getOwnPropertyNames(listing_obj).map(k => ({name: k, list: listing_obj[k]})).filter(x => x.list.length > 0);

      return <div className="resume">
          <header>
            <div>
              <span className="name">{person.name}</span>
              <span className="tagline">{person.biography.tagline}</span>
            </div>
            <div className="info">
              <span>{person.address.mailing}</span>
              <span>{person.phone.mobile || person.phone.home || person.phone.work}</span>
              <span>{person.email.personal || person.email.work}</span>
            </div>
          </header>
          <div className="content">
            <article>{
              main_categories.filter(category => category.name !== "Volunteer" /* volunteer section separate */).map(category =>
                <section className="category">
                  <h1>{category.name}</h1>
                  {
                    category.entities.map(entity => <div className="entity">
                      <div className="entityTitle">
                        <h2>{entity.entity}</h2>
                        {entity.location && <div className="location">{entity.location}</div>}
                      </div>
                      {entity.entityDescription && <p>{entity.entityDescription}</p>}
                      {
                        entity.involvements.map(involvement => <div className="involvement">
                          <div className="involvementTitle">
                            <h3>{involvement.title}</h3>
                            <div className="date">{RenderDateRange(involvement.dates)}</div>
                          </div>
                          {involvement.description && <p>{involvement.description}</p>}
                          {involvement.properties && <p className="properties">{involvement.properties.map(
                            prop => <span><strong>{prop.name}</strong>:&nbsp;{prop.value} </span>
                          )}</p>}
                          {involvement.accomplishments && (<ul>{involvement.accomplishments.map(acc => (<li>{acc}</li>))}</ul>)}
                        </div>)
                      }
                  </div>)
                  }
                </section>
              )
            }</article>
            <aside>
            {
                (person.links.github || person.links.stackOverflow)
                ?
                  <div className="identities">
                    <h3>Find me online</h3>
                    <p>
                    {person.links.github && <a href={"https://github.com/" + person.links.github}><i className="fa fa-github" />@{person.links.github}</a>}
                    {person.links.stackOverflow && <a href={"http://stackoverflow.com/users/" + person.links.stackOverflow[0] + "/" + person.links.stackOverflow[1]}><i className="fa fa-stack-overflow"/>{person.links.stackOverflow[1]}</a> }
                    </p>
                  </div>
                : ""
            }
            {
              listings.map(list =>
                <div>
                  <h3>{list.name}</h3>
                  <ul>
                    {list.list.map(item => <li>{item}</li>)}
                  </ul>
                </div>)
            }
            <h3>Volunteer Activities</h3>
            <ul>
            {
              volunteer.map(v => <li>{v}</li>)
            }
            </ul>
            {
              recognitions.map(recog => <div>
                  <h3>{recog.name}</h3>
                  <ul>
                  {recog.recognitions.map(r => <li>&lsquo;{Pad(r.date.year % 100, 2)}:&nbsp;{r.description}</li>)}
                  </ul>
                </div>)
            }
            <h3>Skills</h3>
            <p>
              {
                resume.skills.map(skill => <span>
                  <strong>{skill.name}</strong>: {skill.skills.map(sk => <span className="skill">{sk}</span>)}
                </span>)
              }
            </p>
            </aside>
          </div>
      </div>;
    }
}
