import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sport1-six.vercel.app"),
  title: "PACEFORGE — Hybrid Fitness Timer",
  description:
    "크로스핏과 HYROX 훈련을 위한 음성 안내형 인터벌 타이머. 세트, 휴식, 러닝과 스테이션 전환을 놓치지 마세요.",
  applicationName: "PACEFORGE",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "PACEFORGE — Train the transition",
    description:
      "크로스핏과 HYROX 선수를 위한 음성 안내형 하이브리드 피트니스 타이머",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PACEFORGE — Train the transition",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PACEFORGE — Train the transition",
    description:
      "크로스핏과 HYROX 선수를 위한 음성 안내형 하이브리드 피트니스 타이머",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0b0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body data-mobile-view="home">{children}</body>
    </html>
  );
}
