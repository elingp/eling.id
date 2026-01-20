import type { Config } from "tailwindcss";

export default {
	plugins: [require("@tailwindcss/typography")],
	theme: {
		extend: {
			typography: () => ({
				DEFAULT: {
					css: {
						lineHeight: "1.5",
						"[class~='lead']": {
							lineHeight: "1.55",
						},
						a: {
							textDecoration: "underline",
							textDecorationColor: "var(--color-link)",
							textUnderlineOffset: "2px",
							"&:hover": {
								"@media (hover: hover)": {
									textDecorationThickness: "2px",
								},
							},
							"&:active": {
								backgroundColor: "color-mix(in oklch, var(--color-link) 10%, transparent)",
							},
						},
						blockquote: {
							fontStyle: "normal",
							quotes: "none",
						},
						code: {
							border: "1px dotted var(--color-border)",
							borderRadius: "2px",
						},
						kbd: {
							"&:where([data-theme='dark'], [data-theme='dark'] *)": {
								background: "var(--color-global-text)",
							},
						},
						hr: {
							borderTopStyle: "dashed",
						},
						strong: {
							fontWeight: "700",
						},
						sup: {
							marginInlineStart: "calc(var(--spacing) * 0.5)",
							a: {
								"&:after": {
									content: "']'",
								},
								"&:before": {
									content: "'['",
								},
								"&:hover": {
									"@media (hover: hover)": {
										color: "var(--color-link)",
									},
								},
							},
						},
						/* Table */
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							borderTop: "1px dashed var(--color-border-active)",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							borderBottom: "1px dashed var(--color-border-active)",
							fontWeight: "700",
						},
						'th[align="center"], td[align="center"]': {
							"text-align": "center",
						},
						'th[align="right"], td[align="right"]': {
							"text-align": "right",
						},
						'th[align="left"], td[align="left"]': {
							"text-align": "left",
						},
						".expressive-code, .admonition, .github-card": {
							marginTop: "calc(var(--spacing)*4)",
							marginBottom: "calc(var(--spacing)*4)",
						},
					},
				},
				lg: {
					css: {
						lineHeight: "1.5",
						"[class~='lead']": {
							lineHeight: "1.55",
						},
						// Mobile: body=18px, h2=28px, h3=22px, h4=18px (inherits body)
						h2: {
							fontSize: "1.75rem", // 28px (default: 30px)
						},
						h3: {
							fontSize: "1.375rem", // 22px (default: 24px)
						},
						figcaption: {
							fontSize: "0.875rem", // 14px (text-sm)
							lineHeight: "1.45",
						},
					},
				},
				xl: {
					css: {
						lineHeight: "1.5",
						"[class~='lead']": {
							lineHeight: "1.55",
						},
						// Desktop: body=20px, h2=32px, h3=26px, h4=20px (inherits body)
						h2: {
							fontSize: "2rem", // 32px (default: 36px)
						},
						h3: {
							fontSize: "1.625rem", // 26px (default: 30px)
						},
						figcaption: {
							fontSize: "1rem", // 16px (text-base)
							lineHeight: "1.45",
						},
					},
				},
			}),
		},
	},
} satisfies Config;
