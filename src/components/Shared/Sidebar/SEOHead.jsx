/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/next-script-for-ga */
import Head from "next/head";
import Script from "next/script";

const SEOHead = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Viscart</title>
        <meta name="description" content="Complete E-Commerce Site" />
      </Head>

      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5LDJJ32D');
          `,
        }}
      />
    </>
  );
};

export default SEOHead;
