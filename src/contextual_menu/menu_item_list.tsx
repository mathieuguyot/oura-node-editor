import React from "react";
import { MenuItemProps } from "./common";

const MenuItem = (props: MenuItemProps): JSX.Element => {
    const { name, onClick, onMouseEnter, onMouseLeave } = props;
    return (
        <li onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {name}
        </li>
    );
};

type MenuItemListProps = {
    items: { [id: string]: [MenuItemProps] };
};

const MenuItemList = (props: MenuItemListProps): JSX.Element => {
    const { items } = props;
    return (
        <ul
            className="menu menu-compact bg-base-300 w-56 p-2"
            style={{ height: 452, flexWrap: "initial", overflow: "scroll" }}
        >
            {Object.keys(items).map((categoryName) => {
                return (
                    <div key={categoryName}>
                        <li className="menu-title">
                            <span>{categoryName}</span>
                        </li>
                        {items[categoryName].map((item) => (
                            <MenuItem
                                name={item.name}
                                onClick={item.onClick}
                                onMouseEnter={item.onMouseEnter}
                                onMouseLeave={item.onMouseLeave}
                                key={item.name}
                            />
                        ))}
                    </div>
                );
            })}
        </ul>
    );
};

export default MenuItemList;
