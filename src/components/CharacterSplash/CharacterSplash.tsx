import { Tab } from "@headlessui/react";
import { useStore } from "@nanostores/react";

import * as classes from "./styles.css";
import { operatorStore } from "../../pages/operators/_store";
import { operatorSplash } from "../../utils/images";

import type { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

interface Props {
  avatarPictures: { [skinId: string]: GetPictureResult };
}

const CharacterSplash: React.FC<Props> = ({ avatarPictures }) => {
  const { skins, voices } = useStore(operatorStore);

  return (
    <Tab.Group as="div" className={classes.container}>
      <Tab.List className={classes.tabList}>
        {skins.map((skin) => {
          const pictureData = avatarPictures[skin.skinId];
          return (
            <Tab
              id={`${skin.skinId}-button`}
              className={classes.tabIcon}
              key={skin.skinId}
            >
              <picture>
                {pictureData.sources.map(({ srcset: srcSet, type }, i) => (
                  <source key={i} srcSet={srcSet} type={type} />
                ))}
                {/* @ts-expect-error mismatch between astro-jsx & react-jsx types */}
                <img
                  className={classes.tabIconImage}
                  {...pictureData.image}
                  loading="lazy"
                />
              </picture>
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        {skins.map((skin) => {
          return (
            <Tab.Panel
              id={`${skin.skinId}-tabpanel`}
              className={classes.tabPanel}
              key={skin.skinId}
            >
              {/* TODO: This image causes layout shift of the label when loading.
                  Change to Astro native images / provide height */}
              <img
                className={classes.tabPanelImage}
                src={operatorSplash(skin.portraitId)}
                alt=""
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
