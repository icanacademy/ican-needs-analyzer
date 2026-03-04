import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ICAN Needs Analyzer | 아이캔 니즈 분석기",
  description: "Student needs analysis system for ICAN Language Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-slate-900">
                  ICAN <span className="text-blue-600">Needs Analyzer</span>
                  <span className="text-sm text-slate-400 ml-2">니즈 분석기</span>
                </Link>
                <div className="hidden sm:flex items-center gap-1">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/students"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    Students / 학생
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
