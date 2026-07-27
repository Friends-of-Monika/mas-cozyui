<!-- MASCalendar preview over the dimmed room: panel, month/year selectors,
     weekday header and a 6x7 day grid. Surfaces are the calendar SVG replacers
     (-n variants in night mode); labels use the theme's calendar font. Layout
     coordinates mirror MASCalendar's blit offsets on the 1280x720 stage. -->
<script lang="ts">
	import { backgrounds } from "#lib/preview/backgrounds";
	import { STAGE_H, STAGE_W } from "#lib/preview/layout";
	import { theme } from "#lib/preview/theme.svelte";

	import OutlineText from "../OutlineText.svelte";
	import RealAsset from "../RealAsset.svelte";
	import Stage from "../Stage.svelte";

	const skyMask = $derived(theme.darkMode ? backgrounds.skyNight : backgrounds.skyDay);
	const room = $derived(theme.darkMode ? backgrounds.roomNight : backgrounds.roomDay);

	// Night mode uses the -n asset variant (the calendar's own naming, not
	// RealAsset's _d), so the suffix is spelled out in each path.
	const n = $derived(theme.darkMode ? "-n" : "");
	const cal = "replacers/mod_assets/calendar";

	// Geometry, straight from MASCalendar (all in stage px).
	const BG_X = 190;
	const BG_Y = 103;
	const INIT_X = 192;
	const INIT_Y = 155;
	const INTERNAL_W = 896; // DAY_BUTTON_WIDTH * 7
	const DAY_W = 128;
	const DAY_H = 65;
	const NAME_H = 35;
	const NAME_ROW_Y = INIT_Y + NAME_H; // 190
	const GRID_Y = INIT_Y + NAME_H * 2; // 225
	const ARROW = 20;
	const SELECTOR_Y = INIT_Y + 10; // arrow row
	const LABEL_Y = INIT_Y + 8; // month/year label row

	// Title is white by day, black by night (MAS hardcodes this); every other
	// label uses the theme's calendar text color.
	const titleColor = $derived(theme.darkMode ? "#000000" : "#ffffff");
	const ink = $derived(theme.calendarTextColor);

	// Weekday header, Monday-first (matches the game's configured week start).
	const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	// A representative month (July 2026): leading June + trailing August days are
	// disabled, the 27th is "today".
	type Kind = "day" | "today" | "disabled";
	type Cell = { n: number; kind: Kind };
	const d = (n: number): Cell => ({ n, kind: "day" });
	const off = (n: number): Cell => ({ n, kind: "disabled" });
	const rows: Cell[][] = [
		[off(29), off(30), d(1), d(2), d(3), d(4), d(5)],
		[d(6), d(7), d(8), d(9), d(10), d(11), d(12)],
		[d(13), d(14), d(15), d(16), d(17), d(18), d(19)],
		[d(20), d(21), d(22), d(23), d(24), d(25), d(26)],
		[{ n: 27, kind: "today" }, d(28), d(29), d(30), d(31), off(1), off(2)],
		[off(3), off(4), off(5), off(6), off(7), off(8), off(9)]
	];

	const cellBg: Record<Kind, string> = {
		day: "calendar_day_bg",
		today: "calendar_today_bg",
		disabled: "calendar_day_disabled_bg"
	};
	// In-month day/today cells are buttons and brighten on hover; the greyed
	// out-of-month (disabled) cells are not hoverable.
	const cellHoverBg: Record<Kind, string> = {
		day: "calendar_day_hover_bg",
		today: "calendar_today_hover_bg",
		disabled: "calendar_day_disabled_bg"
	};

	// The close and month/year arrow buttons brighten to their _hover asset while
	// pointed at (MASButtonDisplayable hover state).
	let hovered = $state<string | null>(null);
	// Which day cell is hovered (row-col), so it can swap to its hover asset.
	let hoveredCell = $state<string | null>(null);
	const cellAsset = (kind: Kind, id: string) =>
		kind !== "disabled" && hoveredCell === id ? cellHoverBg[kind] : cellBg[kind];
</script>

