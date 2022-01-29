import "./App.css";

import { Resume, ResumeData } from "@eyassh/resume";
import "@eyassh/resume/css/resume.css";
import type { FC } from "react";

const Head: FC = ({ children }) => <head>{children}</head>;
const Body: FC = ({ children }) => <body>{children}</body>;

function App() {
  return <Resume resume={ResumeData} Head={Head} Body={Body} />;
}

export default App;
