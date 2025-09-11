
// import TopBarSimbah from "@/externals/components/TopBarSimbah";
import { Inter, Roboto } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: '--font-inter', });
const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin', 'greek'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} bg-slate-50`}>
      <body className="font-inter">
        {/* <TopBarSimbah /> */}
        {children}
      </body>
    </html>
  );
}
