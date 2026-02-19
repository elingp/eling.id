declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}

interface Window {
	__backToTopInit?: boolean;
	__formattedDateInit?: boolean;
	__themeProviderInit?: boolean;
}
