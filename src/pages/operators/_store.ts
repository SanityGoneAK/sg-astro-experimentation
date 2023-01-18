import { atom, computed } from "nanostores";

import operatorsJson from "../../../data/operators.json";

import type * as OutputTypes from "../../output-types";

export const operatorIdStore = atom<string>(
  typeof window !== "undefined" ? (window as any).operatorId : ""
);

export const operatorStore = computed(
  operatorIdStore,
  (operatorId) =>
    operatorsJson[
      operatorId as keyof typeof operatorsJson
    ] as OutputTypes.Character
);

export const summonsStore = atom<OutputTypes.Character[] | undefined>(
  typeof window !== "undefined" ? (window as any).summons : undefined
);
