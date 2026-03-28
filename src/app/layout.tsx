import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Admission Management & CRM | edumerge',
  description: 'College Admission Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#F4F6F9' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
