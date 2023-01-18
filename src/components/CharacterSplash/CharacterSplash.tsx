import { Tab } from "@headlessui/react";
import { useStore } from "@nanostores/react";

import { operatorSplash, operatorSplashAvatar } from "../../utils/images";
import { operatorStore } from "../../pages/operators/_store";

import * as classes from "./styles.css";

const CharacterSplash: React.FC = () => {
  const { skins, voices } = useStore(operatorStore);

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
