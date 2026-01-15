import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meal Prep Planner - For Indian Students Abroad',
  description: 'AI-powered meal prep planner helping Indian students abroad create time-efficient meal plans with home-style Indian food',
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

