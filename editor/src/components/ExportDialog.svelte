<!-- Modal shown while exporting a theme .zip: progress bar with a fly-in, kept
     open on completion so the result stays visible until dismissed. -->
<script lang="ts">
	import { fade, fly } from "svelte/transition";

	import type { ExportProgress } from "#lib/theme/export";

	let {
		open,
		progress,
		done,
		error,
		onClose
	}: {
		open: boolean;
		progress: ExportProgress | null;
		done: boolean;
		error: string | null;
		onClose: () => void;
	} = $props();

	const percent = $derived(progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0);
</script>

{#if open}
	<div class="fixed inset-0 z-100 flex items-center justify-center p-4">
		<button
			class="absolute inset-0 bg-black/50"
			aria-label="Close"
			transition:fade={{ duration: 150 }}
			onclick={() => done && onClose()}
		></button>

		<div
			class="card bg-surface-100-900 relative flex w-80 flex-col gap-3 p-6 shadow-xl"
			transition:fly={{ y: 24, duration: 220 }}
		>
			<h3 class="h4">Exporting theme package</h3>

			{#if error}
				<p class="text-error-500 text-sm">{error}</p>
			{:else}
				<div class="flex justify-between text-xs opacity-70">
					<span>{done ? "Done" : (progress?.phase ?? "Starting")}</span>
					<span>{percent}%</span>
				</div>
				<div class="bg-surface-700 h-2 overflow-hidden rounded-full">
					<div
						class="bg-primary-500 h-full transition-[width] duration-150"
						style:width="{done ? 100 : percent}%"
					></div>
				</div>
			{/if}

			<button
				type="button"
				class="btn preset-filled-primary-500 mt-2 w-full disabled:opacity-50"
				disabled={!done}
				onclick={onClose}
			>
				{done ? "Close" : "Exporting…"}
			</button>
		</div>
	</div>
{/if}
