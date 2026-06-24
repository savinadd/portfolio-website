import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { EducationSection } from "./sections/EducationSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { WorkSection } from "./sections/WorkSection";
import { WritingSection } from "./sections/WritingSection";

type WebsiteViewProps = {
  onTerminal: () => void;
};

export function WebsiteView({ onTerminal }: WebsiteViewProps) {
  return (
    <main className="website">
      <nav>
        <strong>savina</strong>
        <button type="button" onClick={onTerminal}>
          terminal
        </button>
      </nav>

      <header>
        <h1>Hi, I'm Savina.</h1>
        <p>I build thoughtful software and simple, useful experiences.</p>
      </header>

      <div className="website-sections">
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <EducationSection />
        <WritingSection />
        <ContactSection />
      </div>
    </main>
  );
}
