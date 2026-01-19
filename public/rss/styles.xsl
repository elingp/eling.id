<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
	version="3.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom"
	xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<xsl:output method="html" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<xsl:variable
			name="site_url"
			select="(/rss/channel/link, /rss/channel/atom:link[@rel='alternate']/@href)[1]" />
		<xsl:variable
			name="feed_url"
			select="(
				/rss/channel/atom:link[@rel='self']/@href,
				/rss/channel/atom:link[not(@rel)]/@href,
				/rss/channel/link
			)[1]" />
		<html lang="en" data-theme="light">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="referrer" content="strict-origin-when-cross-origin" />
				<meta name="color-scheme" content="dark light" />
				<title>
					<xsl:value-of select="/rss/channel/title" />
				</title>
				<style>
					:root {
						--bg: oklch(98.48% 0 0);
						--surface: oklch(99.2% 0 0);
						--text: oklch(26.99% 0.0096 235.05);
						--muted: color-mix(in oklch, var(--text) 75%, white);
						--accent: oklch(69.44% 0.1812 47.58);
						--accent-2: oklch(18.15% 0 0);
						--button-text: var(--accent-2);
						--border: color-mix(in oklch, var(--text) 15%, white);
						--input-bg: oklch(96.5% 0 0);
						--shadow: 0 10px 30px rgba(16, 24, 40, 0.12);
						color-scheme: light;
					}
					html[data-theme="dark"] {
						--bg: oklch(23.64% 0.0045 248);
						--surface: oklch(27% 0.0045 248);
						--text: oklch(83.54% 0 264);
						--muted: color-mix(in oklch, var(--text) 70%, black);
						--accent: oklch(76.62% 0.1369 52.94);
						--accent-2: oklch(94.66% 0 0);
						--button-text: oklch(18.15% 0 0);
						--border: color-mix(in oklch, var(--text) 18%, black);
						--input-bg: oklch(25% 0.0045 248);
						--shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
						color-scheme: dark;
					}
					* {
						box-sizing: border-box;
					}
					body {
						margin: 0;
						font-family: "Source Sans 3", system-ui, -apple-system, Segoe UI, sans-serif;
						background: var(--bg);
						color: var(--text);
						line-height: 1.6;
					}
					main {
						max-width: 900px;
						margin: 0 auto;
						padding: 3rem 1.5rem 4rem;
					}
					header {
						background: var(--surface);
						border: 1px solid var(--border);
						padding: 1.75rem 2rem;
						border-radius: 16px;
						box-shadow: var(--shadow);
						margin-bottom: 2rem;
					}
					.header-top {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 1rem;
						flex-wrap: wrap;
					}
					h1 {
						font-size: clamp(1.7rem, 3vw, 2.4rem);
						margin: 0 0 0.75rem 0;
						display: flex;
						align-items: center;
						gap: 0.6rem;
						line-height: 1.15;
					}
					h1 img {
						margin-top: 0;
						flex-shrink: 0;
					}
					a {
						color: var(--accent);
						text-decoration: none;
					}
					a:hover,
					a:focus {
						text-decoration: underline;
					}
					p {
						margin: 0.75rem 0;
					}
					.feed-url {
						display: flex;
						flex-wrap: wrap;
						gap: 0.75rem;
						align-items: center;
					}
					button {
						appearance: none;
						border: 1px solid transparent;
						background: var(--accent);
						color: var(--button-text);
						padding: 0.6rem 1rem;
						border-radius: 999px;
						font-weight: 600;
						cursor: pointer;
						transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
					}
					button:hover {
						background: color-mix(in oklch, var(--accent) 88%, var(--text));
					}
					button:focus-visible {
						outline: 2px solid var(--accent);
						outline-offset: 2px;
					}
					button:active {
						background: color-mix(in oklch, var(--accent) 80%, var(--text));
					}
					button.copied,
					button.secondary {
						background: transparent;
						color: var(--text);
						border-color: var(--accent);
					}
					button.secondary:hover {
						background: color-mix(in oklch, var(--accent) 12%, transparent);
						color: var(--accent);
					}
					button.secondary:active {
						background: color-mix(in oklch, var(--accent) 18%, transparent);
					}
					@media (max-width: 640px) {
						main {
							padding: 2.25rem 1.25rem 3rem;
						}
						.header-top {
							align-items: flex-start;
						}
						button {
							width: 100%;
							justify-content: center;
						}
						.feed-url {
							width: 100%;
						}
					}
					#copy-status {
						color: var(--muted);
						font-size: 0.9rem;
					}
					.feed-items {
						display: grid;
						gap: 1rem;
					}
					details {
						background: var(--surface);
						border: 1px solid var(--border);
						border-radius: 14px;
						padding: 1rem 1.25rem;
					}
					summary {
						cursor: pointer;
						font-weight: 600;
						list-style: none;
					}
					summary::-webkit-details-marker {
						display: none;
					}
					summary .meta {
						color: var(--muted);
						font-size: 0.9rem;
						font-weight: 400;
					}
					footer {
						margin-top: 2rem;
						color: var(--muted);
						font-size: 0.9rem;
						text-align: center;
					}
				</style>
			</head>
			<body>
				<main>
					<header>
						<div class="header-top">
							<h1>
								<img
									alt="RSS"
									src="https://www.vectorlogo.zone/logos/rss/rss-tile.svg"
									width="28"
									height="28"
									loading="lazy"
									decoding="async" />
								<xsl:value-of select="/rss/channel/title" />
							</h1>
							<button class="secondary" type="button" id="theme-toggle" aria-pressed="false">
								Toggle theme
							</button>
						</div>
						<p>
							<xsl:value-of select="/rss/channel/description" />
						</p>
						<p>
							This is the RSS feed for the
							<a href="{$site_url}">
								<xsl:value-of select="/rss/channel/title" />
							</a>
							website. It is intended for feed readers.
						</p>
						<div class="feed-url">
							<button type="button" data-copy-feed="true" data-feed-url="{$feed_url}">
								Copy feed URL
							</button>
							<span id="copy-status" role="status" aria-live="polite"></span>
						</div>
					</header>

					<section class="feed-items" aria-label="Feed items">
						<xsl:for-each select="/rss/channel/item">
							<details>
								<summary>
									<a href="{link}">
										<xsl:value-of select="title" />
									</a>
									<span class="meta"> — <time datetime="{pubDate}"><xsl:value-of select="pubDate" /></time></span>
								</summary>
								<xsl:choose>
									<xsl:when test="normalize-space(description) != ''">
										<xsl:value-of select="description" disable-output-escaping="yes" />
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="content:encoded" disable-output-escaping="yes" />
									</xsl:otherwise>
								</xsl:choose>
							</details>
						</xsl:for-each>
					</section>
					<p><xsl:value-of select="count(/rss/channel/item)" /> items.</p>
					<footer>
						Feed styled locally · No tracking scripts
					</footer>
				</main>
				<script><![CDATA[
					(() => {
						const root = document.documentElement;
						const toggle = document.getElementById("theme-toggle");
						const storedTheme = localStorage.getItem("rss-theme");
						const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
						const setTheme = (mode) => {
							root.setAttribute("data-theme", mode);
							toggle.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
							localStorage.setItem("rss-theme", mode);
						};
						setTheme(storedTheme || (preferDark ? "dark" : "light"));
						toggle.addEventListener("click", () => {
							const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
							setTheme(next);
						});

						const button = document.querySelector("[data-copy-feed]");
						const status = document.getElementById("copy-status");
						const feedUrl = button.getAttribute("data-feed-url") || window.location.href;
						button.addEventListener("click", async () => {
							await navigator.clipboard.writeText(feedUrl);
							status.textContent = "Copied!";
							button.classList.add("copied");
						});
					})();
				]]></script>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
