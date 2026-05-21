'use client';

import {
   FormEvent,
   KeyboardEvent,
   useEffect,
   useMemo,
   useRef,
   useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Bot, RefreshCcw, Send, Sparkles, WandSparkles, X } from 'lucide-react';
import {
   Button,
   LoadingState,
   Sheet,
   SheetContent,
   SheetDescription,
   SheetTitle,
   Textarea,
} from '@/components/ui';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useAiChat } from '@/hooks/chat';
import type { AppModalTheme } from '@/components/ui/app-modal';

const CHAT_THEME_STYLES: Record<
   AppModalTheme,
   {
      panel: string;
      badge: string;
      assistant: string;
      user: string;
      launcher: string;
      input: string;
      accent: string;
   }
> = {
   admin: {
      panel: 'bg-card',
      badge: 'border-primary/20 bg-primary/10 text-primary',
      assistant: 'border border-border/70 bg-muted/60 text-foreground',
      user: 'bg-primary text-primary-foreground',
      launcher: 'bg-primary text-primary-foreground ',
      input: 'border-border bg-muted/40',
      accent: '',
   },
   customer: {
      panel: 'bg-background',
      badge: 'border-primary/20 bg-primary/10 text-primary',
      assistant: 'border border-border/60 bg-muted/60 text-foreground',
      user: 'bg-primary text-primary-foreground',
      launcher: 'bg-primary text-primary-foreground ',
      input: 'border-border ',
      accent: '',
   },
   worker: {
      panel: 'bg-background',
      badge: 'border-secondary/30 bg-secondary/15 text-secondary',
      assistant: 'border border-border/60 bg-muted/60 text-foreground',
      user: 'bg-secondary text-secondary-foreground',
      launcher: 'bg-secondary text-secondary-foreground ',
      input: 'border-border bg-muted/40',
      accent: '',
   },
};

function TypingIndicator({ className }: { className?: string }) {
   return (
      <div
         className={cn(
            'flex items-center gap-2 rounded-2xl px-4 py-3',
            className
         )}
      >
         <span className="size-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-current opacity-40 [animation-delay:0s]" />
         <span className="size-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-current opacity-40 [animation-delay:0.4s]" />
         <span className="size-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-current opacity-40 [animation-delay:0.8s]" />
      </div>
   );
}

