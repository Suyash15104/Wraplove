/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:    { DEFAULT: '#FAF7F2', 50: '#FEFCFA', 100: '#FAF7F2', 200: '#F5EFE5' },
        beige:    { DEFAULT: '#F0EAE0', 100: '#F0EAE0', 200: '#E5DDD0', 300: '#D5C9B8' },
        blush:    { DEFAULT: '#F2C4CE', 100: '#FFF0F3', 200: '#F9D9E0', 300: '#F2C4CE', 400: '#E89AAC' },
        rose:     { DEFAULT: '#E8849A', 100: '#FCE8EE', 200: '#F4BDCC', 300: '#E8849A', 400: '#D9718A', 500: '#C5546E' },
        lavender: { DEFAULT: '#DDD6F3', 100: '#F5F0FF', 200: '#EDE7FA', 300: '#DDD6F3', 400: '#C4B8E8' },
        mauve:    { DEFAULT: '#9B8EC4', 100: '#EDE8F8', 200: '#CBBFEB', 300: '#9B8EC4', 400: '#7A6AA8' },
        sage:     { DEFAULT: '#C8D8C0', 100: '#EFF5EC', 200: '#DCEBD5', 300: '#C8D8C0', 400: '#A8BF9E' },
        gold:     { DEFAULT: '#C9A84C', 100: '#FDF5E0', 200: '#F5E0A0', 300: '#C9A84C', 400: '#A88530' },
        brand: {
          cream:    '#FAF7F2',
          beige:    '#F0EAE0',
          blush:    '#F2C4CE',
          rose:     '#E8849A',
          lavender: '#DDD6F3',
          mauve:    '#9B8EC4',
          sage:     '#C8D8C0',
          gold:     '#C9A84C',
          dark:     '#2C1F14',
          muted:    '#7A6652',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4rem',    { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem',  { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem',    { lineHeight: '1.25' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':   '0 4px 24px rgba(44, 31, 20, 0.08)',
        'card':   '0 8px 32px rgba(44, 31, 20, 0.10)',
        'hover':  '0 16px 48px rgba(44, 31, 20, 0.14)',
        'glow':   '0 0 40px rgba(232, 132, 154, 0.25)',
        'glow-lg':'0 0 80px rgba(232, 132, 154, 0.18)',
        'inner-soft': 'inset 0 2px 8px rgba(44, 31, 20, 0.06)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #F2C4CE 0%, #DDD6F3 100%)',
        'gradient-hero':  'linear-gradient(135deg, #FFF5F8 0%, #F3EEF8 50%, #EFF5EC 100%)',
        'gradient-warm':  'linear-gradient(135deg, #FAF7F2 0%, #F0EAE0 100%)',
        'gradient-gold':  'linear-gradient(135deg, #C9A84C 0%, #E8D080 50%, #C9A84C 100%)',
      },
      animation: {
        'float':          'float 6s ease-in-out infinite',
        'float-slow':     'float 8s ease-in-out infinite',
        'float-delayed':  'float 6s ease-in-out 2s infinite',
        'pulse-soft':     'pulse-soft 3s ease-in-out infinite',
        'slide-up':       'slide-up 0.5s ease forwards',
        'slide-down':     'slide-down 0.35s ease forwards',
        'fade-in':        'fade-in 0.4s ease forwards',
        'scale-in':       'scale-in 0.3s ease forwards',
        'shimmer':        'shimmer 2s infinite',
        'spin-slow':      'spin 8s linear infinite',
        'wiggle':         'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':       { transform: 'translateY(-12px) rotate(-1deg)' },
          '66%':       { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%':       { transform: 'rotate(-5deg)' },
          '75%':       { transform: 'rotate(5deg)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
