import Script from "next/script";
import { paceforgeMarkup } from "./paceforge-markup";

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: paceforgeMarkup }} />
      <Script src="/app.js?v=20260731-custom-nav" strategy="afterInteractive" />
    </>
  );
}
