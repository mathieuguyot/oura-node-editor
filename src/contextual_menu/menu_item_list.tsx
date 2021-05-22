import React from "react";
import { MenuItemProps } from "./common";

const MenuItem = (props: MenuItemProps): JSX.Element => {
    const { name, onClick, onMouseEnter, onMouseLeave } = props;
    return (
        <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {name}
        </div>
    );
};

type MenuItemListProps = {
    items: { [id: string]: MenuItemProps };
};

const MenuItemList = (props: MenuItemListProps): JSX.Element => {
    const { items } = props;
    return (
        <>
            {Object.keys(items).map((key) => {
                const item = items[key];
                return (
                    <MenuItem
                        name={item.name}
                        onClick={item.onClick}
                        onMouseEnter={item.onMouseEnter}
                        onMouseLeave={item.onMouseLeave}
                        key={key}
                    />
                );
            })}
        </>
    );
};

export default MenuItemList;
