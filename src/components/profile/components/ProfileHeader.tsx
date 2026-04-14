'use client';

import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';

interface ProfileHeaderProps {
   name?: string | null;
   email?: string | null;
}

export function ProfileHeader({ name, email }: ProfileHeaderProps) {
   return (
      <div className="mb-8">
         <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-primary" />
         </div>
         <h1 className="text-3xl font-bold text-center mb-2">{name}</h1>
         <p className="text-muted-foreground text-center">{email}</p>
      </div>
   );
}

interface BackLinkProps {
   href: string;
   label: string;
}

export function BackLink({ href, label }: BackLinkProps) {
   return (
      <Link
         href={href}
         className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
         <ArrowLeft className="h-4 w-4" />
         <span>{label}</span>
      </Link>
   );
}
