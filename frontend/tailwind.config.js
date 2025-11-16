export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // 🔵 KO'K - Professional, ishonch (logotipdan)
        primary: {
          DEFAULT: '#2C5BA5', // Yumshoq professional ko'k
          50: '#F0F4FA',
          100: '#E3EBF5',
          200: '#C7D7EB',
          300: '#9BB8DC',
          400: '#6A95C9',
          500: '#4A7AB8',
          600: '#2C5BA5', // Main
          700: '#234A87',
          800: '#1A3860',
          900: '#12263E',
        },
        // 🔴 QIZIL - Aksiya, e'tibor (logotipdan)
        accent: {
          DEFAULT: '#DC3545', // To'yingan lekin yumshoq qizil
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC3545', // Main
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // ✨ OLTIN - Premium elementlar (logotipdan)
        gold: {
          DEFAULT: '#DAA520',
          50: '#FEFCF3',
          100: '#FDF8E1',
          200: '#FAF0C3',
          300: '#F5E59E',
          400: '#EDD772',
          500: '#E4C74D',
          600: '#DAA520', // Main goldenrod
          700: '#B8841A',
          800: '#8F6615',
          900: '#6B4C10',
        },
        // 🖤 MATN RANGLARI - Yumshoq qora va kulrang
        text: {
          primary: '#2C3E50',   // Yumshoq qora
          secondary: '#6C757D', // Kulrang
          tertiary: '#ADB5BD',  // Och kulrang
        },
        // ⚪ FON RANGLARI - Oq va juda och kulrang
        surface: {
          white: '#FFFFFF',     // Oq
          light: '#F8F9FA',     // Juda och kulrang
          gray: '#E9ECEF',      // Och kulrang
        },
        // 🎨 BORDER VA SOYALAR
        border: {
          light: '#DEE2E6',     // Juda yumshoq chegara
          DEFAULT: '#CED4DA',   // Oddiy chegara
        },
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.05)',           // Juda yumshoq
        'soft-md': '0 2px 8px rgba(0, 0, 0, 0.05)',        // Yumshoq
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.06)',       // Katta yumshoq
        'soft-hover': '0 6px 20px rgba(0, 0, 0, 0.08)',    // Hover
      },
      borderRadius: {
        'card': '12px',    // Kartalar uchun
        'button': '8px',   // Tugmalar uchun
      },
    },
  },
  plugins: [],
}
