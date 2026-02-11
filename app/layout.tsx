import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dropbox Tag Kanban MVP',
  description: 'Minimal Kanban image tagging app with Supabase auth'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
