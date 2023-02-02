import { Tab } from "@headlessui/react";
import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { operatorStore } from "../../pages/operators/_store";
import Picture from "../Picture";

import type { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

interface Props {
  pictureDataMap: {
    [skinId: string]: {
      avatar: GetPictureResult;
      fullart: GetPictureResult;
    };
  };
}

const CharacterSplash: React.FC<Props> = ({ pictureDataMap }) => {
  const { skins, voices } = useStore(operatorStore);

  return (
    <Tab.Group as="div" className={classes.container}>
      <Tab.List className={classes.tabList}>
        {skins.map((skin) => {
          const avatarPictureData = pictureDataMap[skin.skinId].avatar;
          return (
            <Tab
              id={`${skin.skinId}-button`}
              className={classes.tabIcon}
              key={skin.skinId}
            >
              <Picture
                pictureData={avatarPictureData}
                className={classes.tabIconImage}
              />
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        {skins.map((skin) => {
          const fullartPictureData = pictureDataMap[skin.skinId].fullart;
          return (
            <Tab.Panel
              id={`${skin.skinId}-tabpanel`}
              className={classes.tabPanel}
              key={skin.skinId}
            >
              <Picture
                pictureData={fullartPictureData}
                className={classes.tabPanelImage}
              />
              <div className={classes.operatorInfo}>
                <div className={classes.operatorInfoLabelContainer}>
                  <span className={classes.operatorInfoLabelTitle}>Artist</span>
                  {skin.displaySkin.drawerList.join(", ")}
                </div>
                <div className={classes.operatorInfoLabelContainer}>
                  <span className={classes.operatorInfoLabelTitle}>VA</span>
                  <ul className={classes.operatorInfoVoiceList}>
                    {voices.map((voice) => (
                      <li key={voice.voiceLangType}>
                        {voice.cvName.join(", ")}
                      </li>
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
