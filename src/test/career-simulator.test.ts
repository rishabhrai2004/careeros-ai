import { describe, expect, it } from "vitest";

import { simulateCareerTransition } from "@/lib/career-simulator";

describe("career simulator", () => {
  it("returns target-role-specific skills for Data Scientist", () => {
    const result = simulateCareerTransition({
      currentRole: "Software Engineer",
      targetRole: "Data Scientist",
      yearsExperience: 3,
      country: "United Kingdom",
      currentSkills: ["Java", "HTML"],
    });

    expect(result.requiredSkills).toEqual([
      "Python",
      "Machine Learning",
      "Statistics",
      "Data Visualization",
      "SQL",
      "Pandas",
      "Scikit-learn",
    ]);
    expect(result.requiredSkills).not.toContain("React");
    expect(result.requiredSkills).not.toContain("System Design");
  });

  it("computes a clear skill gap from current skills", () => {
    const result = simulateCareerTransition({
      currentRole: "Software Engineer",
      targetRole: "Data Scientist",
      yearsExperience: 2,
      country: "United Kingdom",
      currentSkills: ["Java", "HTML"],
    });

    expect(result.matchedSkills).toEqual([]);
    expect(result.missingSkills).toEqual([
      "Python",
      "Machine Learning",
      "Statistics",
      "Data Visualization",
      "SQL",
      "Pandas",
      "Scikit-learn",
    ]);
    expect(result.skillMatchPercentage).toBe(0);
  });

  it("raises transition probability when overlap and experience improve", () => {
    const lowFit = simulateCareerTransition({
      currentRole: "Customer Support Specialist",
      targetRole: "Data Scientist",
      yearsExperience: 1,
      country: "United Kingdom",
      currentSkills: ["Communication", "Excel"],
    });

    const highFit = simulateCareerTransition({
      currentRole: "Data Analyst",
      targetRole: "Data Scientist",
      yearsExperience: 4,
      country: "United Kingdom",
      currentSkills: ["Python", "SQL", "Statistics", "Pandas", "Data Visualization"],
    });

    expect(highFit.transitionProbability).toBeGreaterThan(lowFit.transitionProbability);
    expect(highFit.skillMatchPercentage).toBeGreaterThan(lowFit.skillMatchPercentage);
  });

  it("estimates salary by target role, country, and experience", () => {
    const entry = simulateCareerTransition({
      currentRole: "Data Analyst",
      targetRole: "Data Scientist",
      yearsExperience: 1,
      country: "United Kingdom",
      currentSkills: ["Python", "SQL"],
    });

    const mid = simulateCareerTransition({
      currentRole: "Data Analyst",
      targetRole: "Data Scientist",
      yearsExperience: 4,
      country: "United Kingdom",
      currentSkills: ["Python", "SQL", "Statistics"],
    });

    expect(entry.estimatedSalary.country).toBe("United Kingdom");
    expect(entry.estimatedSalary.currency).toBe("GBP");
    expect(entry.estimatedSalary.experienceLevel).toBe("Entry level");
    expect(mid.estimatedSalary.experienceLevel).toBe("Mid level");
    expect(mid.estimatedSalary.min).toBeGreaterThan(entry.estimatedSalary.min);
    expect(mid.estimatedSalary.max).toBeGreaterThan(entry.estimatedSalary.max);
  });
});
