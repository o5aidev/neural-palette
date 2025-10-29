/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Gradient colors for navigation icons
    'from-violet-500',
    'to-fuchsia-500',
    'from-sky-500',
    'to-cyan-500',
    'from-amber-500',
    'to-rose-500',
    'from-emerald-500',
    'to-teal-500',
    'from-indigo-500',
    'to-blue-500',
    'from-pink-500',
    'to-rose-600',
    'from-slate-600',
    'to-gray-900',
    // Module colors for KPI cards
    'bg-identity',
    'bg-palette',
    'bg-muse',
    'bg-echo',
    'bg-publisher',
    'bg-connector',
    'bg-sentinel',
  ],
  theme: {
    extend: {
      colors: {
        identity: 'oklch(0.497 0.097 264.376)',
        palette: 'oklch(0.573 0.158 257.136)',
        muse: 'oklch(0.646 0.099 264.052)',
        echo: 'oklch(0.597 0.122 162.399)',
        publisher: 'oklch(0.628 0.163 51.567)',
        connector: 'oklch(0.597 0.122 192.177)',
        sentinel: 'oklch(0.577 0.245 27.325)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
