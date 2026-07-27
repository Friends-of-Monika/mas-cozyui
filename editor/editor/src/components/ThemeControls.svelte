<script lang="ts">
	import SelectMenu from "#components/SelectMenu.svelte";

	import ColorPicker from "svelte-awesome-color-picker";

	import {
		type ColorGroup,
		type ColorModulation,
		isModulated,
		modulationFromColor,
		overrideKey
	} from "#lib/preview/colors";
	import { customFonts } from "#lib/preview/fonts.svelte";
	import { type ColorSlot, colorSlots, sectionHints } from "#lib/preview/slots";
	import {
		NO_MODULATION,
		grp,
		fonts,
		patternShapes,
		prm,
		scd,
		theme
	} from "#lib/preview/theme.svelte";

	// Anchor colors the pickers operate on: the textbox base fill (primary) and
	// the menu label outline (secondary). The picker shows the anchor as modulated
	// by the current theme (one-way), and a pick writes back the modulation that
	// maps the anchor onto the chosen color - so presets/opens stay reflected.
	const PRM_ANCHOR: [number, number, number] = [255, 168, 210];
	const SCD_ANCHOR: [number, number, number] = [187, 85, 153];
	// Each surface gets a color of its own, applied to its group's bases in place
	// of the primary; unset means "follow primary", so a picker starts on the
	// primary's result and offers a reset. The anchor is a representative base of
	// the group - the picker shows it modulated, and a pick writes the modulation
	// that maps it onto the chosen color. (Text idle bases are grey, so their
	// pickers mostly shift the colored hover/selected states - see the hint.)
	interface Surface {
		label: string;
		group: ColorGroup;
		anchor: [number, number, number];
		mod: () => ColorModulation;
	}
	const surfaceGroups: { section: string; hint: string; items: Surface[] }[] = [
		{
			section: "Surfaces",
			hint: "Recolor the whole buttons or textbox at once",
			items: [
				{ label: "Button color", group: "button", anchor: [255, 230, 244], mod: () => theme.buttonColor },
				{ label: "Textbox color", group: "dialogue", anchor: [255, 168, 210], mod: () => theme.dialogueColor }
			]
		},
		{
			section: "Text",
			hint: "Dialogue and choice-button text (idle is grey; mostly shifts the other states)",
			items: [
				{
					label: "Textbox text color",
					group: "dialogueText",
					anchor: [248, 248, 248],
					mod: () => theme.dialogueTextColor
				},
				{
					label: "Button text color",
					group: "buttonText",
					anchor: [56, 56, 56],
					mod: () => theme.buttonTextColor
				}
			]
		},
		{
			section: "Calendar",
			hint: "The calendar panel, day cells and headers (borders follow the secondary color)",
			items: [{ label: "Calendar color", group: "calendar", anchor: [255, 230, 244], mod: () => theme.calendarColor }]
		}
	];

	const surfaceHex = (s: Surface) => grp(s.group, ...s.anchor);

	const titleize = <T extends string>(items: readonly T[]) =>
		items.map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

	// Every font selector shares one pool: the built-ins plus any user-added
	// custom fonts. Each item previews itself in the font it names.
	const custom = $derived(customFonts.map((f) => f.family));
	const fontOptions = $derived([...fonts, ...custom].map((v) => ({ value: v, label: v, font: v })));

	// The picker fires onInput both on user picks and when its hex prop changes
	// programmatically (preset/open). Skip the echo - writing it back would
	// re-derive the modulation through HSLuv and drift the color each time.
	function onPick(hex: string | null, current: string, apply: (hex: string) => void) {
		if (hex && hex.toLowerCase() !== current.toLowerCase()) apply(hex);
	}

	// A slot addresses its light or dark base depending on night mode, so the two
	// variants of a surface are pinned independently.
	const slotBase = (slot: ColorSlot) => (theme.darkMode ? slot.dark : slot.light);
	const slotKey = (slot: ColorSlot) => overrideKey(slot.channel, slot.group, ...slotBase(slot));
	// What the surface currently renders as: the pinned color, or the modulated one.
	const slotHex = (slot: ColorSlot) =>
		slot.channel === "prm" ? grp(slot.group, ...slotBase(slot)) : scd(...slotBase(slot));

	// Sections in slot order, so the list can be rendered with headings.
	const slotSections = $derived([...new Set(colorSlots.map((s) => s.section))]);

	// Two surfaces can be distinct in one mode but share a base in the other -
	// the dark button idle and disabled fills are both (28, 26, 30). Those are
	// one color, so they collapse into one control (labelled for both) instead of
	// two that silently move together.
	const sectionEntries = $derived(
		slotSections.map((section) => {
			const merged = new Map<string, { slot: ColorSlot; labels: string[] }>();
			for (const slot of colorSlots) {
				if (slot.section !== section) continue;
				const key = slotKey(slot);
				const hit = merged.get(key);
				if (hit) hit.labels.push(slot.label);
				else merged.set(key, { slot, labels: [slot.label] });
			}
			return {
				section,
				entries: [...merged].map(([key, { slot, labels }]) => ({ key, slot, label: labels.join(" / ") }))
			};
		})
	);

	const pinnedCount = $derived(new Set(colorSlots.map(slotKey).filter((k) => theme.overrides[k])).size);

	// Collapsible section header (native <details>/<summary>), chevron rotates via group-open
	const summaryClass =
		"flex cursor-pointer list-none items-center justify-between font-bold [&::-webkit-details-marker]:hidden";
