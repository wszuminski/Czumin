import RadialOrbitalTimeline from "../components/ui/radial-orb";
import { caseStudies } from "../data/case-studies";

export function RadialCaseStudy() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={caseStudies} />
    </>
  );
}

export default {
  RadialCaseStudy,
};
