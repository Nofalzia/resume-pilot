import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "ResumePilot",
  description: "AI Resume Builder",
};

const links = [
  ["Dashboard", "/dashboard"],
  ["Resumes", "/resumes"],
  ["Templates", "/templates"],
  ["ATS", "/ats-checker"],
  ["Cover Letter", "/cover-letter"],
  ["AI Assistant", "/ai-assistant"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
  ["Health", "/health"],
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex">
        <aside className="w-64 border-r p-6 hidden md:block">
          <h2 className="font-bold text-xl mb-6">
            ResumePilot
          </h2>

          <nav className="space-y-3">
            {links.map(([name, href]) => (
              <div key={href}>
                <Link href={href}>{name}</Link>
              </div>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}