import RadialOrbitalTimeline from "../components/ui/radial-orb";
import { caseStudies } from "../data/case-studies";

export function RadialCaseStudy() {
  return (
    <>
    <div id="case-study">
      <RadialOrbitalTimeline timelineData={caseStudies}  />
      </div>
    </>
  );
}

export default {
  RadialCaseStudy,
};
