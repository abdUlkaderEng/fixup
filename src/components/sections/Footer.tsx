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
      <footer className="bg-gray-900 text-white">
         <section className="py-16 bg-gray-800">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                     لماذا تختارنا؟
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                     نحن ملتزمون بتقديم خدمات منزلية استثنائية مع الموثوقية
                     والجودة ورضا العملاء في صميم كل ما نقوم به.
                  </p>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {whyChooseUs.map((item) => {
                     const IconComponent = item.icon;
                     return (
                        <div
                           key={item.id}
                           className="flex items-start space-x-4 p-6 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300"
                        >
                           <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                 <IconComponent className="w-6 h-6 text-white" />
                              </div>
                           </div>
                           <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                 {item.title}
                              </h3>
                              <p className="text-gray-300 leading-relaxed">
                                 {item.description}
                              </p>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </section>

         <section className="py-8 border-t border-gray-800">
            <div className="container mx-auto px-4">
               <div className="grid md:grid-cols-3 gap-8">
                  <div>
                     <h3 className="text-lg font-semibold text-white mb-4">
                        معلومات الاتصال
                     </h3>
                     <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-300">
                           <Phone className="w-4 h-4" />
                           <span>1-800-FIXUP-NOW</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                           <Mail className="w-4 h-4" />
                           <span>support@fixup.com</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-300">
                           <MapPin className="w-4 h-4" />
                           <span>نخدم جميع المدن الرئيسية</span>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold text-white mb-4">
                        روابط سريعة
                     </h3>
                     <div className="space-y-2">
                        <a
                           href="#"
                           className="block text-gray-300 hover:text-white transition-colors"
                        >
                           من نحن
                        </a>
                        <a
                           href="#"
                           className="block text-gray-300 hover:text-white transition-colors"
                        >
                           الخدمات
                        </a>
                        <a
                           href="#"
                           className="block text-gray-300 hover:text-white transition-colors"
                        >
                           كن محترفاً
                        </a>
                        <a
                           href="#"
                           className="block text-gray-300 hover:text-white transition-colors"
                        >
                           الدعم
                        </a>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold text-white mb-4">
                        النشرة البريدية
                     </h3>
                     <p className="text-gray-300 mb-4">
                        اشترك للحصول على تحديثات حول الخدمات الجديدة والعروض
                        الحصرية.
                     </p>
                     <div className="flex space-x-2">
                        <input
                           type="email"
                           placeholder="بريدك الإلكتروني"
                           className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                           اشترك
                        </button>
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                  <p>
                     &copy; 2024 FixUp. جميع الحقوق محفوظة | سياسة الخصوصية |
                     شروط الخدمة
                  </p>
               </div>
            </div>
         </section>
      </footer>
   );
}
