import CSS from "csstype";

import { PanZoomModel } from "../model";
import { Theme } from "./theme";

const darkTheme: Theme = {
    node: {
        selected: {
            boxShadow: "0px 0px 0px 2px white",
            borderRadius: "10px 10px 10px 10px"
        },
        header: {
            backgroundColor: "red",
            color: "white",
            borderRadius: "10px 10px 0px 0px",
            height: "20px",
            cursor: "grab",
            overflow: "hidden",
            paddingLeft: "10px"
        },
        body: {
            color: "white",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "grab"
        },
        footer: {
            borderRadius: "0px 0px 10px 10px",
            height: "10px",
            backgroundColor: "rgba(63, 63, 63, 0.75)",
            cursor: "ew-resize"
        },
        basePin: {
            backgroundColor: "rgba(199, 199, 41, 1)",
            borderRadius: "5px 5px 5px 5px",
            cursor: "grab"
        },
        customPins: {
            string: {
                backgroundColor: "red",
                transform: "rotate(45deg)",
            }
        },
    },
    link: {
        selected: {
            stroke: "white",
            strokeWidth: "3px",
            fill: "none"
        },
        unselected: {
            stroke: "rgba(170, 170, 170, 0.75)",
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
            paddingRight: "5px",
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
    const grid = String(200 * panZoomInfo.zoom);
    return {
        backgroundColor: "#232323",
        backgroundPosition: `${panZoomInfo.topLeftCorner.x}px ${panZoomInfo.topLeftCorner.y}px`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${grid}' height='${grid}' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='black' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    };
}

export default {
    theme: darkTheme,
    buildBackgroundStyle: darkThemeBuildBackgroundStyle
};
