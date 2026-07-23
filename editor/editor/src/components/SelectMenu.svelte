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
		options: readonly { value: T; label: string }[];
		placeholder?: string;
		onChange?: (value: T) => void;
	} = $props();

	const triggerLabel = $derived(options.find((o) => o.value === value)?.label ?? placeholder);

	function select(picked: T) {
		value = picked;
		onChange?.(picked);
	}
</script>

<Menu onSelect={(details: { value: string }) => select(details.value as T)}>
	<Menu.Trigger class="btn preset-outlined-surface-500 w-full justify-between">
		{triggerLabel}
		<span aria-hidden="true">&#9662;</span>
	</Menu.Trigger>
	<Menu.Positioner>
		<Menu.Content class="card bg-surface-100-900 z-10 flex flex-col p-2 shadow-xl">
			{#each options as option (option.value)}
				<Menu.Item value={option.value} class="hover:bg-surface-200-800 cursor-pointer rounded px-3 py-1.5">
					{option.label}
				</Menu.Item>
			{/each}
		</Menu.Content>
	</Menu.Positioner>
</Menu>
