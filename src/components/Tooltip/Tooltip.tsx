import Tippy from "@tippyjs/react";

import { themeName } from "./styles.css";

import "tippy.js/dist/tippy.css";

import type { TippyProps } from "@tippyjs/react";

const Tooltip: React.FC<TippyProps> = ({ children, theme, ...rest }) => {
  // attempting to SSR this causes `astro build` to explode
  // we don't actually care about SSRing a tooltip, so just return null in this case
  if (typeof window === "undefined") {
    return null;
  }

  return (
    // offset: 8px is the height of the tooltip arrow, then spacing(0.5) is 4px
    <Tippy
      theme={theme ?? themeName}
      offset={[0, 8 + 4]}
      duration={[250, 250]}
      {...rest}
    >
      {children}
    </Tippy>
  );
};
export default Tooltip;
