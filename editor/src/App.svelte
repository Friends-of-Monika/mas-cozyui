<script lang="ts">
	import AppMenu from "#components/AppMenu.svelte";
	import ThemeControls from "#components/ThemeControls.svelte";
	import MenuPreview from "#components/preview/menu/MenuPreview.svelte";
	import ModalPreview from "#components/preview/modal/ModalPreview.svelte";
	import SettingsPreview from "#components/preview/settings/SettingsPreview.svelte";
	import PreviewStage from "#components/preview/talk/PreviewStage.svelte";

	import { Switch, Tabs } from "@skeletonlabs/skeleton-svelte";

	import { APP_NAME } from "#lib/constants";
	import { theme } from "#lib/preview/theme.svelte";
	import { ui } from "#lib/preview/ui.svelte";
</script>

<main class="container mx-auto flex flex-col gap-4 p-8">
	<h1 class="h1">{APP_NAME}</h1>
	<AppMenu />
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
		<Tabs value={ui.tab} onValueChange={(details: { value: string }) => (ui.tab = details.value)} class="min-w-0">
			<div class="border-surface-200-800 mb-4 flex items-end justify-between border-b">
				<Tabs.List class="relative flex gap-1">
					{#each [{ value: "scene", label: "Scene" }, { value: "settings", label: "Settings" }, { value: "menu", label: "Menu" }, { value: "modal", label: "Modal" }] as t (t.value)}
						<Tabs.Trigger
							value={t.value}
							class="data-[state=active]:text-primary-500 cursor-pointer px-4 py-2 font-semibold opacity-60 transition-opacity hover:opacity-100 data-[state=active]:opacity-100"
						>
							{t.label}
						</Tabs.Trigger>
					{/each}
					<Tabs.Indicator class="bg-primary-500 bottom-0 h-0.5 w-(--width)" />
				</Tabs.List>
				<Switch
					checked={theme.darkMode}
					onCheckedChange={(details: { checked: boolean }) => (theme.darkMode = details.checked)}
					class="flex cursor-pointer items-center gap-2 pb-2"
				>
					<Switch.Label class="text-sm opacity-80 translate-y-[-2px]">Night mode</Switch.Label>
					<Switch.HiddenInput />
					<Switch.Control
						class="bg-surface-400 data-[state=checked]:bg-primary-500 flex h-6 w-11 items-center rounded-full p-0.5 transition-colors"
					>
						<Switch.Thumb
							class="block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5"
						/>
					</Switch.Control>
				</Switch>
			</div>
			<Tabs.Content value="scene">
				<PreviewStage />
			</Tabs.Content>
			<Tabs.Content value="settings">
				<SettingsPreview />
			</Tabs.Content>
			<Tabs.Content value="menu">
				<MenuPreview />
			</Tabs.Content>
			<Tabs.Content value="modal">
				<ModalPreview />
			</Tabs.Content>
			<p class="mt-2 text-xs opacity-60">Preview is rendered in the browser and might not be 100% accurate.</p>
		</Tabs>
		<aside class="card preset-filled-surface-100-900 h-fit p-4">
			<ThemeControls />
		</aside>
	</div>
</main>
