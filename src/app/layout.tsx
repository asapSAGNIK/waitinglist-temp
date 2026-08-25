import type { Metadata } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Waitlist — Something Big Is Coming";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Join the waitlist — be first to know when we launch. Secure your spot in line, get your queue position instantly.",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: appName,
    description: "Join the waitlist and secure your spot. Get notified on launch day.",
    url: appUrl,
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: "Join the waitlist and secure your spot.",
  },
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 selection:bg-violet-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
