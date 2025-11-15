import { Helmet } from "react-helmet-async";

const SEOHelmet = () => {
  const siteTitle = "Muhammad Ketsar Ali Abi Wahid | Data Scientist & ML Engineer";
  const siteDescription =
    "Data Scientist specializing in Machine Learning and Optimization. Transforming data into actionable business strategies and high-impact solutions. Experienced in Python, Deep Learning, and Production ML Deployment.";
  const siteUrl = "https://k-folio-prod.vercel.app";
  const siteImage = `${siteUrl}/og-image.jpg`; // You'll need to add this image

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={siteDescription} />
      <meta
        name="keywords"
        content="Data Scientist, Machine Learning, Deep Learning, Optimization, Python, ML Engineer, Portfolio, Muhammad Ketsar, Ketsar Ali, Data Science, AI, Artificial Intelligence, Jakarta"
      />
      <meta name="author" content="Muhammad Ketsar Ali Abi Wahid" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:site_name" content="Ketsar Portfolio" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={siteDescription} />
      <meta property="twitter:image" content={siteImage} />
      <meta property="twitter:creator" content="@ketsar" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={siteUrl} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhammad Ketsar Ali Abi Wahid",
          jobTitle: "Data Scientist",
          description: siteDescription,
          url: siteUrl,
          sameAs: [
            "https://github.com/ketsar28/",
            "https://www.linkedin.com/in/ketsarali/",
            "https://www.instagram.com/ketsar.aaw/",
            "https://huggingface.co/ketsar",
          ],
          knowsAbout: [
            "Machine Learning",
            "Deep Learning",
            "Optimization",
            "Python",
            "Data Science",
            "Artificial Intelligence",
          ],
        })}
      </script>
    </Helmet>
  );
};

export default SEOHelmet;
