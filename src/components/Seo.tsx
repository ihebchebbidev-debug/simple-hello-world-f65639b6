import { Helmet } from 'react-helmet-async';

export default function Seo({
  title,
  description,
  path,
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={path} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:type" content="website" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
