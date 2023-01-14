import { Tab } from "@headlessui/react";
import * as classes from "./styles.css";

import type * as OutputTypes from "../../output-types";
import { operatorSplash, operatorSplashAvatar } from "../../utils/images";
export interface CharacterSplashProps {
  characterObject: OutputTypes.Character;
}

const CharacterSplash: React.FC<CharacterSplashProps> = ({
  characterObject,
}) => {
  const { skins, voices } = characterObject;

  return (
    <Tab.Group as={"div"} className={classes.container}>
      <Tab.List className={classes.tabList}>
        {skins.map((skin) => {
          return (
            <Tab className={classes.tabIcon} key={skin.skinId}>
              <img
                className={classes.tabIconImage}
                src={operatorSplashAvatar(skin.avatarId)}
                alt="" // TODO this actually needs alt text (elite 0/1/2 or skin name)
              />
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        {skins.map((skin) => {
          return (
            <Tab.Panel className={classes.tabPanel} key={skin.skinId}>
              <img
                className={classes.tabPanelImage}
                src={operatorSplash(skin.portraitId)}
                alt=""
              />
              <div className={classes.operatorInfo}>
                <div className={classes.operatorInfoLabelContainer}>
                  <span className={classes.operatorInfoLabelTitle}>Artist</span>
                  {skin.displaySkin.drawerName}
                </div>
                <div className={classes.operatorInfoLabelContainer}>
                  <span className={classes.operatorInfoLabelTitle}>VA</span>
                  <ul className={classes.operatorInfoVoiceList}>
                    {voices.map((voice) => (
                      <li key={voice.voiceLangType}>{voice.cvName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tab.Panel>
          );
        })}
      </Tab.Panels>
    </Tab.Group>
  );
};
export default CharacterSplash;
