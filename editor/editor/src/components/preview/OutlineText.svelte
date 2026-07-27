<!-- Outlined text matching Ren'Py label/button text styling: a font, a fill
     color and one or more outline layers (width + color). -->
<script lang="ts">
	import type { Snippet } from "svelte";

	import { outlineShadows } from "#lib/preview/outline";

	type Font = "menu" | "main" | "option" | "music" | "calendar";

	let {
		size,
		color,
		outlines = [],
		font = "menu",
		children
	}: {
		size: number;
		color: string;
		outlines?: [color: string, radius: number][];
		font?: Font;
		children: Snippet;
	} = $props();

	const fontClass: Record<Font, string> = {
		menu: "preview-name-font",
		main: "preview-font",
		option: "preview-option-font",
		music: "preview-music-font",
		calendar: "preview-calendar-font"
	};
</script>

<span
	class={fontClass[font]}
	style:font-size="{size}px"
	style:line-height="1"
	style:color
	style:text-shadow={outlines.length ? outlineShadows(outlines) : "none"}
>
	{@render children()}
</span>
