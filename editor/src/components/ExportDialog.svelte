<!-- Export-progress modal, built on Skeleton's (Zag) Dialog: modal focus trap +
     scroll lock, portalled to <body>. It is deliberately non-dismissable while
     exporting - closeOnEscape/closeOnInteractOutside are off and the only close
     affordance (CloseTrigger) is disabled until `done` - so the export can't be
     abandoned midway. Enter is animated via a data-state keyframe. -->
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
		<Dialog.Backdrop class="dialog-backdrop fixed inset-0 z-[100] bg-black/50" />
		<Dialog.Positioner class="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
						<div class="bg-primary-500 h-full transition-[width] duration-150" style:width="{done ? 100 : percent}%"></div>
					</div>
				{/if}

				<Dialog.CloseTrigger class="btn preset-filled-primary-500 mt-2 w-full disabled:opacity-50" disabled={!done}>
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
