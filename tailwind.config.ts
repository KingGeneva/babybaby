
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
			boxShadow: {
				premium: 'var(--shadow-premium)',
			},
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
				sage: 'hsl(var(--sage))',
				peach: 'hsl(var(--peach))',
				champagne: 'hsl(var(--champagne))',
				deep: 'hsl(var(--deep))',
				'surface-warm': 'hsl(var(--surface-warm))',
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
					blue: 'hsl(var(--sage))',
					pink: 'hsl(var(--peach))',
					cosmic: 'hsl(var(--primary))',
					lightblue: 'hsl(var(--muted))',
				}
			},
			fontFamily: {
				comfortaa: ['"DM Serif Display"', 'Georgia', 'serif'],
				nunito: ['"Fira Sans"', 'system-ui', 'sans-serif'],
				display: ['"DM Serif Display"', 'Georgia', 'serif'],
				body: ['"Fira Sans"', 'system-ui', 'sans-serif'],
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
				'cosmic-gradient': 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--sage)))',
				'glass-gradient': 'linear-gradient(135deg, hsl(var(--card) / .75), hsl(var(--background) / .45))',
				'pink-blue-gradient': 'linear-gradient(135deg, hsl(var(--peach)), hsl(var(--sage)))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
