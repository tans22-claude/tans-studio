import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "TANS STUDIO — Color, Retouch, Key Art",
  description:
    "Studio pasca-produksi independen: color grading sinematik, retouching editorial, dan key art presisi tinggi.",
};

export const viewport = {
  themeColor: "#260212",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  );
}
