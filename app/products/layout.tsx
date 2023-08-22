export const metadata = {
  title: 'Products | SmallShop',
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
