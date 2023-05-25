import React from "react";
import Layout from "@theme/Layout";
import IntroNodeEditor from "../components/node";

export default function Home(): JSX.Element {
    return (
        <Layout title={`Homepage`} description="Description will go into a meta tag in <head />">
            <IntroNodeEditor />
        </Layout>
    );
}
