import { Resume, MakeDate } from "../core/resume";

export const EyasResume: Resume = {
  person: {
    name: "Eyas Sharaiha",
    phone: {},
    email: {
      personal: "eyas@alum.mit.edu",
    },
    address: {},
    links: {
      github: "Eyas",
      stackOverflow: [864313, "eyassh"],
      personal: "https://eyas.sh",
    },
    biography: {
      birth: {
        place: "Amman, Jordan",
      },
      pronouns: "He/Him/His",
      nationality: ["Jordanian"],
      //tagline: "Software Engineer, Tech Enthusiast"
    },
  },
  categories: [
    {
      name: "Education",
      entities: [
        {
          entity: "Massachusetts Institute of Technology",
          short: "MIT",
          url: "https://web.mit.edu/",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: {
                start: MakeDate(2009, 8),
                end: MakeDate(2013, 6),
              },
              title: "Bachelor of Science in Computer Science & Engineering",
              properties: [
                { name: "Major GPA", value: "5.0/5.0" },
                { name: "GPA", value: "4.9/5.0" },
              ],
              lists: [
                {
                  name: "Highlighted Coursework",
                  list: [
                    "Artificial Intelligence",
                    "Automata, Computability, and Complexity",
                    "Computation Structures",
                    "Computer Systems Engineering",
                    "Computer Language Engineering",
                    "Digital Communication Systems",
                    "Distributed Systems",
                    "Design & Analysis of Algorithms",
                    "Elements of Software Construction",
                    "Making Video Games",
                    "Multicore Programming",
                    "Operating System Engineering",
                    "User Interface Design",
                  ],
                },
                {
                  name: "Membership",
                  list: [
                    "St. Anthony Hall (Delta Psi Co-Ed Fraternity; locally known as The Number Six Club)",
                    "National Society of Collegiate Scholars",
                    "Phi Beta Kappa Society",
                    "Tau Beta Pi Engineering Society",
                    "Eta Kappa Nu ECE Society",
                    "MIT Mobile Apps Competition",
                  ],
                },
              ],
            },
            {
              dates: {
                start: MakeDate(2013, 6),
                end: MakeDate(2014, 6),
              },
              title:
                "Master of Engineering in Electrical Engineering & Computer Science",
              properties: [
                {
                  name: "Thesis",
                  value:
                    "Enhancing the Classroom Experience with Faculty Curated Discussions",
                  url: "https://dspace.mit.edu/handle/1721.1/91453",
                },
                { name: "Concentration", value: "Computer Systems" },
                { name: "GPA", value: "5.0/5.0" },
              ],
            },
          ],
        },
        {
          entity: "Amman National School",
          location: "Amman, Jordan",
          involvements: [
            {
              dates: { start: MakeDate(2009, 6), end: MakeDate(2009, 6) },
              title: "International Baccalaureate Bilingual Diploma (IBDP)",
              properties: [
                {
                  name: "Senior Thesis in Physics",
                  value:
                    "Study of the Experimental Methods of the Determination of the Coefficient of Viscosity of Glycerin",
                },
                { name: "IBDP Score", value: "44/45" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Industry Experience",
      entities: [
        {
          entity: "Google LLC",
          short: "Google",
          url: "https://google.com/",
          location: "New York, NY",
          involvements: [
            {
              dates: { start: MakeDate(2017, 7) },
              title: "Software Engineer",
            },
          ],
        },
        {
          entity: "Broadway Technology",
          location: "New York, NY",
          involvements: [
            {
              dates: { start: MakeDate(2014, 7), end: MakeDate(2017, 7) },
              title: "Software Developer",
              description: `Built high-performance loosely-coupled distributed systems on a 7-engineer team. Developed
 server-side components connecting sell-side banks to their clients.`,
              accomplishments: [
                `Lead technical direction for a 3 developer initiative to consolidate two major families of
 components across asset classes. Implemented required changes for unified quoting libraries.`,
                `Designed and built a randomized test client for venue connectors over the FIX protocol. Load tests
 and performs state explorations of server-side components. These explorations can either follow a
 naive uniform distribution, or modeled by an NFA with user-defined state graphs and probabilities.`,
                `Designed and implemented a time-series analysis component monitoring system and business health.
 Computes configurable sliding-window measurements on arbitrary data. A single instance handles up
 to 100K incoming events/sec.`,
              ],
            },
          ],
        },
        {
          entity: "Microsoft Corporation",
          short: "Microsoft",
          location: "Redmond, WA",
          involvements: [
            {
              dates: { start: MakeDate(2013, 6), end: MakeDate(2013, 8) },
              title: "Software Development Engineer Intern",
              accomplishments: [
                "Built support for real-time collaborative editing in Word Online by developing inter-paragraph text merge strategies.",
              ],
            },
            {
              dates: { start: MakeDate(2012, 6), end: MakeDate(2012, 8) },
              title: "Software Development Engineer Intern",
              accomplishments: [
                "Extended OneNote Online to support editing, viewing, and collaborating across securely encrypted, password-protected sections.",
              ],
            },
          ],
        },
        {
          entity: "Google, Inc",
          short: "Google",
          location: "New York, NY",
          involvements: [
            {
              dates: { start: MakeDate(2011, 6), end: MakeDate(2011, 8) },
              title: "Software Engineer Intern",
              accomplishments: [
                "Built tools to facilitate event-driven programming for internal software; built load-testing framework for internal message bus; ran performance trials.",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Education Experience",
      entities: [
        {
          entity: "MIT 6.170: Software Studio",
          short: "MIT 6.170",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: { start: MakeDate(2013, 8), end: MakeDate(2014, 1) },
              title: "Graduate Teaching Assistant",
              short: "Teaching Assistant",
              accomplishments: [
                "One of 5 graduate teaching assistants for a class of 125 students, where students learn web development, with a focus on JavaScript and Rails.",
                "Lead planning and logistics, which involved managing scheduling, locations, office hours, and recitations.",
                "Taught recitation sections, tutored students in lab hours, and mentored student teams of 3-4 students in final project consultations.",
              ],
            },
          ],
        },
        {
          entity: "MIT CSAIL Laboratory: Haystack Group",
          short: "CSAIL",
          location: "Cambridge, MA",
          entityDescription:
            "Working on NB, an online social discussion-based annotation tool for education.",
          involvements: [
            {
              dates: { start: MakeDate(2014, 1), end: MakeDate(2014, 5) },
              title: "Graduate Researcher",
              short: "Researcher",
              accomplishments: [
                "Studied impact of NB annotations on course materials on collaborative learning.",
                "Created tools to find impactful online discussions in online annotation conversations.",
                "Introduced tools allowing instructors to reuse impactful across class offerings.",
              ],
            },
            {
              dates: { start: MakeDate(2012, 9), end: MakeDate(2013, 7) },
              title: "MIT EECS Google Research and Innovation Fellow",
              short: "Researcher",
              accomplishments: [
                "Added support for annotations and discussions on static HTML documents to NB.",
              ],
            },
          ],
        },
        {
          entity: "6.570 MIT Mobile Apps Competition",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: { start: MakeDate(2012, 1), end: MakeDate(2012, 1) },
              title: "Co-Organizer, Co-Founder",
              accomplishments: [
                "Organized MIT's inaugural Mobile Apps Competition during MIT's IAP period in January.",
                "Forty-two students competed in 16 teams to create Android Mobile Applications, and competed for awards judged by professionals from 14 industry sponsors.",
              ],
            },
          ],
        },
        {
          entity:
            "MIT Arab Student Organization: College Admissions Arab Mentorship Program",
          location: "Amman, Jordan",
          involvements: [
            {
              dates: { start: MakeDate(2010, 1), end: MakeDate(2010, 1) },
              title: "Regional Mentor & Speaker",
              accomplishments: [
                "Organized workshops and presentations at 10 schools in Amman, Jordan on applying for universities in the United States, with special emphasis on MIT, targeted at Arab students.",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Volunteer",
      entities: [
        {
          entity: "iMentor",
          url: "https://imentor.org/",
          location: "New York, NY",
          involvements: [
            {
              dates: { start: MakeDate(2017, 10), end: MakeDate(2018, 6) },
              title: "Mentor",
              description:
                "Working with a high school student through their college journey.",
            },
          ],
        },
        {
          entity: "DevProgress",
          involvements: [
            {
              dates: { start: MakeDate(2016, 9), end: MakeDate(2016, 11, 9) },
              title: "Developer",
              description:
                "Built sites and tools to help progressive candidates and causes.",
              accomplishments: [
                `Maintained and managed contributions for a static Jekyll website dispelling fake news rumors
 and discussing common concerns related to Hillary Clinton.`,
                `Launched site within two weeks of starting the initiative.`,
                `Translated UX designer slides into accessible, responsive, and scalable template.`,
              ],
            },
          ],
        },
        {
          entity: "Girls Who Code",
          involvements: [
            {
              dates: { start: MakeDate(2016, 1), end: MakeDate(2016, 6) },
              title: "Club Instructor",
              tags: ["highlight"],
              description:
                "Teaching middle school girls programming using Scratch and Python at a school club.",
            },
          ],
        },
        {
          entity: "Massachusetts Institute of Technology",
          short: "MIT",
          involvements: [
            {
              dates: { start: MakeDate(2013, 6) },
              title: "Educational Counselor",
              tags: ["highlight"],
              description:
                "Recruiting, acting as a community resource, and interviewing candidates for the MIT freshman class.",
            },
          ],
        },
        {
          entity: "St. Anthony Association of Boston",
          short: "SAAB (MIT)",
          involvements: [
            {
              dates: { start: MakeDate(2013, 4) },
              title: "Director",
              description:
                "Serving on the board of the house-owning alumni organization for the Number Six Club, an independent living group and co-ed literary fraternity at MIT.",
            },
          ],
        },
        {
          entity: "Seeds of Peace",
          entityDescription:
            "International, U.S.-based non-profit organization aimed to promote peace coexistence in the Middle East through a dialogue program.",
          involvements: [
            {
              dates: { start: MakeDate(2005), end: MakeDate(2005) },
              title: "Camper",
            },
            {
              dates: { start: MakeDate(2007), end: MakeDate(2007) },
              title: "Peer Support Leader",
            },
            {
              dates: { start: MakeDate(2007), end: MakeDate(2010) },
              title: "Regional Contributor",
              accomplishments: [
                "Assisted in organizing, scheduling, and preparing materials for annual camper orientation",
                "Assisted in preparing and conducting talks and presentations to local membership",
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Side Projects",
      entities: [
        {
          entity: "Open Source Personal Projects",
          involvements: [
            {
              dates: { start: MakeDate(2016), end: MakeDate(2016) },
              title: "Developer",
              description:
                "JSON-based resume schema, transformation, and generation.",
              url: "https://github.com/Eyas/Resume",
              tags: ["project"],
            },
            {
              dates: { start: MakeDate(2015), end: MakeDate(2016) },
              title: "Developer",
              description:
                "C# libraries for polymorphic types, memoization, logging, and more.",
              url: "https://github.com/Eyas/Ibra",
              tags: ["project"],
            },
            {
              dates: { start: MakeDate(2016), end: MakeDate(2016) },
              title: "Developer",
              description: "Monadic observables in JS.",
              url: "https://github.com/Eyas/RamzLib",
              tags: ["project"],
            },
          ],
        },
        {
          entity: "MarkUp Game Development Magazine",
          location: "Amman, Jordan",
          involvements: [
            {
              dates: { start: MakeDate(2007, 2), end: MakeDate(2008, 7) },
              title: "Founder & Sr. Editor",
              accomplishments: [
                "Started, wrote in, and edited a game development magazine aimed at the more technical members of the Game Maker community.",
                "The project peaked towards its end to include ~15 regular writers, other individual contributors, 300 regular subscribers, and a monthly readership of more than 3,000.",
              ],
              tags: ["project"],
            },
          ],
        },
        {
          entity: "GMPedia.org (Later YoYo Games Wiki)",
          entityDescription:
            "Initially an independent Game Development Wiki serving different online development communities. Merged with YoYo Games Ltd. to become the primary resources for Independent Developers using YoYo Games' GameMaker software.",
          involvements: [
            {
              dates: { start: MakeDate(2007), end: MakeDate(2008) },
              title: "Founder, Administrator, and Senior Editor of GMPedia.org",
            },
            {
              dates: { start: MakeDate(2008), end: MakeDate(2009) },
              title: "Administrator at YoYo Games Wiki",
            },
          ],
        },
      ],
    },
    {
      name: "Other Experiences",
      entities: [
        {
          entity: "The Number Six Club",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: { start: MakeDate(2011, 1), end: MakeDate(2012, 8) },
              title: "Co-President/House Manager",
              accomplishments: [
                "Elected to this post in a Co-ed Fraternity at MIT. Organized residential duties, represented members to MIT, managed contracts, oversaw maintenance and reparations, and other projects.",
              ],
            },
            {
              dates: { start: MakeDate(2012, 9), end: MakeDate(2013, 1) },
              title: "Lead Undergraduate Organizer for National Convention",
              accomplishments: [
                "Was one of three lead organizing undergraduates, along with two alumni members to plan and execute the 2013 Grand Chapter Convention of the St. Anthony Hall National Fraternity. The event took place on January 18-20, 2013 in Cambridge, MA where we hosted 250 guests from around the country.",
              ],
            },
            {
              dates: { start: MakeDate(2010, 2), end: MakeDate(2013, 12) },
              title: "Webmaster",
              accomplishments: [
                "Rewrote the website for an MIT student group of 50 Active Members to adapt to the modern web.",
                "Created Member Directory database and interface, which now powers site contact page, alumni information, mass event invitations for alumni, and automates officer tasks.",
              ],
            },
          ],
        },
        {
          entity: "GAMBIT: MIT-Singapore Game Development Lab",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: { start: MakeDate(2009, 9), end: MakeDate(2009, 12) },
              title: "Developer",
              accomplishments: [
                "Built online database and applicant management interface to handle Summer Applicants for GAMBIT, transitioning from manual data management to web-based database.",
              ],
            },
          ],
        },
        {
          entity: "Massachusetts Institute of Technology Student Activities",
          location: "Cambridge, MA",
          involvements: [
            {
              dates: { start: MakeDate(2012, 3), end: MakeDate(2012, 12) },
              title: "Living Group Council (LGC) Speaker",
              accomplishments: [
                "Served as the representative of MIT's six Independent Living Groups to the MIT Administration, the Undergraduate Association, and the Alumni Association for Fraternities, Sororities, and Independent Living Groups. Organized and ran meetings of LGC representatives, increase LGC recognition and visibility on campus, and participated in the revitalization of the council in 2012.",
              ],
            },
            {
              dates: { start: MakeDate(2010), end: MakeDate(2012) },
              title: "MIT Model United Nations Conference Chair & Secretariat",
              accomplishments: [
                "Contributed to the MITMUNC in 2010 as an Assistant Committee Chair; in 2011 as a Head Chair; in 2012 as a Crisis Director.",
                "MITMUNC is annually attended by 250-500 students from around the world.",
              ],
            },
          ],
        },
      ],
    },
  ],
  skills: [
    {
      name: "Programming",
      skills: [
        "C++",
        "TypeScript",
        "C#",
        "Scala",
        "JavaScript",
        "Java",
        "Go",
        "Python",
        "PHP",
      ],
    },
    { name: "Web", skills: ["Angular", "HTML", "CSS"] },
    { name: "Other", skills: ["SQL", "GameMaker"] },
    { name: "Language", skills: ["Arabic (Native)", "English (Fluent)"] },
  ],
  recognitions: [
    {
      name: "Awards and Recognitions",
      recognitions: [
        {
          date: MakeDate(2012),
          description: "MIT Frederick Gardiner Fassett, Jr. Award",
          more: "given to three \u201Cindividual [...] of FSILG Community who [have] most unselfishly demonstrated the qualities of spirit, dedication, and service in furthering the ideals of MIT brotherhood and sisterhood.\u201D",
        },
        {
          date: MakeDate(2011),
          description:
            "MIT Web Programming Competition (6.470), Honorable mention for use of social media",
        },
        {
          date: MakeDate(2005),
          description:
            "FIRST-Lego League Robotics Competition, First Place in Jordan",
        },
        {
          date: MakeDate(2004),
          description:
            "Bronze medal in Int. Junior Science Olympiad in Jakarta, Indonesia",
        },
      ],
    },
  ],
};
