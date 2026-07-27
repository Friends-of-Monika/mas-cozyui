<!-- Export-progress modal (Skeleton Dialog). Non-dismissable while exporting:
     escape/outside-close are off and the close button stays disabled until
     `done`, so the export can't be abandoned midway. -->
<script lang="ts">
	import { Dialog, Portal } from "@skeletonlabs/skeleton-svelte";

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

	// Controlled open: with escape/outside-close disabled and no trigger, the
	// machine only requests a close through the (gated) CloseTrigger - relay that
	// to the parent, which owns the open state.
	function onOpenChange(details: { open: boolean }) {
		if (!details.open) onClose();
	}
</script>

<Dialog {open} {onOpenChange} modal closeOnEscape={false} closeOnInteractOutside={false} role="alertdialog">
	<Portal>
		<Dialog.Backdrop class="dialog-backdrop fixed inset-0 z-100 bg-black/50" />
		<Dialog.Positioner class="fixed inset-0 z-100 flex items-center justify-center p-4">
			<Dialog.Content class="dialog-content card bg-surface-100-900 flex w-96 flex-col gap-3 p-6 shadow-xl">
				<Dialog.Title class="h4">Exporting theme package</Dialog.Title>

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

				<a
					class="btn preset-outlined-surface-500 mt-2 w-full"
					href="https://github.com/Friends-of-Monika/mas-cozyui#-custom-themes"
					target="_blank"
				>
					How do I install it?
				</a>

				<Dialog.CloseTrigger class="btn preset-filled-primary-500 w-full disabled:opacity-50" disabled={!done}>
					{done ? "Close" : "Exporting…"}
				</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>

<style>
	/* Rendered by child components and portalled to <body>, so out of this
	   component's style scope - target them globally. */
	:global(.dialog-backdrop[data-state="open"]) {
		animation: backdrop-in 150ms ease;
	}
	:global(.dialog-content[data-state="open"]) {
		animation: dialog-in 220ms ease;
	}
	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
	}
	@keyframes dialog-in {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
	}
</style>
