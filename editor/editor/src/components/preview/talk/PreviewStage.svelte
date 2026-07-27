<!-- MAS scene preview. Layers back to front: sky mask, spaceroom, hotkey
     buttons, textbox (+ namebox, dialogue, quick menu), talk menu. -->
<script lang="ts">
	import { backgrounds } from "#lib/preview/backgrounds";
	import {
		DIALOGUE_TEXT_SIZE,
		DIALOGUE_TOP,
		DIALOGUE_W,
		DIALOGUE_X,
		NAMEBOX_CENTER_X,
		NAMEBOX_H,
		NAMEBOX_TOP,
		NAMEBOX_W,
		STAGE_H,
		STAGE_W,
		TEXTBOX_LEFT,
		TEXTBOX_TOP
	} from "#lib/preview/layout";
	import { outlineShadow } from "#lib/preview/outline";
	import { palette } from "#lib/preview/palette.svelte";
	import { theme } from "#lib/preview/theme.svelte";

	import Stage from "../Stage.svelte";

	import ChoiceMenu from "./ChoiceMenu.svelte";
	import HkbColumn from "./HkbColumn.svelte";
	import Namebox from "./Namebox.svelte";
	import QuickMenu from "./QuickMenu.svelte";
	import Textbox from "./Textbox.svelte";

	const dialogueColor = $derived(palette.dialogueColor());
	const dialogueOutline = $derived(palette.dialogueOutline());
	const nameColor = $derived(palette.labelColor());
	const nameOutline = $derived(palette.labelOutline());

	// Night UI mode also swaps the room + weather sky mask to their night art
	const skyMask = $derived(theme.darkMode ? backgrounds.skyNight : backgrounds.skyDay);
	const room = $derived(theme.darkMode ? backgrounds.roomNight : backgrounds.roomDay);
</script>

<Stage>
	<!-- Background: sky mask behind the room (room windows are transparent) -->
	<img src={skyMask} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />
	<img src={room} alt="" class="absolute inset-0" width={STAGE_W} height={STAGE_H} />

	<!-- TODO: Monika sprite layer -->

	<HkbColumn />

	<!-- Say window -->
	<div class="absolute" style:left="{TEXTBOX_LEFT}px" style:top="{TEXTBOX_TOP}px">
		<Textbox />
	</div>
	<div class="absolute" style:left="{NAMEBOX_CENTER_X - NAMEBOX_W / 2}px" style:top="{NAMEBOX_TOP}px">
		<Namebox />
		<div
			class="preview-name-font absolute inset-0 flex items-center justify-center tracking-widest"
			style:height="{NAMEBOX_H}px"
			style:font-size="24px"
			style:color={nameColor}
			style:text-shadow={outlineShadow(nameOutline, 2)}
		>
			Monika
		</div>
	</div>
	<div
		class="preview-font absolute"
		style:left="{DIALOGUE_X}px"
		style:top="{DIALOGUE_TOP}px"
		style:width="{DIALOGUE_W}px"
		style:font-size="{DIALOGUE_TEXT_SIZE}px"
		style:color={dialogueColor}
		style:text-shadow={outlineShadow(dialogueOutline, 2)}
	>
		Oh? Something... <i>important</i> on your mind, Player?~
	</div>
	<QuickMenu />

	<ChoiceMenu />
</Stage>
