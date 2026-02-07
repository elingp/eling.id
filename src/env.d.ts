declare module "@pagefind/default-ui" {
	declare class PagefindUI {
		constructor(arg: unknown);
	}
}

interface Window {
	__themeProviderInit?: boolean;
	__twitterPostInit?: boolean;
	__formattedDateInit?: boolean;
	__backToTopInit?: boolean;
}
