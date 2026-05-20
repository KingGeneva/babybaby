
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				babybaby: {
					blue: '#33C3F0',
					pink: '#FFDEE2',
					cosmic: '#0EA5E9',
					lightblue: '#D3E4FD',
				},
				night: {
					bg: 'hsl(var(--night-bg))',
					surface: 'hsl(var(--night-surface))',
					'surface-2': 'hsl(var(--night-surface-2))',
					foreground: 'hsl(var(--night-foreground))',
					'muted-foreground': 'hsl(var(--night-muted-foreground))',
					border: 'hsl(var(--night-border))',
					accent: 'hsl(var(--night-accent))',
					'accent-foreground': 'hsl(var(--night-accent-foreground))',
					success: 'hsl(var(--night-success))',
					warning: 'hsl(var(--night-warning))',
				},
				cream: 'hsl(var(--cream))',
				'rose-pastel': 'hsl(var(--rose-pastel))',
				'sky-powder': 'hsl(var(--sky-powder))',
				lilac: 'hsl(var(--lilac))',
				sage: 'hsl(var(--sage))',
			},
			fontFamily: {
				comfortaa: ['Comfortaa', 'sans-serif'],
				nunito: ['Nunito', 'sans-serif'],
				serif: ['"Instrument Serif"', 'serif'],
				display: ['"Instrument Serif"', 'serif'],
				body: ['"Work Sans"', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.8" },
				},
				"shimmer": {
					"0%": { backgroundPosition: "-500px 0" },
					"100%": { backgroundPosition: "500px 0" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(10px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"bounce-soft": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 6s ease-in-out infinite",
				"pulse-soft": "pulse-soft 3s ease-in-out infinite",
				"shimmer": "shimmer 2s infinite linear",
				"scale-in": "scale-in 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"fade-in-up": "fade-in-up 0.5s ease-out",
				"bounce-soft": "bounce-soft 2s ease-in-out infinite"
			},
			backgroundImage: {
				'cosmic-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
				'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
				'pink-blue-gradient': 'linear-gradient(135deg, #FFDEE2 0%, #33C3F0 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
