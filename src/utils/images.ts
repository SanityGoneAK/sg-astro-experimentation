import itemsJson from "../../data/items.json";

const baseURL = "http://penguacestergonenemypresslabdbdare.stinggy.com";

export const operatorAvatar = (charId: string, elite?: number): string => {
  const basePath = `${baseURL}/avatars/${charId}`;
  if (charId === "char_002_amiya" && elite === 1) {
    return `${basePath}_1+.png`;
  } else if (elite === 2) {
    return `${basePath}_2.png`;
  }
  return `${basePath}.png`;
};
export const operatorSplash = (portraitId: string): string => {
  return `${baseURL}/characters/${encodeURIComponent(portraitId)}.png`;
};

export const operatorSplashAvatar = (avatarId: string): string => {
  return `${baseURL}/avatars/${encodeURIComponent(avatarId)}.png`;
};

export const summonImage = (id: string): string => `/images/avatars/${id}.png`;

export const operatorClassIcon = (operatorClass: string): string =>
  `${baseURL}/classes/class_${operatorClass}.png`;

export const operatorBranchIcon = (subProfessionId: string): string =>
  `${baseURL}/ui/subclass/sub_${subProfessionId}_icon.png`;

export const skillIcon = (iconId: string | null, skillId: string): string =>
  `${baseURL}/skills/skill_icon_${iconId ?? skillId}.png`;

export const moduleImage = (moduleId: string): string =>
  `${baseURL}/equip/icon/${moduleId}.png`;

export const moduleTypeImage = (moduleType: string): string =>
  `${baseURL}/equip/type/${moduleType}.png`;

export const itemImage = (itemId: string): string =>
  `${baseURL}/items/${itemsJson[itemId as keyof typeof itemsJson].iconId}.png`;

export const riicSkillIcon = (riicSkillIcon: string): string =>
  `https://github.com/astral4/arkdata/raw/main/assets/torappu/dynamicassets/arts/building/skills/${riicSkillIcon}.png`;

export function importOperatorPortrait(
  operatorId: string
): Promise<{ default: ImageMetadata }> {
  const filename =
    operatorId === "char_1001_amiya2"
      ? "char_1001_amiya2_2"
      : `${operatorId}_1`;
  return import(
    `../../../arknights-images/assets/arts/charportraits/${filename}.png`
  );
}
