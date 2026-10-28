import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "TANS Studio — Color, Retouch & Key Art",
  description:
    "Studio pasca-produksi independen untuk color grading, retouching, dan key art film.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#fffef7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="bg-bone font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
