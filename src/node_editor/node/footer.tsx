import React, { useContext } from "react";
import { ThemeContext } from "../theme";

export default function Footer(): JSX.Element {
    const { theme } = useContext(ThemeContext);

    return <div className="node-background node-footer" style={theme?.node?.footer} />;
}
