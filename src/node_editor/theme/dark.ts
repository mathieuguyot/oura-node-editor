import CSS from "csstype";

import { PanZoomModel } from "../model";
import { Theme } from "./theme";

const radius = 5;

const darkTheme: Theme = {
    node: {
        selected: {
            boxShadow: "0px 0px 0px 2px oklch(var(--pf))",
            borderRadius: `${radius}px ${radius}px ${radius}px ${radius}px`
        },
        unselected: {},
        header: {
            borderRadius: `${radius}px ${radius}px 0px 0px`,
            height: "25px",
            cursor: "grab",
            overflow: "hidden",
            paddingLeft: "10px"
        },
        body: {
            cursor: "grab"
        },
        footer: {
            borderRadius: `0px 0px ${radius}px ${radius}px`,
            height: "10px",
            cursor: "ew-resize"
        },
        basePin: {
            borderRadius: "5px 5px 5px 5px",
            cursor: "grab",
            backgroundColor: "red"
        },
        customPins: {}
    },
    link: {
        selected: {
            //stroke: "white",
            strokeWidth: "3px",
            fill: "none"
        },
        unselected: {
            //stroke: "rgba(170, 170, 170, 0.75)",
            strokeWidth: "3px",
            fill: "none"
        }
    },
    connectors: {
        leftText: {
            width: "40%",
            textOverflow: "ellipsis",
            overflow: "hidden"
        },
        string: {
            width: "100%",
            backgroundColor: "#585858",
            color: "white",
            border: 0,
            outline: "none"
        },
        number: {
            width: "60%",
            boxSizing: "border-box",
            backgroundColor: "#585858",
            color: "white",
            border: 0,
            outline: "none",
            textAlign: "right",
            borderRadius: "8px",
            paddingRight: "5px"
        },
        select: {
            width: "60%",
            backgroundColor: "#585858",
            boxSizing: "border-box",
            color: "white",
            border: 0,
            outline: "none",
            textAlign: "right",
            borderRadius: "8px",
            paddingRight: "5px"
        },
        button: {
            width: "100%",
            backgroundColor: "#585858",
            color: "white",
            border: 0,
            outline: "none"
        }
    }
};

function darkThemeBuildBackgroundStyle(panZoomInfo: PanZoomModel): CSS.Properties {
    const grid = String(50 * panZoomInfo.zoom);
    const size = 1 * panZoomInfo.zoom;
    return {
        backgroundColor: "oklch(var(--b1))",
        backgroundSize: `${grid}px ${grid}px`,
        backgroundPosition: `${panZoomInfo.topLeftCorner.x}px ${panZoomInfo.topLeftCorner.y}px`,
        //backgroundPosition: `${panZoomInfo.topLeftCorner.x}px ${panZoomInfo.topLeftCorner.y}px`,
        //backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${grid}' height='${grid}' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='black' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        //backgroundImage: `radial-gradient(#474bff ${size}px, transparent ${size}px)`
        backgroundImage: `linear-gradient(oklch(var(--b3)) ${size}px, transparent ${size}px), linear-gradient(to right, oklch(var(--b3)) ${size}px, transparent ${size}px)`
    };
}

const exp = {
    theme: darkTheme,
    buildBackgroundStyle: darkThemeBuildBackgroundStyle
};

export default exp;
