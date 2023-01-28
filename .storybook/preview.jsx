import React from "react";

import SvgRarityGradientDefs from "../src/components/SvgRarityGradientDefs";

import "../src/layouts/Layout.css";
import "../src/global-styles.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <>
      <Story />
      <SvgRarityGradientDefs />
    </>
  ),
];
