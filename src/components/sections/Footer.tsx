import {
   CheckCircle,
   Users,
   Clock,
   Shield,
   Star,
   Phone,
   Mail,
   MapPin,
} from 'lucide-react';

const whyChooseUs = [
   {
      id: 1,
      title: 'محترفون موثوقون',
      description:
         'جميع مقدمي خدماتنا خضعوا لفحص شامل وتحقق من الخلفية لراحة بالك.',
      icon: CheckCircle,
   },
   {
      id: 2,
      title: 'متاحون 24/7',
      description:
         'توفر الخدمات على مدار الساعة للإصلاحات الطارئة واحتياجات الصيانة العاجلة.',
      icon: Clock,
   },
   {
      id: 3,
      title: 'ضمان الرضا',
      description: 'نقف وراء عملنا بضمان شامل للرضا على جميع الخدمات.',
      icon: Shield,
   },
   {
      id: 4,
      title: 'شبكة خبراء',
      description:
         'الوصول إلى شبكة كبيرة من المحترفين ذوي الخبرة مع سجلات مثبتة.',
      icon: Users,
   },
   {
      id: 5,
      title: 'تسعير شفاف',
      description: 'تسعير واضح ومقدم مع عدم وجود رسوم خفية أو تكاليف مفاجئة.',
      icon: Star,
   },
   {
      id: 6,
      title: 'استجابة سريعة',
      description:
         'أوقات استجابة سريعة مع معظم طلبات الخدمات يتم الرد عليها خلال ساعات.',
      icon: Phone,
   },
];

export function Footer() {
   return (
      <footer className="">
         {/* WHY CHOOSE US */}
         <section className="py-16">
            <div className="container mx-auto px-4">
               <div className="grid lg:grid-cols-2 gap-10 items-start">
                  {/* Left side - Title */}
                  <div className="lg:sticky lg:top-24 ">
                     <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        لماذا تختارنا؟
                     </h2>
                     <p className="text-xl max-w-lg">
                        نحن ملتزمون بتقديم خدمات منزلية استثنائية مع الموثوقية
                        والجودة ورضا العملاء في صميم كل ما نقوم به.
                     </p>
                  </div>

                  {/* Right side - Content */}
                  <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                     {whyChooseUs.map((item) => {
                        const IconComponent = item.icon;

                        return (
                           <div
                              key={item.id}
                              className="flex items-start gap-4 p-6 border border-blue-400/30 rounded-xl hover:bg-foreground/3 hover:-translate-y-1 transition-all duration-300"
                           >
                              <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                                 <IconComponent className="w-6 h-6 text-blue-400" />
                              </div>

                              <div className="flex-1">
                                 <h3 className="text-lg font-semibold mb-2">
                                    {item.title}
                                 </h3>
                                 <p className="leading-relaxed text-sm">
                                    {item.description}
                                 </p>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>
         </section>

         {/* DIVIDER */}
         <div className="w-full h-px bg-blue-400/30"></div>

         {/* FOOTER CONTENT */}
         <section className="py-12 bg-[#16181d] text-white/90">
            <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10">
               {/* CONTACT */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">
                     معلومات الاتصال
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-white/70">
                        <Phone className="w-4 h-4" />
                        <span>1-800-FIXUP-NOW</span>
                     </div>

                     <div className="flex items-center gap-3 text-white/70">
                        <Mail className="w-4 h-4" />
                        <span>support@fixup.com</span>
                     </div>

                     <div className="flex items-center gap-3 text-white/70">
                        <MapPin className="w-4 h-4" />
                        <span>نخدم جميع المدن الرئيسية</span>
                     </div>
                  </div>
               </div>

               {/* QUICK LINKS */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
                  <div className="space-y-2">
                     {['من نحن', 'الخدمات', 'كن محترفاً', 'الدعم'].map(
                        (link, i) => (
                           <a
                              key={i}
                              href="#"
                              className="block text-white/70 hover:text-white transition-colors"
                           >
                              {link}
                           </a>
                        )
                     )}
                  </div>
               </div>

               {/* NEWSLETTER */}
               <div>
                  <h3 className="text-lg font-semibold mb-4">
                     النشرة البريدية
                  </h3>
                  <p className="text-white/70 mb-4">
                     اشترك للحصول على تحديثات حول الخدمات الجديدة والعروض
                     الحصرية.
                  </p>
                  <div className="flex gap-2">
                     <input
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        className="flex-1 px-4 py-2 bg-[#16181d] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                     />
                     <button className="px-5 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition-colors">
                        اشترك
                     </button>
                  </div>
               </div>
            </div>

            {/* COPYRIGHT */}
            <div className="mt-10 pt-6 border-t border-white/5 text-center text-sm text-white/50">
               <p>
                  © 2024 FixUp. جميع الحقوق محفوظة | سياسة الخصوصية | شروط
                  الخدمة
               </p>
            </div>
         </section>
      </footer>
   );
}
