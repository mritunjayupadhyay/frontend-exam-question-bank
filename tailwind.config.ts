// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        surfaceVariant: 'var(--surface-variant)',
        surfaceContainer: 'var(--surface-container)',
        surfaceContainerLow: 'var(--surface-container-low)',
      },
      minWidth: {
        '1150': '1150px',
      },
    },
  },
}
export default config
