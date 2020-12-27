import React, { useContext } from "react";
import { NodeModel } from "..";
import { ThemeContext } from "../theme";

export type FooterProps = {
    node: NodeModel;
    onMouseDown: (event: React.MouseEvent) => void;
};

export default function Footer(props: FooterProps): JSX.Element {
    const { onMouseDown } = props;
    const { theme } = useContext(ThemeContext);

    return <div style={theme?.node?.footer} onMouseDown={onMouseDown} />;
}
