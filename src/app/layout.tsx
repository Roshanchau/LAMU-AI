import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LAMU-AI (Minimal Version) | Antimicrobial Usage Surveillance',
  description: 'Minimal research prototype of the antimicrobial usage surveillance platform with MongoDB Atlas vector search and multi-provider LLM pipelines.',
  keywords: ['antimicrobial resistance', 'veterinary medicine', 'FARAD', 'AI', 'livestock', 'antimicrobial stewardship', 'MongoDB vector search', 'minimal prototype'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-900 bg-gray-50">{children}</body>
    </html>
  );
}
