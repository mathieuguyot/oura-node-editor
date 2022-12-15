import React from "react";
import produce from "immer";

import { MenuItemProps } from "./common";
import MenuItemList from "./menu_item_list";

export type BasicContextualMenuProps = {
    menuTitle: string;
    items: { [id: string]: MenuItemProps };
};

export const BasicContextualMenu = (props: BasicContextualMenuProps): JSX.Element => {
    const { menuTitle, items } = props;

    const [searchText, setSearchText] = React.useState<string>("");

    const onChange = React.useCallback(
        (event: React.FormEvent<HTMLInputElement>) => {
            setSearchText(event.currentTarget.value);
        },
        [searchText]
    );

    const filteredItems = produce(items, (draft) => {
        Object.keys(items).forEach((id) => {
            const name = items[id].name.toLowerCase();
            const lcSearchText = searchText.toLowerCase();
            if (searchText !== "" && !name.includes(lcSearchText)) {
                delete draft[id];
            }
        });
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
            {menuTitle}
            <br />
            <input value={searchText} onChange={onChange} placeholder="Filter options" />
            <MenuItemList items={filteredItems} />
        </div>
    );
};
