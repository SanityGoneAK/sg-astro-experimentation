import axios from "./axios";

import { fixJetSkillDescriptionTags } from "./fix-jet-skill-descs";

const jetroyzSkillsTranslationsUrl =
  "https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/ace/tl-skills.json";
const jetroyzTalentsTranslationsUrl =
  "https://raw.githubusercontent.com/Aceship/AN-EN-Tags/master/json/ace/tl-talents.json";

interface SkillTranslations {
  [skillId: string]: {
    name: string;
    /** indexed by rank; up to length 10 (where last 3 are masteries) */
    desc: string[];
  };
}

interface TalentTranslations {
  /**
   * outer array is indexed by talent slot;
   * inner array is phaseIndex (`talents[i].candidates` in character_table)
   */
  [operatorId: string]: Array<
    Array<{
      name: string;
      desc: string;
    }>
  >;
}

/**
 * Fetches Jetroyz's unofficial (is it really unofficial if he works for Yostar?) CN -> EN translations
 * for skills and talents from the Aceship repo hosted on GitHub.
 */
export async function fetchJetroyzSkillTalentTranslations() {
  const jetTalentTranslations = (
    await axios.get<TalentTranslations>(jetroyzTalentsTranslationsUrl)
  ).data;
  const rawSkillsTranslations = (
    await axios.get<SkillTranslations>(jetroyzSkillsTranslationsUrl)
  ).data;
  const jetSkillTranslations: SkillTranslations = Object.fromEntries(
    Object.entries(rawSkillsTranslations).map(
      ([skillId, { name, desc: rawDescriptions }]) => [
        skillId,
        {
          name,
          desc: rawDescriptions.map((rawDesc) =>
            fixJetSkillDescriptionTags(rawDesc)
          ),
        },
      ]
    )
  );

  return {
    jetSkillTranslations,
    jetTalentTranslations,
  };
}
