import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import NoiseOverlay from "@/components/NoiseOverlay";
import PageLoader from "@/components/PageLoader";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Syed Anas Ali | Creative Developer & AI Specialist",
  description:
    "Portfolio of Syed Anas Ali — Creative Developer specializing in AI-powered web solutions, full-stack applications, and computer vision systems. Based in Hyderabad, India.",
  keywords: [
    "Syed Anas Ali",
    "Creative Developer",
    "AI Developer",
    "Next.js",
    "React",
    "Portfolio",
    "Hyderabad",
    "Full Stack",
  ],
  authors: [{ name: "Syed Anas Ali" }],
  openGraph: {
    title: "Syed Anas Ali | Creative Developer",
    description: "AI-powered web solutions and extraordinary digital experiences.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Anas Ali | Creative Developer",
    description: "AI-powered web solutions and extraordinary digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Cinzel+Decorative:wght@400;700;900&family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0A192F" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sans antialiased bg-background text-primaryText">
        {/* WebGL 3D Background */}
        <Background3D />

        {/* Cinematic page loader */}
        <PageLoader />

        {/* Premium dual-ring custom cursor */}
        <CustomCursor />

        {/* Subtle film grain overlay */}
        <NoiseOverlay />

        {/* Lenis smooth scroll wrapper */}
        <SmoothScroll>{children}</SmoothScroll>
        <Toaster position="top-right" toastOptions={{ style: { background: '#112240', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      </body>
    </html>
  );
}
