import './globals.css';

export const metadata = {
  title: 'CodeCollab - Collaborative Coding Platform',
  description: 'Code together in real-time with video and chat collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}