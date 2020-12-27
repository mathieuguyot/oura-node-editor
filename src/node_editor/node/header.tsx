import React, { useContext } from "react";
import { NodeModel } from "..";
import { ThemeContext } from "../theme";

export type HeaderProps = {
    node: NodeModel;
    onMouseDown: (event: React.MouseEvent) => void;
};

export default function Header(props: HeaderProps): JSX.Element {
    const { node, onMouseDown } = props;
    const { theme } = useContext(ThemeContext);

    return (
        <div style={theme.node?.header} onMouseDown={onMouseDown}>
            {node.name}
        </div>
    );
}
