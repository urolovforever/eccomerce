import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

function About() {
  const values = [
    {
      icon: SparklesIcon,
      title: 'Sifat',
      description: 'Har bir mahsulotimiz eng yuqori sifat standartlariga javob beradi',
      color: 'from-primary-500 to-primary-700'
    },
    {
      icon: HeartIcon,
      title: 'Mijozlar ehtiyoji',
      description: 'Mijozlarimiz mamnuniyati bizning birinchi o\'rindagi maqsadimiz',
      color: 'from-accent-500 to-rose-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Ishonch',
      description: 'Shaffof va halol muomala orqali ishonch qaror topamiz',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: TruckIcon,
      title: 'Tez yetkazib berish',
      description: 'Buyurtmalaringizni eng qisqa muddatda yetkazib beramiz',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: GlobeAltIcon,
      title: 'Zamonaviy',
      description: 'Eng so\'nggi moda trendlarini kuzatib boramiz',
      color: 'from-purple-500 to-purple-700'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovatsiya',
      description: 'Doimiy rivojlanish va yangiliklar kiritish',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Xursand mijozlar', icon: UserGroupIcon },
    { number: '5,000+', label: 'Mahsulotlar', icon: SparklesIcon },
    { number: '50+', label: 'Brendlar', icon: StarIcon },
    { number: '99%', label: 'Mamnunlik darajasi', icon: HeartIcon }
  ];

  const features = [
    'Yuqori sifatli mahsulotlar',
    'Bepul yetkazib berish',
    'Qulay to\'lov usullari',
    '24/7 mijozlar xizmati',
    'Mahsulotlarni almashtirish imkoniyati',
    'Eng so\'nggi moda trendlari'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-light via-white to-surface-light">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-soft-md border border-primary-200 mb-6">
              <SparklesIcon className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                2020-yildan buyon sizning ishonchingiz
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-light text-text-primary tracking-tight mb-6">
              Ayollar uchun <span className="font-medium text-primary-600">zamonaviy moda</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed mb-8 max-w-3xl mx-auto">
              MoonGift — ayollar uchun eng yaxshi kiyim brendlarini taqdim etuvchi onlayn do'kon.
              Biz har bir ayolning o'ziga xos uslubini topishiga yordam beramiz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg font-medium hover:shadow-soft-hover transition-all duration-300 group"
              >
                Kolleksiyani ko'rish
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-primary-50 transition-all duration-300"
              >
                Bog'lanish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-3 group-hover:shadow-soft-md transition-all">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-text-secondary font-light">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl overflow-hidden shadow-soft-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <SparklesIcon className="w-20 h-20 text-primary-600 mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-text-secondary">Brend rasmi</p>
                  </div>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl opacity-20 -z-10"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-200">
                <RocketLaunchIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">Bizning hikoyamiz</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight">
                Har bir ayol <span className="font-medium text-primary-600">go'zal</span> ko'rinishi mumkin
              </h2>

              <div className="space-y-4 text-base text-text-secondary font-light leading-relaxed">
                <p>
                  MoonGift 2020-yilda yaratilgan va ayollar uchun zamonaviy, sifatli va arzon narxlardagi
                  kiyimlarni taqdim etishni maqsad qilgan. Biz har bir ayolning o'ziga xos uslubini
                  topishiga yordam beramiz.
                </p>
                <p>
                  Bizning jamoamiz dunyo moda trendlarini kuzatib boradi va sizga eng so'nggi
                  kolleksiyalarni taqdim etadi. Har bir mahsulot diqqat bilan tanlanadi va
                  sifat standartlariga javob beradi.
                </p>
                <p>
                  Bugungi kunda MoonGift — ming minglab ayollarning ishonchli do'koni bo'lib,
                  biz mijozlarimizning har bir ehtiyojini qondirishga intilamiz.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm text-text-primary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight mb-4">
              Missiya va <span className="font-medium text-primary-600">Maqsadlarimiz</span>
            </h2>
            <p className="text-lg text-text-secondary font-light max-w-2xl mx-auto">
              Biz ayollarni o'z-o'ziga ishonchli va go'zal his qilishlariga yordam beramiz
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-8 md:p-10 rounded-2xl border border-primary-200 hover:shadow-soft-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl mb-6 shadow-soft-md">
                <HeartIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-text-primary mb-4">
                Bizning Missiyamiz
              </h3>
              <p className="text-base text-text-secondary font-light leading-relaxed">
                Har bir ayolga o'z uslubini topishga yordam berish va ularni eng sifatli,
                zamonaviy hamda arzon narxlardagi kiyimlar bilan ta'minlash. Biz mijozlarimizning
                ishonchini qozonish va uzoq muddatli munosabatlar o'rnatishga intilamiz.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-accent-50 to-white p-8 md:p-10 rounded-2xl border border-accent-200 hover:shadow-soft-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-600 to-rose-600 rounded-xl mb-6 shadow-soft-md">
                <StarIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-text-primary mb-4">
                Bizning Maqsadimiz
              </h3>
              <p className="text-base text-text-secondary font-light leading-relaxed">
                O'zbekistonda yetakchi onlayn ayollar kiyimlari do'koniga aylanish va
                har bir ayolning sevimli brendi bo'lish. Biz doimiy rivojlanish va
                innovatsiyalar orqali mijozlarimizga eng yaxshi xizmatni taqdim etamiz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight mb-4">
              Bizning <span className="font-medium text-primary-600">Qadriyatlarimiz</span>
            </h2>
            <p className="text-lg text-text-secondary font-light max-w-2xl mx-auto">
              Biz quyidagi tamoyillar asosida ishlaymiz va mijozlarimizga xizmat ko'rsatamiz
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl border border-border-light hover:shadow-soft-lg hover:border-primary-200 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl mb-6 shadow-soft-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-base text-text-secondary font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight mb-4">
              Nima uchun <span className="font-medium text-primary-600">MoonGift?</span>
            </h2>
            <p className="text-lg text-text-secondary font-light max-w-2xl mx-auto">
              Bizning afzalliklarimiz sizning xaridingizni qulayroq qiladi
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-5 rounded-xl border border-border-light hover:shadow-soft-md hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-soft">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-base font-medium text-text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-soft-lg p-10 md:p-16 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-tight">
                O'z uslubingizni toping va <br className="hidden md:block" />
                <span className="font-medium">go'zal ko'rining</span>
              </h2>

              <p className="text-lg text-white/90 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
                Bizning kolleksiyalarimizni ko'rib chiqing va o'zingizga mos keladigan
                kiyimlarni toping. Har qanday savol yoki yordam uchun biz bilan bog'laning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-lg font-medium hover:shadow-soft-hover transition-all duration-300 group"
                >
                  Mahsulotlarni ko'rish
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  Bog'lanish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
