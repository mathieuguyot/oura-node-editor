import React, { useContext } from "react";
import { NodeModel } from "..";
import { ThemeContext } from "../theme";

export type HeaderProps = {
    node: NodeModel;
};

export default function Header({ node }: HeaderProps): JSX.Element {
    const { theme } = useContext(ThemeContext);

    return (
        <div
            className="node-background node-header one-bg-primary one-font-bold"
            style={{ ...theme.node?.header, ...node.theme?.header }}
        >
            {node.name}
        </div>
    );
}
