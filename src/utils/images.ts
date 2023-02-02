import itemsJson from "../../data/items.json";

import type * as OutputTypes from "./../output-types";

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
    `../../arknights-images/assets/arts/charportraits/${filename}.png`
  );
}

const baseAvatars = import.meta.glob(
  "../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/*.png"
);
const eliteAvatars = import.meta.glob(
  "../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/elite/*.png"
);
const skinAvatars = import.meta.glob(
  "../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/skins/*.png"
);
export function importOperatorAvatar(
  skin: OutputTypes.Skin
): Promise<{ default: ImageMetadata }> {
  const { avatarId, type } = skin;
  const filename = avatarId.replace("#", "__");
  let lazyAvatarImport;
  switch (type) {
    case "elite-zero":
      lazyAvatarImport =
        baseAvatars[
          `../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/${filename}.png`
        ] ??
        eliteAvatars[
          `../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/elite/${filename}.png`
        ];
      break;
    case "elite-one-or-two":
      lazyAvatarImport =
        eliteAvatars[
          `../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/elite/${filename}.png`
        ] ??
        baseAvatars[
          `../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/${filename}.png`
        ];
      break;
    case "skin":
      lazyAvatarImport =
        skinAvatars[
          `../../arknights-images/assets/torappu/dynamicassets/arts/charavatars/skins/${filename}.png`
        ];
      break;
  }
  if (lazyAvatarImport == null) {
    throw new Error("Couldn't locate file for avatarId: " + avatarId);
  }
  return lazyAvatarImport() as Promise<{ default: ImageMetadata }>;
}

export function importOperatorFullart(
  skin: OutputTypes.Skin
): Promise<{ default: ImageMetadata }> {
  const { portraitId, type } = skin;
  const filename = portraitId.replace("#", "__");
  if (type === "skin") {
    return import(`../../arknights-images/assets/skinpack/${filename}.png`);
  }
  return import(`../../arknights-images/assets/chararts/${filename}.png`);
}
