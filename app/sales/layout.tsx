export const metadata = {
  title: 'Sales | SmallShop',
  description: 'An app for small shops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
            {children}
      </div>  
   
  )
}
