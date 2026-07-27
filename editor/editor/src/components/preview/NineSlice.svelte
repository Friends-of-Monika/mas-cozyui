<!-- Renders a theme SVG as a CSS border-image 9-slice, matching Ren'Py's
     Frame(asset, Borders(...)). The slice tracks the rounding so corners stay
     clean at any size. Uses the _d dark variant in night mode when present. -->
<script lang="ts">
	import { groupForPath } from "#lib/preview/colors";
	import { theme } from "#lib/preview/theme.svelte";
	import { applyMacros, buttonSlice } from "#lib/theme/macros";
	import { themeParams } from "#lib/theme/params.svelte";
	import { loadSvg, svgLoaders } from "#lib/theme/templates.svelte";

	let {
		path,
		width,
		height,
		slice: sliceOverride
	}: { path: string; width?: number; height?: number; slice?: number } = $props();

	const resolved = $derived.by(() => {
		if (theme.darkMode) {
			const dark = path.replace(/\.svg$/, "_d.svg");
			if (svgLoaders[dark]) return dark;
		}
		return path;
	});

	const src = $derived.by(() => {
		const template = loadSvg(resolved);
		if (!template) return "";
		const svg = applyMacros(template, themeParams(), groupForPath(resolved));
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	});

	const slice = $derived(sliceOverride ?? buttonSlice(theme.buttonRounding));
</script>

{#if src}
	<div
		style:width={width ? `${width}px` : "100%"}
		style:height={height ? `${height}px` : "100%"}
		style:box-sizing="border-box"
		style:border="{slice}px solid transparent"
		style:border-image={`url("${src}") ${slice} fill / ${slice}px stretch`}
	></div>
{/if}
