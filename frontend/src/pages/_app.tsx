import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import "../styles/globals.css";

import { createClient } from "urql";
import { EnvProvider, GraphQLProvider } from "../lib/env";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EnvProvider>
      <GraphQLProvider>
        <Layout>
          <Head>
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </GraphQLProvider>
    </EnvProvider>
  );
}

export default MyApp;
