
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/alerts" | "/blacklist" | "/campaigns" | "/history" | "/investigations" | "/reports" | "/threat";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/alerts": Record<string, never>;
			"/blacklist": Record<string, never>;
			"/campaigns": Record<string, never>;
			"/history": Record<string, never>;
			"/investigations": Record<string, never>;
			"/reports": Record<string, never>;
			"/threat": Record<string, never>
		};
		Pathname(): "/" | "/alerts" | "/blacklist" | "/campaigns" | "/history" | "/investigations" | "/reports" | "/threat";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/data/manifest.json" | "/data/soc_data.json" | "/data/soc_data_2026-03-22.json" | "/data/soc_data_2026-03-23.json" | "/data/soc_data_2026-03-24.json" | "/data/soc_data_2026-03-25.json" | "/data/soc_data_2026-03-26.json" | "/data/soc_data_2026-03-27.json" | "/data/soc_data_2026-03-28.json" | string & {};
	}
}