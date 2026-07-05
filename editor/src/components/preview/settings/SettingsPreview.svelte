<!-- MAS settings (preferences) screen preview, themed live. Layout mirrors the
     in-game screen: curved nav panel on the left, three checkbox groups over a
     two-column slider block, bottom action buttons and a version tag. -->
<script lang="ts">
	import { palette } from "#lib/preview/palette.svelte";

	import OutlineText from "../OutlineText.svelte";
	import Stage from "../Stage.svelte";

	import CheckItem from "./CheckItem.svelte";
	import MenuBackground from "./MenuBackground.svelte";
	import NavColumn from "./NavColumn.svelte";
	import SettingsSlider from "./SettingsSlider.svelte";

	// menu_label styling reused for section and slider labels
	const labelColor = $derived(palette.labelColor());
	const labelOutlines = $derived<[string, number][]>([
		[palette.labelOutline(), 3],
		[palette.labelOutline(), 1]
	]);

	// Bottom navigation_button-style actions (Riffic, secondary outline that
	// brightens on hover)
	const bottomActions = ["Update Version", "Import DDLC Save Data"];
	let hoveredAction = $state<string | null>(null);
	function actionOutlines(action: string): [string, number][] {
		const c = hoveredAction === action ? palette.navOutlineHover() : palette.navOutlineIdle();
		return [
			[c, 4],
			[c, 2]
		];
	}

	interface CheckEntry {
		label: string;
		selected?: boolean;
		box?: boolean;
	}
	const checkGroups: { x: number; label: string; items: CheckEntry[] }[] = [
		{
			x: 370,
			label: "Display",
			items: [{ label: "Window", selected: true }, { label: "Fullscreen" }]
		},
		{
			x: 595,
			label: "Graphics",
			items: [
				{ label: "Change Renderer", box: false },
				{ label: "Disable Animation" },
				{ label: "UI: Night Mode" },
				{ label: "UI: D/N Cycle" }
			]
		},
		{
			x: 818,
			label: "Gameplay",
			items: [{ label: "Unstable" }, { label: "Repeat Topics" }]
		}
	];

	const leftSliders = [
		{ label: "Sunrise", value: "06:00", fraction: 0.25 },
		{ label: "Sunset", value: "18:00", fraction: 0.75 },
		{ label: "Text Speed", fraction: 0.92 },
		{ label: "Auto-Forward Time", fraction: 0.1 }
	];
	const rightSliders = [
		{ label: "Random Chatter", value: "Occasionally", fraction: 0.5 },
		{ label: "Ambient Volume", fraction: 0.5 },
		{ label: "Music Volume", fraction: 0.72 },
		{ label: "Sound Volume", fraction: 0.6 }
	];
</script>

<Stage>
	<MenuBackground />
	<NavColumn />

	<!-- Version tag (top-right) -->
	<!-- <div class="absolute" style:right="12px" style:top="6px">
		<OutlineText size={16} color={scd(56, 56, 56)} font="main">v0.12.18</OutlineText>
	</div> -->

	<!-- Checkbox groups -->
	{#each checkGroups as group (group.label)}
		<div class="absolute flex flex-col" style:left="{group.x}px" style:top="95px">
			<div class="mb-1">
				<OutlineText size={24} color={labelColor} outlines={labelOutlines}>{group.label}</OutlineText>
			</div>
			{#each group.items as item (item.label)}
				<CheckItem label={item.label} selected={item.selected ?? false} box={item.box ?? true} />
			{/each}
		</div>
	{/each}

	<!-- Slider block, two columns -->
	<div class="absolute flex flex-col gap-4" style:left="370px" style:top="325px">
		{#each leftSliders as slider (slider.label)}
			<SettingsSlider label={slider.label} value={slider.value} fraction={slider.fraction} />
		{/each}
	</div>
	<div class="absolute flex flex-col gap-4" style:left="818px" style:top="325px">
		{#each rightSliders as slider (slider.label)}
			<SettingsSlider label={slider.label} value={slider.value} fraction={slider.fraction} />
		{/each}
		<CheckItem label="Mute All" />
	</div>

	<!-- Bottom action buttons -->
	<div class="absolute flex gap-8" style:left="370px" style:top="632px">
		{#each bottomActions as action (action)}
			<div
				role="presentation"
				onpointerenter={() => (hoveredAction = action)}
				onpointerleave={() => (hoveredAction = null)}
			>
				<OutlineText size={24} color={palette.navColor()} outlines={actionOutlines(action)}>
					{action}
				</OutlineText>
			</div>
		{/each}
	</div>
</Stage>
