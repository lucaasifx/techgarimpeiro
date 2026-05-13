import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechGarimpeiro Admin',
  description: 'Painel de curadoria de ofertas',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem', background: '#0f0f0f', color: '#e5e5e5' }}>
        {children}
      </body>
    </html>
  );
}
