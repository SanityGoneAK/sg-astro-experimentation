import { useState, useMemo } from "react";

import { Combobox } from "@headlessui/react";

import { store as searchStore } from "../../../data/search.json";
import { operatorStore } from "../../pages/maps/_store";
import * as classes from "./styles.css";
import type { OperatorSearchResult } from "../SearchBar";

enum OperatorClass {
  Vanguard = "Vanguard",
  Guard = "Guard",
  Defender = "Defender",
  Sniper = "Sniper",
  Caster = "Caster",
  Medic = "Medic",
  Supporter = "Supporter",
  Specialist = "Specialist",
}

const operatorSearchResults = Object.values(searchStore).filter(
  ({ type }) => type === "operator"
) as OperatorSearchResult[];

const MapCharacterSearch: React.FC = () => {
  const [filterClass, setFilterClass] = useState<OperatorClass | null>(null);
  const [filterString, setFilterString] = useState("");
  const options = useMemo(
    () =>
      operatorSearchResults.filter((opRes) => {
        return (
          opRes.name.toLowerCase().startsWith(filterString.toLowerCase()) &&
          (!filterClass || opRes.class === filterClass)
        );
      }),
    [filterClass, filterString]
  );

  const handleOptionSelected = (option: OperatorSearchResult) => {
    // operatorIdsStore.set([...new Set(operatorIdsStore.get()), option.charId]);
  };

  return (
    <div className={classes.root}>
      <div>
        {Object.keys(OperatorClass).map((opClass) => {
          return (
            <button
              key={opClass}
              aria-pressed={opClass === filterClass}
              onClick={() => setFilterClass(opClass as OperatorClass)}
            >
              {opClass}
            </button>
          );
        })}
      </div>
      <Combobox<OperatorSearchResult>>
        {({ open, activeOption }) => (
          <>
            <Combobox.Input
              value={filterString}
              onChange={(e) => setFilterString(e.target.value)}
            />
            <Combobox.Options static>
              {options.map((option) => {
                return (
                  <Combobox.Option
                    key={option.charId}
                    value={option}
                    onClick={() => handleOptionSelected(option)}
                  >
                    {option.name}
                  </Combobox.Option>
                );
              })}
            </Combobox.Options>
          </>
        )}
      </Combobox>
    </div>
  );
};
export default MapCharacterSearch;
