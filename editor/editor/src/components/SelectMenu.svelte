<!-- Themed dropdown built on the Skeleton Menu. Either bind:value for a
     selection, or pass onChange to treat picks as one-off actions (e.g.
     applying a preset), keeping the trigger on its placeholder. -->
<script lang="ts" generics="T extends string">
	import { Menu } from "@skeletonlabs/skeleton-svelte";

	let {
		value = $bindable(),
		options,
		placeholder = "Select...",
		onChange
	}: {
		value?: T;
		// A `font` on an option renders that item (and the trigger, when selected)
		// in the named font family - used by the font selectors to preview each font.
		options: readonly { value: T; label: string; font?: string }[];
		placeholder?: string;
		onChange?: (value: T) => void;
	} = $props();

	const selected = $derived(options.find((o) => o.value === value));
	const triggerLabel = $derived(selected?.label ?? placeholder);

	function select(picked: T) {
		value = picked;
		onChange?.(picked);
	}
</script>

<Menu onSelect={(details: { value: string }) => select(details.value as T)}>
	<Menu.Trigger class="btn preset-outlined-surface-500 w-full justify-between">
		<span style={selected?.font ? `font-family: ${selected.font}` : undefined}>{triggerLabel}</span>
		<span aria-hidden="true">&#9662;</span>
	</Menu.Trigger>
	<Menu.Positioner>
		<Menu.Content class="card bg-surface-100-900 z-10 flex flex-col p-2 shadow-xl">
			{#each options as option (option.value)}
				<Menu.Item
					value={option.value}
					class="hover:bg-surface-200-800 cursor-pointer rounded px-3 py-1.5"
					style={option.font ? `font-family: ${option.font}` : undefined}
				>
					{option.label}
				</Menu.Item>
			{/each}
		</Menu.Content>
	</Menu.Positioner>
</Menu>
