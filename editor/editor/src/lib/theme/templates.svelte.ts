// Raw CozyUI theme templates (mod/theme/**). Loaded lazily so Vite splits
// each into its own chunk - they then fetch in parallel and stay out of the
// main bundle. Keys are paths relative to mod/theme, e.g.
// "replacers/gui/textbox_monika.svg".
type Loaders = Record<string, () => Promise<string>>;

function keyed(glob: Record<string, () => Promise<unknown>>): Loaders {
	const out: Loaders = {};
	for (const [path, loader] of Object.entries(glob)) {
		const key = path.split("/mod/theme/")[1];
		if (key) out[key] = loader as () => Promise<string>;
	}
	return out;
}

export const svgLoaders = keyed(import.meta.glob("$theme/**/*.svg", { query: "?raw", import: "default" }));
export const rpyLoaders = keyed(import.meta.glob("$theme/**/*.rpy", { query: "?raw", import: "default" }));
export const jsonLoaders = keyed(import.meta.glob("$theme/**/*.json", { query: "?raw", import: "default" }));
export const glitchLoaders = keyed(import.meta.glob("$theme/**/*.glitch", { query: "?raw", import: "default" }));

// Reactive cache backing the live preview: reading a not-yet-loaded template
// kicks off its (parallel) fetch and returns undefined until it resolves, at
// which point the $state update re-renders whoever read it.
const cache = $state<Record<string, string>>({});
const inFlight = new Set<string>();

export function loadSvg(path: string): string | undefined {
	if (cache[path] !== undefined) return cache[path];
	if (!inFlight.has(path) && svgLoaders[path]) {
		inFlight.add(path);
		svgLoaders[path]().then((content) => {
			cache[path] = content;
		});
	}
	return cache[path];
}

/** Loads every template of a kind in parallel, reporting completion counts. */
export async function loadAll(
	loaders: Loaders,
	onEach?: (done: number, total: number) => void
): Promise<Record<string, string>> {
	const entries = Object.entries(loaders);
	const total = entries.length;
	let done = 0;
	const results = await Promise.all(
		entries.map(async ([key, loader]) => {
			const content = await loader();
			onEach?.(++done, total);
			return [key, content] as const;
		})
	);
	return Object.fromEntries(results);
}
