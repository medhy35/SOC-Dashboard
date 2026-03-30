export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["data/manifest.json","data/soc_data.json","data/soc_data_2026-03-22.json","data/soc_data_2026-03-23.json","data/soc_data_2026-03-24.json","data/soc_data_2026-03-25.json","data/soc_data_2026-03-26.json","data/soc_data_2026-03-27.json","data/soc_data_2026-03-28.json"]),
	mimeTypes: {".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DP6d-uBW.js",app:"_app/immutable/entry/app.DsnE1zcM.js",imports:["_app/immutable/entry/start.DP6d-uBW.js","_app/immutable/chunks/FimB9ZAN.js","_app/immutable/chunks/C3YBYBU3.js","_app/immutable/chunks/DHykeTvp.js","_app/immutable/entry/app.DsnE1zcM.js","_app/immutable/chunks/CeKXU4Rk.js","_app/immutable/chunks/C3YBYBU3.js","_app/immutable/chunks/DC0wr9fT.js","_app/immutable/chunks/DHykeTvp.js","_app/immutable/chunks/B-yGf59A.js","_app/immutable/chunks/BnC-LHua.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/alerts",
				pattern: /^\/alerts\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/blacklist",
				pattern: /^\/blacklist\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/campaigns",
				pattern: /^\/campaigns\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/history",
				pattern: /^\/history\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/investigations",
				pattern: /^\/investigations\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/reports",
				pattern: /^\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/threat",
				pattern: /^\/threat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
