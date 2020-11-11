import React from "react";
import { MenuItemProps } from "./common";

const MenuItem = (props: MenuItemProps): JSX.Element => {
    const { name, description, onClick, onMouseEnter, onMouseLeave } = props;
    return (
        <div onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {name}
            <br />
            {description}
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
                        description={item.description}
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
