<script lang="ts">
	import ExportDialog from "#components/ExportDialog.svelte";

	import { Menu } from "@skeletonlabs/skeleton-svelte";

	import { addFont, customFonts, removeFont } from "#lib/preview/fonts.svelte";
	import { applyPreset, presets } from "#lib/preview/presets";
	import { theme } from "#lib/preview/theme.svelte";
	import { openCozy, packCozy } from "#lib/theme/config";
	import { type ExportProgress, exportTheme } from "#lib/theme/export";

	let fileInput = $state<HTMLInputElement>();
	let fontInput = $state<HTMLInputElement>();
	let error = $state<string | null>(null);

	// .zip export dialog state
	let exporting = $state(false);
	let exportDone = $state(false);
	let exportError = $state<string | null>(null);
	let progress = $state<ExportProgress | null>(null);

	const itemClass =
		"hover:bg-surface-200-800 flex cursor-pointer items-center justify-between gap-6 rounded px-3 py-1.5";
	const contentClass = "card bg-surface-100-900 z-50 flex min-w-44 flex-col p-1 shadow-xl";

	function slug(): string {
		return theme.name.trim().toLowerCase().replace(/\s+/g, "_") || "custom";
	}

	function download(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function onOpenFile(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;
		error = null;
		try {
			await openCozy(file);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function exportPackage(scale: number) {
		if (exporting) return;
		exporting = true;
		exportDone = false;
		exportError = null;
		progress = { phase: "Starting", done: 0, total: 1 };
		try {
			const suffix = scale > 1 ? "_hidpi" : "";
			download(await exportTheme(theme.name, scale, (p) => (progress = p)), `${slug()}${suffix}.zip`);
		} catch (e) {
			exportError = e instanceof Error ? e.message : String(e);
		} finally {
			// Keep the dialog open on completion; the user dismisses it.
			exportDone = true;
		}
	}

	function closeExport() {
		exporting = false;
		progress = null;
	}

	async function onOpenFont(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;
		error = null;
		try {
			await addFont(file);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function onAction(value: string) {
		if (value.startsWith("preset:")) return applyPreset(value.slice(7));
		if (value.startsWith("remove-font:")) return removeFont(value.slice(12));
		if (value === "open") fileInput?.click();
		else if (value === "add-font") fontInput?.click();
		else if (value === "export-project") download(packCozy(), `${slug()}.cozy`);
		else if (value === "export-package") exportPackage(1);
		else if (value === "export-package-2x") exportPackage(2);
	}
</script>

<nav class="border-surface-500/40 flex items-center gap-3 border-b py-1">
	<input bind:this={fileInput} type="file" accept=".cozy" class="hidden" onchange={onOpenFile} />
	<input bind:this={fontInput} type="file" accept=".ttf" class="hidden" onchange={onOpenFont} />

	<Menu onSelect={(d: { value: string }) => onAction(d.value)}>
		<Menu.Trigger
			class="hover:bg-surface-200-800 data-[state=open]:bg-surface-200-800 rounded px-3 py-1 text-sm font-semibold focus:outline-none"
		>
			Theme
		</Menu.Trigger>
		<Menu.Positioner>
			<Menu.Content class={contentClass}>
				<Menu onSelect={(d: { value: string }) => onAction(d.value)}>
					<Menu.TriggerItem value="new-from-preset" class={itemClass}>
						New from preset
						<span aria-hidden="true">&rsaquo;</span>
					</Menu.TriggerItem>
					<Menu.Positioner>
						<Menu.Content class={contentClass}>
							{#each presets as preset (preset.id)}
								<Menu.Item value="preset:{preset.id}" class={itemClass}>{preset.name}</Menu.Item>
							{/each}
						</Menu.Content>
					</Menu.Positioner>
				</Menu>
				<Menu.Separator class="border-surface-500/30 my-1 border-t" />
				<Menu.Item value="open" class={itemClass}>Open theme…</Menu.Item>
				<Menu.Item value="export-project" class={itemClass}>Save theme (.cozy)</Menu.Item>
				<Menu onSelect={(d: { value: string }) => onAction(d.value)}>
					<Menu.TriggerItem value="export-package-menu" class={itemClass}>
						Export theme (.zip)
						<span aria-hidden="true">&rsaquo;</span>
					</Menu.TriggerItem>
					<Menu.Positioner>
						<Menu.Content class={contentClass}>
							<Menu.Item value="export-package" class={itemClass}>Standard</Menu.Item>
							<Menu.Item value="export-package-2x" class={itemClass}>Hi-DPI (2x)</Menu.Item>
						</Menu.Content>
					</Menu.Positioner>
				</Menu>
			</Menu.Content>
		</Menu.Positioner>
	</Menu>

	<Menu onSelect={(d: { value: string }) => onAction(d.value)}>
		<Menu.Trigger
			class="hover:bg-surface-200-800 data-[state=open]:bg-surface-200-800 rounded px-3 py-1 text-sm font-semibold focus:outline-none"
		>
			Fonts
		</Menu.Trigger>
		<Menu.Positioner>
			<Menu.Content class={contentClass}>
				<Menu.Item value="add-font" class={itemClass}>Add font…</Menu.Item>
				{#if customFonts.length === 0}
					<div class="{itemClass} pointer-events-none opacity-40">Remove font</div>
				{:else}
					<Menu onSelect={(d: { value: string }) => onAction(d.value)}>
						<Menu.TriggerItem value="remove-font-menu" class={itemClass}>
							Remove font
							<span aria-hidden="true">&rsaquo;</span>
						</Menu.TriggerItem>
						<Menu.Positioner>
							<Menu.Content class={contentClass}>
								{#each customFonts as font (font.family)}
									<Menu.Item value="remove-font:{font.family}" class={itemClass}>{font.family}</Menu.Item>
								{/each}
							</Menu.Content>
						</Menu.Positioner>
					</Menu>
				{/if}
			</Menu.Content>
		</Menu.Positioner>
	</Menu>

	{#if error}
		<span class="text-error-500 text-xs">{error}</span>
	{/if}
</nav>

<ExportDialog open={exporting} {progress} done={exportDone} error={exportError} onClose={closeExport} />
