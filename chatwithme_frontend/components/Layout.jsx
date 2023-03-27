import React from "react";
import Head from "next/head";
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Wassage</title>
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <main className="mt-10">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
