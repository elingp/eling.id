export function toggleClass(element: HTMLElement, className: string) {
	element.classList.toggle(className);
}

export function elementHasClass(element: HTMLElement, className: string) {
	return element.classList.contains(className);
}

const themeValues = new Set(["light", "dark", "system"]);

export type ThemePreference = "light" | "dark" | "system";
export type ThemeResolved = "light" | "dark";

export function rootTheme(): ThemePreference {
	const theme = document.documentElement.getAttribute("data-theme");
	return themeValues.has(theme ?? "") ? (theme as ThemePreference) : "system";
}

export function rootResolvedTheme(): ThemeResolved {
	return document.documentElement.getAttribute("data-theme-resolved") === "dark" ? "dark" : "light";
}

export function rootInDarkMode() {
	return rootResolvedTheme() === "dark";
}
