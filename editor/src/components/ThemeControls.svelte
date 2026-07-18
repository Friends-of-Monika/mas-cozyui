<script lang="ts">
	import SelectMenu from "#components/SelectMenu.svelte";

	import ColorPicker from "svelte-awesome-color-picker";

	import { modulationFromColor } from "#lib/preview/colors";
	import { customFonts } from "#lib/preview/fonts.svelte";
	import { mainFonts, menuFonts, optionFonts, patternShapes, prm, scd, theme } from "#lib/preview/theme.svelte";

	// Anchor colors the pickers operate on: the textbox base fill (primary) and
	// the menu label outline (secondary). The picker shows the anchor as modulated
	// by the current theme (one-way), and a pick writes back the modulation that
	// maps the anchor onto the chosen color - so presets/opens stay reflected.
	const PRM_ANCHOR: [number, number, number] = [255, 168, 210];
	const SCD_ANCHOR: [number, number, number] = [187, 85, 153];

	const toOptions = <T extends string>(items: readonly T[]) => items.map((v) => ({ value: v, label: v }));
	const titleize = <T extends string>(items: readonly T[]) =>
		items.map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

	// Font selectors list the built-ins plus any user-added custom fonts.
	const custom = $derived(customFonts.map((f) => f.family));
	const mainFontOptions = $derived(toOptions([...mainFonts, ...custom]));
	const menuFontOptions = $derived(toOptions([...menuFonts, ...custom]));
	const optionFontOptions = $derived(toOptions([...optionFonts, ...custom]));

	// The picker fires onInput both on user picks and when its hex prop changes
	// programmatically (preset/open). Skip the echo - writing it back would
	// re-derive the modulation through HSLuv and drift the color each time.
	function onPick(hex: string | null, current: string, apply: (hex: string) => void) {
		if (hex && hex.toLowerCase() !== current.toLowerCase()) apply(hex);
	}
</script>

<div class="flex flex-col gap-4">
	<fieldset class="flex flex-col gap-2">
		<legend class="font-bold">Name</legend>
		<label class="label">
			<span>Theme name</span>
			<input class="input" type="text" placeholder="Custom" bind:value={theme.name} />
		</label>
	</fieldset>

	<fieldset class="flex flex-col gap-2">
		<legend class="font-bold">Colors</legend>
		<ColorPicker
			hex={prm(...PRM_ANCHOR)}
			label="Primary color"
			isAlpha={false}
			position="responsive"
			onInput={(c) =>
				onPick(c.hex, prm(...PRM_ANCHOR), (h) =>
					Object.assign(theme.primary, modulationFromColor(h, PRM_ANCHOR))
				)}
		/>
		<ColorPicker
			hex={scd(...SCD_ANCHOR)}
			label="Secondary color"
			isAlpha={false}
			position="responsive"
			onInput={(c) =>
				onPick(c.hex, scd(...SCD_ANCHOR), (h) =>
					Object.assign(theme.secondary, modulationFromColor(h, SCD_ANCHOR))
				)}
		/>
	</fieldset>

	<fieldset class="flex flex-col gap-2">
		<legend class="font-bold">Fonts</legend>
		<label class="label">
			<span>Main font</span>
			<SelectMenu bind:value={theme.mainFont} options={mainFontOptions} />
			<span class="text-xs opacity-60">Dialogue, buttons, menus and the quick menu</span>
		</label>
		<label class="label">
			<span>Menu font</span>
			<SelectMenu bind:value={theme.menuFont} options={menuFontOptions} />
			<span class="text-xs opacity-60">Name box and settings menu titles</span>
		</label>
		<label class="label">
			<span>Option font</span>
			<SelectMenu bind:value={theme.optionFont} options={optionFontOptions} />
			<span class="text-xs opacity-60">Settings check/radio options</span>
		</label>
	</fieldset>

	<fieldset class="flex flex-col gap-2">
		<legend class="font-bold">Shape</legend>
		<label class="label">
			<span>Button rounding</span>
			<input class="input" type="number" min="0" max="16" bind:value={theme.buttonRounding} />
		</label>
		<label class="label">
			<span>Frame rounding</span>
			<input class="input" type="number" min="0" max="16" bind:value={theme.frameRounding} />
			<span class="text-xs opacity-60">Confirm/modal windows</span>
		</label>
		<label class="label">
			<span>Dialogue rounding</span>
			<input class="input" type="number" min="0" max="36" bind:value={theme.dialogueRounding} />
		</label>
		<label class="label">
			<span>Dialogue pattern</span>
			<SelectMenu bind:value={theme.dialoguePatternShape} options={titleize(patternShapes)} />
		</label>
	</fieldset>
</div>
