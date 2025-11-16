function About() {
  return (
    <div className="min-h-screen bg-surface-light py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-4">Biz haqimizda</h1>
          <p className="text-xl text-text-secondary">MoonGift bilan tanishing</p>
        </div>
        <div className="bg-white rounded-button shadow-soft-lg p-10 border-t-4 border-accent">
          <p className="text-lg text-text-secondary mb-6 leading-relaxed">
            <span className="font-bold text-primary text-2xl">MoonGift</span> — zamonaviy lazer texnologiyasidan foydalanib,
            yog'och va boshqa materiallarga yuqori aniqlikdagi ishlov berish xizmatlarini taqdim etuvchi kompaniya.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            Biz har bir buyurtmani maxsus e'tibor bilan bajaramiz va mijozlarimizga eng sifatli mahsulotlarni taqdim etishga intilamiz.
            Sovg'alaringiz noyob va unutilmas bo'lishi uchun biz bilan bog'laning!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
