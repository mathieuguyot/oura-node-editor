// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "oura node editor",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://your-docusaurus-test-site.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "Mathieu Guyot", // Usually your GitHub org/user name.
    projectName: "oura-node-editor", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js")
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            })
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: "img/docusaurus-social-card.jpg",
            navbar: {
                title: "Oura node editor",
                // logo: {
                //     alt: "My Site Logo",
                //     src: "img/logo.svg"
                // },
                items: [
                    {
                        type: "docSidebar",
                        sidebarId: "tutorialSidebar",
                        position: "left",
                        label: "Tutorial"
                    },
                    {
                        to: "https://github.com/mathieuguyot/oura-node-editor",
                        label: "GitHub",
                        position: "right"
                    }
                ]
            },
            footer: {
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Introduction",
                                to: "docs/introduction"
                            }
                        ]
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "Stack Overflow",
                                to: "https://stackoverflow.com/users/10781901/mathieu-guyot"
                            },
                            {
                                label: "GitHub",
                                to: "https://github.com/mathieuguyot"
                            }
                        ]
                    }
                ],
                copyright: `Copyright © ${new Date().getFullYear()} 🇫🇷 Mathieu Guyot - Made by ❤️ with Docusaurus`
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme
            }
        })
};

module.exports = config;
