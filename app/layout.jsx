export const metadata = {
  title: "GhatRunner — Sahyadri Treks",
  description: "Book curated treks near Pune with WhatsApp + UPI flow.",
};
import "../app/globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
