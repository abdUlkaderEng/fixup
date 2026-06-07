import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata = {
   title: 'شروط الاستخدام | Fixup',
   description: 'شروط استخدام منصة Fixup',
};

export default function TermsPage() {
   return (
      <div className="min-h-[calc(100vh-4rem)] mt-16 bg-linear-to-br from-background via-muted/50 to-background p-4 sm:p-6 lg:p-8">
         <div className="mx-auto w-full max-w-3xl">
            <Link
               href="/"
               className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               <ArrowLeft className="h-4 w-4" />
               <span>العودة للرئيسية</span>
            </Link>

            <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
               <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                     <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold">شروط الاستخدام</h1>
                  <p className="text-sm text-muted-foreground">
                     آخر تحديث: يونيو ٢٠٢٦
                  </p>
               </div>

               <div className="space-y-6 leading-relaxed text-muted-foreground">
                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ١. قبول الشروط
                     </h2>
                     <p>
                        باستخدامك منصة Fixup فإنك توافق على الالتزام بهذه الشروط
                        والأحكام. إذا كنت لا توافق على أي جزء منها، يُرجى عدم
                        استخدام المنصة.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٢. استخدام الخدمة
                     </h2>
                     <p>
                        تتيح المنصة ربط العملاء بمزودي الخدمات المحليين. يلتزم
                        المستخدم بتقديم معلومات صحيحة ودقيقة، وعدم إساءة استخدام
                        المنصة بأي شكل من الأشكال.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٣. الحسابات
                     </h2>
                     <p>
                        أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور،
                        وعن جميع الأنشطة التي تتم من خلال حسابك.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٤. المسؤولية
                     </h2>
                     <p>
                        تعمل المنصة كوسيط بين العملاء ومزودي الخدمات، ولا تتحمل
                        المسؤولية المباشرة عن جودة الخدمات المقدمة بين الأطراف.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٥. التعديلات
                     </h2>
                     <p>
                        نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إشعار
                        المستخدمين بأي تغييرات جوهرية عبر المنصة.
                     </p>
                  </section>
               </div>
            </div>
         </div>
      </div>
   );
}
