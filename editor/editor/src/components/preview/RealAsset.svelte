<!-- Renders an actual CozyUI theme SVG template (mod/theme/**) with the live
     theme baked in via the CUI_* macro engine. Emitted as a self-contained
     data: URI so multiple assets on the page don't clash on shared element
     ids, and so the same output can be rasterized for export. In night mode
     the matching _d dark variant is used when present. -->
<script lang="ts">
	import { groupForPath } from "#lib/preview/colors";
	import { theme } from "#lib/preview/theme.svelte";
	import { applyMacros } from "#lib/theme/macros";
	import { themeParams } from "#lib/theme/params.svelte";
	import { loadSvg, svgLoaders } from "#lib/theme/templates.svelte";

	let {
		path,
		width,
		height,
		class: cls = ""
	}: { path: string; width?: number; height?: number; class?: string } = $props();

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
		let svg = applyMacros(template, themeParams(), groupForPath(resolved));
		// Give a viewBox + preserveAspectRatio="none" so the SVG stretches to the
		// <img> box the same way in every browser. Without a viewBox, Firefox
		// letterboxes a resized SVG (Chrome stretches it), which pushed e.g. the
		// slider line off-center.
		if (!/\bviewBox=/.test(svg)) {
			const w = svg.match(/<svg[^>]*\bwidth="([\d.]+)"/)?.[1];
			const h = svg.match(/<svg[^>]*\bheight="([\d.]+)"/)?.[1];
			if (w && h) {
				svg = svg.replace(/<svg\b/, `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"`);
			}
		}
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	});
</script>

{#if src}
	<!-- block avoids the inline-image baseline gap that shifts assets off-center -->
	<img {src} alt="" {width} {height} class="block {cls}" />
{/if}
