import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Student Prioritizer</title>
        <meta name="description" content="Prioritize student assignments based on submission time" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='35' r='20' fill='%234F46E5'/><path d='M 30 60 Q 30 50 50 50 Q 70 50 70 60 L 70 75 Q 70 80 65 80 L 35 80 Q 30 80 30 75 Z' fill='%234F46E5'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
