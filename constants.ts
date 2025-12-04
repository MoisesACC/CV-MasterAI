import { ExperienceLevel } from "./types";

export const APP_NAME = "CV Master ATS";

export const EXPERIENCE_LEVELS = [
  { value: ExperienceLevel.JUNIOR, label: "Junior (0-2 años)" },
  { value: ExperienceLevel.MID, label: "Semi-Senior (3-5 años)" },
  { value: ExperienceLevel.SENIOR, label: "Senior (5-8 años)" },
  { value: ExperienceLevel.EXECUTIVE, label: "Ejecutivo (+10 años)" },
];

export const MOCK_ANALYSIS_DELAY = 2000;
