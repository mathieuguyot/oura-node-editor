import React from "react";
import produce from "immer";

import { MenuItemProps } from "./common";
import MenuItemList from "./menu_item_list";

export type BasicContextualMenuProps = {
    menuTitle: string;
    items: { [id: string]: MenuItemProps[] };
};

export const BasicContextualMenu = (props: BasicContextualMenuProps): JSX.Element => {
    const { menuTitle, items } = props;

    const [searchText, setSearchText] = React.useState<string>("");

    const onChange = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
    }, []);

    const filteredItems = produce(items, (draft) => {
        Object.keys(items).forEach((id) => {
            const newItems = draft[id].filter(
                (item) => searchText === "" || item.name.toLowerCase().includes(searchText)
            );
            if (newItems.length === 0) {
                delete draft[id];
            } else {
                draft[id] = newItems as any;
            }
        });
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
            <div className="one-font-bold">{menuTitle}</div>
            <input
                className="one-input one-w-full one-max-w-xs one-input-xs focus:one-outline-0"
                style={{ borderRadius: 0 }}
                value={searchText}
                onChange={onChange}
                placeholder="filter on node name"
            />
            <MenuItemList items={filteredItems} />
        </div>
    );
};
