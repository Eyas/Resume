"use strict";

import { ApproximateDate, DateRange, DatesAreEqual, Resume, Category, EntityInvolvements, SortEntitiesDescending } from "../core/resume";
import { RenderApproxDate, RenderDateRange } from "../render/render";
import React = require("react");

export class Static extends React.Component<Resume, any> {
  private cv: CurriculumVitae;
  private name: string;
  constructor (resume: Resume) {
    super();
    this.cv = new CurriculumVitae(resume);
    this.name = resume.person.name;
  }
  render() {
    var self = this;
    return <html>
    <head>
      <title>{self.name} &ndash; Curriculum Vitae</title>
      <meta content="text/html;charset=utf-8" http-equiv="Content-Type"/>
      <meta charSet="utf-8" />
      <link rel="stylesheet" type="text/css" href="./css/cv.css" />
      <link rel="stylesheet" href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,600italic,400italic,300italic,700,700italic' type='text/css' />
    </head>
    <body>
    {self.cv.render()}
    </body>
    </html>;
  }
}

export class CurriculumVitae extends React.Component<Resume, any> {
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
    return <div className="resume">
        <header>
          <div className="title">Curriculum Vitae</div>
          <div className="name">{resume.person.name}</div>
          {resume.person.email.personal && <div className="contact">{resume.person.email.personal}</div>}
          {resume.person.email.work && <div className="contact">{resume.person.email.work}</div>}
        </header>
        {
          resume.categories.map(category =>
            <section className="category">
              <h1>{category.name}</h1>
              {
                category.entities.map(entity => <div className="entity">
                  <h2>{entity.entity}</h2>
                  <div className="info">
                    {entity.location && <div className="location"><span>{entity.location}</span></div>}
                    {entity.entityDescription && <p className="description">{entity.entityDescription}</p>}
                  </div>
                  {
                    entity.involvements.map(involvement => <div className="involvement">
                      <h3>{involvement.title}</h3>
                      <div className="involvementDate"><span>{RenderDateRange(involvement.dates)}</span></div>
                      {involvement.description && <p>{involvement.description}</p>}
                      {involvement.properties && <p className="properties">{involvement.properties.map(
                        prop => <span><strong>{prop.name}</strong>:&nbsp; {prop.value}</span>
                      )}</p>}
                      {involvement.accomplishments && (<ul>{involvement.accomplishments.map(acc => (<li>{acc}</li>))}</ul>)}
                      {
                        involvement.lists &&
                        <div className="listings">{involvement.lists.map(
                          list => <div className="listing">
                            <h4>{list.name}</h4>
                            <ul>{list.list.map(i => <li>{i}</li>)}</ul>
                          </div>
                        )}</div>
                      }
                    </div>)
                  }
              </div>)
              }
            </section>
          )
        }
        <h1>Skills</h1>
        <p>
          {
            resume.skills.map(skill => <span>
              <strong>{skill.name}</strong>:&nbsp;{skill.skills.map(sk => <span className="skill">{sk}</span>)}
            </span>)
          }
        </p>
        {
          resume.recognitions.map(recog => <div>
              <h1>{recog.name}</h1>
              <ul>
              {recog.recognitions.map(r => <li>{RenderApproxDate(r.date)}:&nbsp;{r.description}{r.more ? ', ' + r.more : ''}</li>)}
              </ul>
            </div>)
        }
        <h1>Biographical Information</h1>
        <table className='biography'>
        {resume.person.biography.birth.place ? (<tr><th>Place of Birth</th><td>{resume.person.biography.birth.place}</td></tr>) : ''}
        {resume.person.biography.birth.date ? (<tr><th>Date of Birth</th><td>{resume.person.biography.birth.date.toDateString()}</td></tr>) : ''}
        {resume.person.biography.gender ? (<tr><th>Gender</th><td>{resume.person.biography.gender}</td></tr>) : ''}
        {resume.person.biography.pronouns ? (<tr><th>Preferred Pronouns</th><td>{resume.person.biography.pronouns}</td></tr>) : ''}
        {resume.person.biography.nationality ? (<tr><th>Nationality</th><td>{resume.person.biography.nationality}</td></tr>) : ''}
        {resume.person.address.mailing ? (<tr><th>Mailing Address</th><td>{resume.person.address.mailing}</td></tr>) : ''}
        {resume.person.phone.home ? (<tr><th>Home</th><td>{resume.person.phone.home}</td></tr>) : ''}
        {resume.person.phone.mobile ? (<tr><th>Mobile</th><td>{resume.person.phone.mobile}</td></tr>) : ''}
        {resume.person.phone.work ? (<tr><th>Work</th><td>{resume.person.phone.work}</td></tr>) : ''}
        </table>
    </div>;
  }
}