export function FixChatbot() {
   const pathname = usePathname();
   const { data: session, status } = useSession();
   const [open, setOpen] = useState(false);
   const [message, setMessage] = useState('');
   const bottomRef = useRef<HTMLDivElement | null>(null);
   const { messages, isLoadingHistory, isSending, sendMessage, reloadHistory } =
      useAiChat();

   const isWorker =
      session?.user?.role === 'worker' || pathname.startsWith('/worker');
   const theme: AppModalTheme = isWorker ? 'worker' : 'customer';
   const styles = CHAT_THEME_STYLES[theme];

   const shouldHide =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/auth') ||
      status !== 'authenticated';

   const headerDescription = useMemo(
      () =>
         isWorker ? 'مساعد ذكي سريع للفنيين .' : 'مساعد ذكي سريع للعملاء .',
      [isWorker]
   );

   useEffect(() => {
      if (!open) return;

      requestAnimationFrame(() => {
         bottomRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
         });
      });
   }, [messages, isSending, open]);

   const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!message.trim() || isSending || isLoadingHistory) return;

      const content = message;
      setMessage('');
      await sendMessage(content);
   };

   const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
         event.preventDefault();
         void handleSubmit();
      }
   };

   if (shouldHide) return null;

   return (
      <>
         <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
               'group fixed bottom-6 left-4 z-50 flex h-11 items-center overflow-hidden rounded-full md:left-6',
               'shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-xl ',
               styles.launcher
            )}
         >
            <span className="flex size-11 shrink-0 items-center justify-center">
               <Sparkles className="size-4.5" />
            </span>
            <span
               className={cn(
                  'max-w-0 overflow-hidden whitespace-nowrap pe-0 text-sm font-medium',
                  'transition-[max-width,padding] duration-900 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                  'group-hover:max-w-24 group-hover:pe-4'
               )}
            >
               إسأل فيكس
            </span>
         </button>

         <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
               side="left"
               showCloseButton={false}
               className={cn(
                  'w-screen border-r-0 p-0 sm:max-w-107.5',
                  styles.panel
               )}
            >
               <div className="flex h-full flex-col overflow-hidden">
                  {/* Header — ~10% height */}
                  <div
                     className={cn(
                        'relative flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-2',
                        styles.accent
                     )}
                  >
                     <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-xl bg-muted">
                           <Bot className="size-4" />
                        </div>
                        <div>
                           <SheetTitle className="text-sm font-semibold leading-none"></SheetTitle>
                           <SheetDescription className="mt-0.5 text-[11px] text-muted-foreground">
                              {headerDescription}
                           </SheetDescription>
                        </div>
                     </div>

                     <div className="flex items-center gap-1">
                        <div
                           className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                              styles.badge
                           )}
                        >
                           <Sparkles className="size-3" />
                           AI
                        </div>
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={reloadHistory}
                           aria-label="تحديث المحادثة"
                           disabled={isLoadingHistory}
                           className="size-7 rounded-full"
                        >
                           <RefreshCcw
                              className={cn(
                                 'size-3.5',
                                 isLoadingHistory && 'animate-spin'
                              )}
                           />
                        </Button>
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           onClick={() => setOpen(false)}
                           aria-label="إغلاق"
                           className="size-7 rounded-full"
                        >
                           <X className="size-3.5" />
                        </Button>
                     </div>
                  </div>

                  {/* Messages — takes all remaining space */}
                  <div className="flex-1 overflow-hidden px-3 ">
                     <div className="h-full overflow-y-auto px-1" dir="rtl">
                        {isLoadingHistory ? (
                           <div className="flex h-full items-center justify-center">
                              <LoadingState />
                           </div>
                        ) : (
                           <div className="space-y-4 pb-4 pt-2">
                              {messages.map((msg) => {
                                 const isUser = msg.role === 'user';

                                 return (
                                    <div
                                       key={msg.id}
                                       className={cn(
                                          'flex w-full',
                                          isUser
                                             ? 'justify-start'
                                             : 'justify-end'
                                       )}
                                    >
                                       <div className="max-w-[86%]">
                                          {!isUser ? (
                                             <div className="mb-1 flex justify-end items-center gap-2 px-1 text-[11px] text-muted-foreground">
                                                <WandSparkles className="size-3" />
                                                <span>فيكس</span>
                                             </div>
                                          ) : null}
                                          <div
                                             className={cn(
                                                'rounded-[20px] px-2 py-1 text-sm leading-7',
                                                isUser
                                                   ? 'rounded-br-sm'
                                                   : 'rounded-bl-sm',
                                                isUser
                                                   ? styles.user
                                                   : styles.assistant
                                             )}
                                          >
                                             {isUser ? (
                                                msg.text
                                             ) : (
                                                <ReactMarkdown
                                                   remarkPlugins={[remarkGfm]}
                                                   components={{
                                                      p: ({ children }) => (
                                                         <p className="mb-2 last:mb-0">
                                                            {children}
                                                         </p>
                                                      ),
                                                      strong: ({
                                                         children,
                                                      }) => (
                                                         <strong className="font-semibold">
                                                            {children}
                                                         </strong>
                                                      ),
                                                      em: ({ children }) => (
                                                         <em className="italic">
                                                            {children}
                                                         </em>
                                                      ),
                                                      ul: ({ children }) => (
                                                         <ul className="mb-2 list-disc ps-4 space-y-1">
                                                            {children}
                                                         </ul>
                                                      ),
                                                      ol: ({ children }) => (
                                                         <ol className="mb-2 list-decimal ps-4 space-y-1">
                                                            {children}
                                                         </ol>
                                                      ),
                                                      li: ({ children }) => (
                                                         <li className="leading-6">
                                                            {children}
                                                         </li>
                                                      ),
                                                      code: ({ children }) => (
                                                         <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                                                            {children}
                                                         </code>
                                                      ),
                                                      pre: ({ children }) => (
                                                         <pre className="mb-2 overflow-x-auto rounded-xl bg-muted p-3 font-mono text-xs">
                                                            {children}
                                                         </pre>
                                                      ),
                                                      h1: ({ children }) => (
                                                         <h1 className="mb-1 text-base font-bold">
                                                            {children}
                                                         </h1>
                                                      ),
                                                      h2: ({ children }) => (
                                                         <h2 className="mb-1 text-sm font-bold">
                                                            {children}
                                                         </h2>
                                                      ),
                                                      h3: ({ children }) => (
                                                         <h3 className="mb-1 text-sm font-semibold">
                                                            {children}
                                                         </h3>
                                                      ),
                                                      hr: () => (
                                                         <hr className="my-2 border-current opacity-15" />
                                                      ),
                                                   }}
                                                >
                                                   {msg.text}
                                                </ReactMarkdown>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}

                              {isSending ? (
                                 <div className="flex justify-end bg-transparent">
                                    <TypingIndicator
                                       className={styles.assistant}
                                    />
                                 </div>
                              ) : null}

                              <div ref={bottomRef} />
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="shrink-0 px-3 pb-4 absloute bg-transparent">
                     <form onSubmit={handleSubmit} className="bg-transparent">
                        <div
                           className={cn(
                              'flex  items-end gap-2 rounded-2xl  shadow-lg transition-shadow focus-within:shadow-xl bg-transparent',
                              styles.input
                           )}
                        >
                           <Textarea
                              value={message}
                              onChange={(event) =>
                                 setMessage(event.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              placeholder="إسأل فيكس..."
                              className="min-h-9 max-h-24 flex-1 resize-none border  px-2.5 py-2 text-sm leading-5 shadow-none focus-visible:ring-1 "
                              dir="rtl"
                           />
                           <Button
                              type="submit"
                              disabled={
                                 isSending ||
                                 !message.trim() ||
                                 isLoadingHistory
                              }
                              className={cn(
                                 'mb-0.5 size-8 shrink-0 rounded-xl p-0 transition-opacity disabled:opacity-30',
                                 styles.launcher
                              )}
                           >
                              <Send className="size-3.5" />
                           </Button>
                        </div>
                     </form>
                  </div>
               </div>
            </SheetContent>
         </Sheet>
      </>
   );
}
