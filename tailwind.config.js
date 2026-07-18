/**
 * Tailwind theme is driven by CSS custom properties defined in src/styles.css.
 * That file is the single source of truth for colors, spacing, radii, shadows,
 * and typography. Update tokens there; Tailwind utilities read them from here.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1360px' },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary)',
          900: 'var(--color-primary-900)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft:    'var(--color-accent-soft)',
        },
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        surface: 'var(--color-surface)',
        success: 'var(--color-success)',
        danger:  'var(--color-danger)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans:    ['var(--font-body)'],
      },
      fontSize: {
        'hero':       ['var(--fs-1)',    { lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-tight)' }],
        'section':    ['var(--fs-2)',    { lineHeight: 'var(--lh-title)', letterSpacing: 'var(--tracking-tight)' }],
        'card-title': ['var(--fs-3)',    { lineHeight: 'var(--lh-title)', letterSpacing: '-0.01em' }],
        'lede':       ['var(--fs-4)',    { lineHeight: 'var(--lh-body)'  }],
        'body':       ['var(--fs-body)', { lineHeight: 'var(--lh-body)'  }],
        'label':      ['var(--fs-label)',{ lineHeight: '1.4' }],
        'btn':        ['var(--fs-btn)',  { lineHeight: '1.2' }],
        'micro':      ['var(--fs-micro)',{ lineHeight: '1.4' }],
      },
      fontWeight: {
        regular:  'var(--fw-regular)',
        medium:   'var(--fw-medium)',
        semibold: 'var(--fw-semibold)',
        bold:     'var(--fw-bold)',
        extra:    'var(--fw-extra)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)',
        9: 'var(--space-9)',
        10: 'var(--space-10)',
      },
      borderRadius: {
        btn:  'var(--radius-btn)',
        card: 'var(--radius-card)',
        img:  'var(--radius-img)',
        hero: 'var(--radius-hero)',
      },
      boxShadow: {
        soft:    'var(--shadow-soft)',
        card:    'var(--shadow-card)',
        premium: 'var(--shadow-premium)',
        glow:    '0 0 0 6px rgba(67, 160, 71, 0.12)',
      },
      transitionTimingFunction: {
        expo: 'var(--ease-expo)',
      },
      transitionDuration: {
        fast: '180ms',
        base: '300ms',
        slow: '600ms',
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-600) 55%, var(--color-primary-500) 100%)',
        'grad-soft': 'radial-gradient(1200px 600px at 10% -10%, rgba(67,160,71,0.10), transparent 60%), radial-gradient(800px 400px at 100% 0%, rgba(255,179,0,0.10), transparent 60%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'fade-in': { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        'leaf-fall': {
          '0%': { transform: 'translateY(-10vh) translateX(0) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '50%': { transform: 'translateY(50vh) translateX(30px) rotate(180deg)' },
          '100%': { transform: 'translateY(110vh) translateX(-20px) rotate(360deg)', opacity: 0 },
        },
        'progress-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'leaf-fall': 'leaf-fall linear infinite',
        'progress-slide': 'progress-slide 1.4s cubic-bezier(0.4,0,0.2,1) infinite',
        'marquee': 'marquee 35s linear infinite',
      },

    },
  },
  plugins: [],
};
