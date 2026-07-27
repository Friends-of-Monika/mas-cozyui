<!-- Game-menu background for the settings screen: a full-screen fill + themed
     pattern, a white wash over the room, and the big off-screen circle that
     forms the curved left panel. -->
<script lang="ts">
	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { palette } from "#lib/preview/palette.svelte";
	import { theme } from "#lib/preview/theme.svelte";

	import PatternShapes from "../PatternShapes.svelte";
</script>

<svg
	class="absolute inset-0"
	width={STAGE_W}
	height={STAGE_H}
	viewBox="0 0 {STAGE_W} {STAGE_H}"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<PatternShapes idPrefix="menu" />
		<!-- menu_bg.svg: 200x200 tile, two shapes at (0,0) and (100,100) scale 80 -->
		<pattern id="menu-pattern" x="-40" y="-140" width="200" height="200" patternUnits="userSpaceOnUse">
			<g fill={palette.menuBgPattern()} stroke-linejoin="round">
				<use href="#menu-{theme.menuPatternShape}" transform="translate(0 0) scale(80)" />
				<use href="#menu-{theme.menuPatternShape}" transform="translate(100 100) scale(80)" />
			</g>
		</pattern>
	</defs>

	<!-- Patterned background -->
	<rect width={STAGE_W} height={STAGE_H} fill={palette.menuBgFill()} />
	<rect width={STAGE_W} height={STAGE_H} fill="url(#menu-pattern)" />

	<!-- game_menu overlay: wash + curved left panel (circle mostly off-screen;
	     its right edge sweeps through the visible area) -->
	<rect width={STAGE_W} height={STAGE_H} fill={palette.menuWash()} fill-opacity="0.5" />
	<circle
		cx="-995"
		cy="360"
		r="1290"
		fill={palette.menuPanelFill()}
		stroke={palette.menuPanelStroke()}
		stroke-width="30"
	/>
</svg>
