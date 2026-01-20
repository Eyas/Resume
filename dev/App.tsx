import { Resume, ResumeData } from "@";
import "@css/resume.css";
import { PropsWithChildren } from "react";

function Head({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function Body({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function App() {
  return <Resume resume={ResumeData} Head={Head} Body={Body} />;
}

export default App;
