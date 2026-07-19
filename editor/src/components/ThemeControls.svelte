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

	// Collapsible section header (native <details>/<summary>), chevron rotates via group-open
	const summaryClass =
		"flex cursor-pointer list-none items-center justify-between font-bold [&::-webkit-details-marker]:hidden";
</script>

<div class="flex flex-col gap-4">
	<details open class="group flex flex-col gap-2">
		<summary class={summaryClass}>
			Name
			<span class="transition-transform group-open:rotate-90" aria-hidden="true">&rsaquo;</span>
		</summary>
		<label class="label pt-2">
			<span>Theme name</span>
			<input class="input" type="text" placeholder="Custom" bind:value={theme.name} />
		</label>
	</details>

	<details open class="group flex flex-col gap-2">
		<summary class={summaryClass}>
			Colors
			<span class="transition-transform group-open:rotate-90" aria-hidden="true">&rsaquo;</span>
		</summary>
		<div class="flex flex-col gap-2 pt-2">
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
		</div>
	</details>

	<details open class="group flex flex-col gap-2">
		<summary class={summaryClass}>
			Fonts
			<span class="transition-transform group-open:rotate-90" aria-hidden="true">&rsaquo;</span>
		</summary>
		<div class="flex flex-col gap-2 pt-2">
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
		</div>
	</details>

	<details open class="group flex flex-col gap-2">
		<summary class={summaryClass}>
			Shape
			<span class="transition-transform group-open:rotate-90" aria-hidden="true">&rsaquo;</span>
		</summary>
		<div class="flex flex-col gap-2 pt-2">
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
				<span>Pattern</span>
				<!-- One control for both pattern fields (every theme keeps them equal):
				     the dialogue textbox and the settings-menu backdrop. -->
				<SelectMenu
					value={theme.dialoguePatternShape}
					options={titleize(patternShapes)}
					onChange={(v) => {
						theme.dialoguePatternShape = v;
						theme.menuPatternShape = v;
					}}
				/>
				<span class="text-xs opacity-60">Dialogue box and settings backdrop</span>
			</label>
		</div>
	</details>
</div>
