import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Student Prioritizer</title>
        <meta name="description" content="Prioritize student assignments based on submission time" />
      </head>
      <body>{children}</body>
    </html>
  )
}
