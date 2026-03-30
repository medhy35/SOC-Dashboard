

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.Dm_vued6.js","_app/immutable/chunks/DC0wr9fT.js","_app/immutable/chunks/C3YBYBU3.js","_app/immutable/chunks/C3g92Rg0.js","_app/immutable/chunks/DHykeTvp.js","_app/immutable/chunks/B-yGf59A.js","_app/immutable/chunks/NIKLzgmk.js","_app/immutable/chunks/DF65ZPah.js","_app/immutable/chunks/D4ryNaG2.js","_app/immutable/chunks/FimB9ZAN.js","_app/immutable/chunks/CudDCbtJ.js","_app/immutable/chunks/C8hQoEWd.js","_app/immutable/chunks/C1yoiFDL.js","_app/immutable/chunks/BnC-LHua.js","_app/immutable/chunks/D0bCpVop.js"];
export const stylesheets = ["_app/immutable/assets/0.BtbCuvd5.css"];
export const fonts = [];
