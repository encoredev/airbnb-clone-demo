import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

import { createClient, Provider } from "urql";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Layout>
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