<!-- A hoverable button that swaps to its _hover asset while pointed at. -->
{#snippet hoverBtn(id: string, base: string, left: number, top: number, w: number, h: number)}
	<div
		role="presentation"
		class="absolute"
		style:left="{left}px"
		style:top="{top}px"
		onpointerenter={() => (hovered = id)}
		onpointerleave={() => (hovered = null)}
	>
		<RealAsset path="{cal}/{base}{hovered === id ? '_hover' : ''}{n}.svg" width={w} height={h} />
	</div>
{/snippet}

<Stage>
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<!-- Modal mask: Solid("#000000B2") over the whole stage -->
	<div class="absolute inset-0" style:background="#000000B2"></div>

	<!-- Calendar background panel (900x514) -->
	<div class="absolute" style:left="{BG_X}px" style:top="{BG_Y}px">
		<RealAsset path="{cal}/calendar_bg{n}.svg" width={900} height={514} />
	</div>

	<!-- Close button (X glyph blanked by CozyUI) -->
	{@render hoverBtn("close", "calendar_close", 1041, 60, 74, 74)}

	<!-- Title, centered over the internal area -->
	<div
		class="absolute flex justify-center"
		style:left="{INIT_X}px"
		style:top="115px"
		style:width="{INTERNAL_W}px"
	>
		<OutlineText size={33} color={titleColor} font="calendar">Calendar</OutlineText>
	</div>

	<!-- Month selector: < July > centered in a 250px band at INIT_X+100 -->
	{@render hoverBtn("m<", "calendar_left_arrow", INIT_X + 100, SELECTOR_Y, ARROW, ARROW)}
	{@render hoverBtn("m>", "calendar_right_arrow", INIT_X + 330, SELECTOR_Y, ARROW, ARROW)}
	<div
		class="pointer-events-none absolute flex justify-center"
		style:left="{INIT_X + 100}px"
		style:top="{LABEL_Y}px"
		style:width="250px"
	>
		<OutlineText size={21} color={ink} font="calendar">July</OutlineText>
	</div>

	<!-- Year selector: < 2026 > centered in a 250px band at the internal right -->
	{@render hoverBtn("y<", "calendar_left_arrow", INIT_X + INTERNAL_W - ARROW - 330, SELECTOR_Y, ARROW, ARROW)}
	{@render hoverBtn("y>", "calendar_right_arrow", INIT_X + INTERNAL_W - ARROW - 100, SELECTOR_Y, ARROW, ARROW)}
	<div
		class="pointer-events-none absolute flex justify-center"
		style:left="{INIT_X + INTERNAL_W - 350}px"
		style:top="{LABEL_Y}px"
		style:width="250px"
	>
		<OutlineText size={21} color={ink} font="calendar">2026</OutlineText>
	</div>

	<!-- Weekday header row -->
	{#each dayNames as name, i (name)}
		<div class="absolute" style:left="{INIT_X + i * DAY_W}px" style:top="{NAME_ROW_Y}px">
			<RealAsset path="{cal}/calendar_day_name_bg{n}.svg" width={DAY_W} height={NAME_H} />
			<div class="absolute inset-0 flex items-center justify-center">
				<OutlineText size={17} color={ink} font="calendar">{name}</OutlineText>
			</div>
		</div>
	{/each}

	<!-- 6x7 day grid. In-month cells are buttons (hover); disabled ones are not. -->
	{#each rows as row, i (i)}
		{#each row as cell, j (j)}
			<div
				role="presentation"
				class="absolute"
				style:left="{INIT_X + j * DAY_W}px"
				style:top="{GRID_Y + i * DAY_H}px"
				onpointerenter={() => cell.kind !== "disabled" && (hoveredCell = `${i}-${j}`)}
				onpointerleave={() => (hoveredCell = null)}
			>
				<RealAsset path="{cal}/{cellAsset(cell.kind, `${i}-${j}`)}{n}.svg" width={DAY_W} height={DAY_H} />
				<!-- day number, right-aligned near the top (pos 121,5 xanchor 1.0) -->
				<div class="absolute" style:right="7px" style:top="5px">
					<OutlineText size={13} color={ink} font="calendar">{cell.n}</OutlineText>
				</div>
			</div>
		{/each}
	{/each}
</Stage>
