import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./sobre.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${manrope.variable} ${cormorant.variable}`}>
      {children}
    </div>
  );
}
