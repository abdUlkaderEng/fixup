'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return (
         <div className="flex items-center gap-2 opacity-50">
            <Sun className="h-4 w-4" />
            <Switch disabled />
            <Moon className="h-4 w-4" />
         </div>
      );
   }

   const isDark = theme === 'dark';

   return (
      <div className="flex items-center gap-2">
         <Sun
            className={`h-4 w-4 transition-all ${
               isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
         />
         <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            className="data-[state=checked]:bg-primary transition-all "
            size="default"
         />
         <Moon
            className={`h-4 w-4 transition-all ${
               isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
         />
      </div>
   );
}
