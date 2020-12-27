import { createContext } from "react";
import CSS from "csstype";

import { PanZoomModel } from "../model";
import darkTheme from "./dark";
import { Theme } from "./theme";

type ThemeContextType = {
    theme: Theme;
    buildBackgroundStyle: (panZoomInfo: PanZoomModel) => CSS.Properties;
};

const ThemeContext = createContext<ThemeContextType>(darkTheme);

export type { ThemeContextType, Theme };
export { ThemeContext, darkTheme };
