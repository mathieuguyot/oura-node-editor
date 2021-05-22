import React, { useContext } from "react";
import { NodeModel } from "..";
import { ThemeContext } from "../theme";

export type HeaderProps = {
    node: NodeModel;
};

export default function Header(props: HeaderProps): JSX.Element {
    const { node } = props;
    const { theme } = useContext(ThemeContext);

    return (
        <div className="node-background node-header" style={theme.node?.header}>
            {node.name}
        </div>
    );
}
