import "./globals.css";

export const metadata = {
  title: "Airbnb",
  description: "airbnb clone next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
