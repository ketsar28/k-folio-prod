/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import NotFoundFragment from "../../components/fragments/error/NotFoundFragment";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this effect runs only once after mount
  return (
    <div>
      <Helmet>
        <title>Not Found - K-Folio</title>
        <meta
          name="description"
          content="Maaf, halaman yang Anda cari tidak ditemukan. Kunjungi situs kami untuk informasi lebih lanjut tentang layanan kami."
        />
        <link rel="canonical" href="https://www.conexatindo.com/*" />
      </Helmet>
      <NotFoundFragment />
    </div>
  );
};

export default NotFoundPage;