</script>

<!-- One pinnable individual color: the picker plus a reset that drops it back
     to the modulated value. -->
{#snippet pinRow(key: string, slot: ColorSlot, label: string)}
	<div class="flex items-center gap-2">
		<div class="min-w-0 flex-1">
			<ColorPicker
				hex={slotHex(slot)}
				{label}
				isAlpha={false}
				position="responsive"
				onInput={(c) => onPick(c.hex, slotHex(slot), (h) => (theme.overrides[key] = h))}
			/>
		</div>
		{#if theme.overrides[key]}
			<button
				class="btn-icon btn-icon-sm preset-outlined-surface-500"
				title="Back to the modulated color"
				aria-label="Reset {label}"
				onclick={() => delete theme.overrides[key]}
			>
				&times;
			</button>
		{/if}
	</div>
{/snippet}

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
			<details class="group/slots mt-1 flex flex-col gap-2">
				<summary class={summaryClass}>
					<span class="font-normal">
						Individual colors{pinnedCount > 0 ? ` (${pinnedCount} pinned)` : ""}
					</span>
					<span class="transition-transform group-open/slots:rotate-90" aria-hidden="true">&rsaquo;</span>
				</summary>
				<div class="flex flex-col gap-2 pt-2">
					<p class="text-xs opacity-60">
						Pinned colors ignore the primary and secondary colors.
						{#if theme.darkMode}
							Editing the <b>night-mode</b> variants.
						{:else}
							Editing the <b>day-mode</b> variants.
						{/if}
					</p>

					<!-- Whole-surface colors: a modulation on their group's bases that
					     replaces the primary, so unset means "follow primary". Distinct
					     from the pinned slots below (which are absolute). -->
					{#each surfaceGroups as { section, hint, items } (section)}
						<div class="mt-2">
							<span class="text-xs font-bold opacity-70">{section}</span>
							<p class="text-xs opacity-50">{hint}</p>
						</div>
						{#each items as surface (surface.group)}
							<div class="flex items-center gap-2">
								<div class="min-w-0 flex-1">
									<ColorPicker
										hex={surfaceHex(surface)}
										label={surface.label}
										isAlpha={false}
										position="responsive"
										onInput={(c) =>
											onPick(c.hex, surfaceHex(surface), (h) =>
												Object.assign(surface.mod(), modulationFromColor(h, surface.anchor))
											)}
									/>
								</div>
								{#if isModulated(surface.mod())}
									<button
										class="btn-icon btn-icon-sm preset-outlined-surface-500"
										title="Back to the primary color"
										aria-label="Reset {surface.label}"
										onclick={() => Object.assign(surface.mod(), NO_MODULATION())}
									>
										&times;
									</button>
								{/if}
							</div>
						{/each}
					{/each}

					{#each sectionEntries as { section, entries } (section)}
						<div class="mt-2">
							<span class="text-xs font-bold opacity-70">{section}</span>
							<p class="text-xs opacity-50">{sectionHints[section]}</p>
						</div>
						{#each entries as { key, slot, label } (key)}
							{@render pinRow(key, slot, label)}
						{/each}
					{/each}
				</div>
			</details>
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
				<SelectMenu bind:value={theme.mainFont} options={fontOptions} />
				<span class="text-xs opacity-60">Dialogue, buttons, menus and the quick menu</span>
			</label>
			<label class="label">
				<span>Menu font</span>
				<SelectMenu bind:value={theme.menuFont} options={fontOptions} />
				<span class="text-xs opacity-60">Name box and settings menu titles</span>
			</label>
			<label class="label">
				<span>Option font</span>
				<SelectMenu bind:value={theme.optionFont} options={fontOptions} />
				<span class="text-xs opacity-60">Settings check/radio options</span>
			</label>
			<label class="label">
				<span>Music font</span>
				<SelectMenu bind:value={theme.musicFont} options={fontOptions} />
				<span class="text-xs opacity-60">Music selector song list</span>
			</label>
			<label class="label">
				<span>Calendar font</span>
				<SelectMenu bind:value={theme.calendarFont} options={fontOptions} />
				<span class="text-xs opacity-60">Calendar title, dates and day names</span>
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
