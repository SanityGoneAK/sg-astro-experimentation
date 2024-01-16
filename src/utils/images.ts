import itemsJson from "../../data/items.json";

const baseURL = "https://penguacestergonenemypresslabdbdare.stinggy.com";

export const operatorAvatar = (charId: string, elite?: number): string => {
  const basePath = `${baseURL}/torappu/dynamicassets/arts/charavatars/${charId}`;
  if (charId === "char_002_amiya" && elite === 1) {
    return `${basePath}_1+.webp`;
  } else if (elite === 2) {
    return `${basePath}_2.webp`;
  }
  return `${basePath}.webp`;
};
export const operatorSplash = (
  portraitId: string,
  skinType: string
): string => {
  if (skinType === "skin") {
    return `${baseURL}/skinpack/${encodeURIComponent(portraitId)}.webp`;
  }
  return `${baseURL}/chararts/${encodeURIComponent(portraitId)}.webp`;
};

export const operatorSplashAvatar = (
  avatarId: string,
  skinType: string
): string => {
  if (skinType === "skin") {
    return `${baseURL}/torappu/dynamicassets/arts/charavatars/skins/${encodeURIComponent(
      avatarId
    )}.webp`;
  }
  if (skinType === "elite-one-or-two") {
    return `${baseURL}/torappu/dynamicassets/arts/charavatars/elite/${encodeURIComponent(
      avatarId
    )}.webp`;
  }
  return `${baseURL}/torappu/dynamicassets/arts/charavatars/${encodeURIComponent(
    avatarId
  )}.webp`;
};

export const enemyAvatar = (enemyId: string): string => {
  return `${baseURL}/enemy/${encodeURIComponent(enemyId)}.webp`;
};

export const summonImage = (id: string): string => `/images/avatars/${id}.webp`;

export const tokenImage = (id: string): string =>
  `${baseURL}/torappu/dynamicassets/arts/charavatars/${id}.webp`;

export const operatorClassIcon = (operatorClass: string): string =>
  `${baseURL}/arts/icon_profession_${operatorClass.toLocaleLowerCase()}_large.webp`;

export const operatorBranchIcon = (subProfessionId: string): string =>
  `${baseURL}/torappu/dynamicassets/arts/ui/subprofessionicon/sub_${subProfessionId}_icon.webp`;

export const skillIcon = (iconId: string | null, skillId: string): string =>
  `${baseURL}/skills/skill_icon_${iconId ?? skillId}.webp`;

export const moduleImage = (moduleId: string): string =>
  `${baseURL}/equip/icon/${moduleId}.webp`;

export const moduleTypeImage = (moduleType: string): string =>
  `${baseURL}/equip/type/${moduleType}.webp`;

export const itemImage = (itemId: string): string =>
  `${baseURL}/torappu/dynamicassets/arts/items/icons/${
    itemsJson[itemId as keyof typeof itemsJson].iconId
  }.webp`;

export const riicSkillIcon = (riicSkillIcon: string): string =>
  `${baseURL}/torappu/dynamicassets/arts/building/skills/${riicSkillIcon}.webp`;

export const operatorPortrait = (operatorId: string): string => {
  const filename =
    operatorId === "char_1001_amiya2"
      ? "char_1001_amiya2_2"
      : `${operatorId}_1`;
  return `${baseURL}/arts/charportraits/${filename}.webp`;
};
