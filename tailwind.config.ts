import type { Config } from "tailwindcss";

export default {
	plugins: [require("@tailwindcss/typography")],
	theme: {
		extend: {
			typography: () => ({
				DEFAULT: {
					css: {
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
								textDecorationStyle: "dotted",
								backgroundColor: "color-mix(in oklch, var(--color-link) 10%, transparent)",
							},
						},
						blockquote: {
							fontStyle: "normal",
							quotes: "none",
						},
						code: {
							border: "1px dotted #666",
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
							borderTop: "1px dashed #666",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							borderBottom: "1px dashed #666",
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
						// Mobile: body=18px, h2=28px, h3=22px, h4=18px (inherits body)
						h2: {
							fontSize: "1.75rem", // 28px (default: 30px)
						},
						h3: {
							fontSize: "1.375rem", // 22px (default: 24px)
						},
						figcaption: {
							fontSize: "0.875rem", // 14px (text-sm)
						},
					},
				},
				xl: {
					css: {
						// Desktop: body=20px, h2=32px, h3=26px, h4=20px (inherits body)
						h2: {
							fontSize: "2rem", // 32px (default: 36px)
						},
						h3: {
							fontSize: "1.625rem", // 26px (default: 30px)
						},
						figcaption: {
							fontSize: "1rem", // 16px (text-base)
						},
					},
				},
			}),
		},
	},
} satisfies Config;
