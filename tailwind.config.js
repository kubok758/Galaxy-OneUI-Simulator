/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { samsung: ['SamsungOne', 'Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { oneui: '28px' },
      boxShadow: { oneui: '0 18px 50px rgba(0,0,0,.35)' }
    }
  },
  plugins: []
};
