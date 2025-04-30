import ThemeRegistry from './theme';

export const metadata = {
  title: 'Rent vs Buy Calculator',
  description: 'Compare the financial outcomes of renting versus buying a home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
