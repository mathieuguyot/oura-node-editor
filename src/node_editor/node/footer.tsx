import React, { useContext } from "react";
import { NodeModel } from "../model";
import { ThemeContext } from "../theme";

export type FooterProps = {
    node: NodeModel;
};

export default function Footer({node}: FooterProps): JSX.Element {
    const { theme } = useContext(ThemeContext);

    return <div className="node-background node-footer" style={{...theme?.node?.footer, ...node?.theme?.footer}} />;
}
