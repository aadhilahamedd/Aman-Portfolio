import { productionOrigin } from "@/lib/site-url";

export function SocialImage({ src, alt }: { src: string; alt: string }) {
  if (productionOrigin()) return null;

  return (
    <>
      <meta property="og:image" content={src} />
      <meta property="og:image:alt" content={alt} />
      <meta name="twitter:image" content={src} />
    </>
  );
}
