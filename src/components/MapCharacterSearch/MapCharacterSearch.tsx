import { useState, useMemo } from "react";

import { Combobox, Dialog } from "@headlessui/react";

import * as classes from "./styles.css";
import { store as searchStore } from "../../../data/search.json";
import {
  addOperator,
  characterSearchModalStore,
  closeModal,
  operatorStore,
} from "../../pages/maps/_store";
import operatorsJson from "../../../data/operators.json";

import type { OperatorSearchResult } from "../SearchBar";
import { useStore } from "@nanostores/react";
import { operatorAvatar, operatorClassIcon } from "../../utils/images";

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
  const isOpen = useStore(characterSearchModalStore);

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
    addOperator(operatorsJson[option.charId as keyof typeof operatorsJson]);
    // operatorIdsStore.set([...new Set(operatorIdsStore.get()), option.charId]);
  };

  return (
    <Dialog open={isOpen} onClose={() => closeModal()}>
      <div className={classes.modalBackDrop}> </div>

      <div className={classes.modalDialog}>
        <Dialog.Panel className={classes.modalPanel}>
          <div>
            <Combobox<OperatorSearchResult>>
              {({ open, activeOption }) => (
                <>
                  <Combobox.Input
                    className={classes.input}
                    value={filterString}
                    onChange={(e) => setFilterString(e.target.value)}
                  />
                  <div className={classes.classButtonGroup}>
                    {Object.keys(OperatorClass).map((opClass) => {
                      return (
                        <button
                          className={classes.classButton}
                          key={opClass}
                          aria-pressed={opClass === filterClass}
                          onClick={() =>
                            setFilterClass(opClass as OperatorClass)
                          }
                        >
                          <img
                            src={operatorClassIcon(opClass.toLowerCase())}
                            alt={opClass}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <Combobox.Options
                    static
                    className={classes.operatorResultList}
                  >
                    {options.slice(0, 5).map((option) => {
                      return (
                        <Combobox.Option
                          className={classes.operatorResultOption}
                          key={option.charId}
                          value={option}
                          onClick={() => handleOptionSelected(option)}
                        >
                          <img
                            className={classes.operatorResultImage}
                            src={operatorAvatar(option.charId)}
                            alt=""
                          />
                          {option.name}
                        </Combobox.Option>
                      );
                    })}
                  </Combobox.Options>
                </>
              )}
            </Combobox>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
export default MapCharacterSearch;
