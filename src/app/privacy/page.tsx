import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
   title: 'سياسة الخصوصية | Fixup',
   description: 'سياسة الخصوصية لمنصة Fixup',
};

export default function PrivacyPage() {
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
                     <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold">سياسة الخصوصية</h1>
                  <p className="text-sm text-muted-foreground">
                     آخر تحديث: يونيو ٢٠٢٦
                  </p>
               </div>

               <div className="space-y-6 leading-relaxed text-muted-foreground">
                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ١. المعلومات التي نجمعها
                     </h2>
                     <p>
                        نقوم بجمع المعلومات التي تقدمها عند إنشاء حساب، مثل
                        الاسم والبريد الإلكتروني ورقم الهاتف والعنوان، بهدف
                        تقديم الخدمة وتحسين تجربتك.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٢. استخدام المعلومات
                     </h2>
                     <p>
                        نستخدم معلوماتك لربطك بمزودي الخدمات، ومعالجة الطلبات،
                        والتواصل معك بشأن حسابك والخدمات المقدمة.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٣. مشاركة المعلومات
                     </h2>
                     <p>
                        لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا بالقدر
                        اللازم لتقديم الخدمة أو عند وجود التزام قانوني بذلك.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٤. حماية البيانات
                     </h2>
                     <p>
                        نتخذ إجراءات أمنية معقولة لحماية بياناتك من الوصول غير
                        المصرح به أو التعديل أو الإفصاح غير المشروع.
                     </p>
                  </section>

                  <section className="space-y-2">
                     <h2 className="text-lg font-semibold text-foreground">
                        ٥. حقوقك
                     </h2>
                     <p>
                        يحق لك الوصول إلى بياناتك الشخصية وتحديثها أو طلب حذفها
                        في أي وقت عبر التواصل معنا.
                     </p>
                  </section>
               </div>
            </div>
         </div>
      </div>
   );
}
