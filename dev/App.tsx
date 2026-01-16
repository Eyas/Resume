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
  return (
    <div>
      <h1>Component Playground</h1>
      <Resume resume={ResumeData} Head={Head} Body={Body} />
    </div>
  );
}

export default App;
