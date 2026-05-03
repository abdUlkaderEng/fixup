import type { ReactNode } from 'react';

interface CustomerOrdersLayoutProps {
   children: ReactNode;
   modal: ReactNode;
}

export default function CustomerOrdersLayout({
   children,
   modal,
}: CustomerOrdersLayoutProps) {
   return (
      <>
         {children}
         {modal}
      </>
   );
}
