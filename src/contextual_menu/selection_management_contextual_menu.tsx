import React from "react";

import { MenuItemProps } from "./common";
import { BasicContextualMenu } from "./basic_contextual_menu";

export type SelectionManagementContextualMenuProps = {
    onMouseHover: (isMouseHover: boolean) => void;
    onDeleteSelection: () => void;
};

export const SelectionManagementContextualMenu = (
    props: SelectionManagementContextualMenuProps
): JSX.Element => {
    const { onMouseHover, onDeleteSelection } = props;

    const items: { [id: string]: MenuItemProps[] } = {};
    items.actions = [
        {
            name: "Delete selection",
            onClick: () => {
                onDeleteSelection();
            }
        }
    ];

    const onMouseEnter = React.useCallback(() => {
        onMouseHover(true);
    }, [onMouseHover]);

    const onMouseLeaves = React.useCallback(() => {
        onMouseHover(false);
    }, [onMouseHover]);

    return (
        <div onMouseLeave={onMouseLeaves} onMouseEnter={onMouseEnter}>
            <BasicContextualMenu menuTitle="Selection management" items={items} />
        </div>
    );
};
