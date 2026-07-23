// Room and weather-mask art loaded from the MonikaModDev repo via the
// jsDelivr GitHub CDN, so the (large) base-game images aren't vendored here.
// Pinned to a release tag so the asset paths stay stable.
// prettier-ignore
const GH = "https://cdn.jsdelivr.net/gh/Monika-After-Story/MonikaModDev@v0.12.18/Monika%20After%20Story/game/mod_assets";

export const backgrounds = {
	roomDay: `${GH}/location/spaceroom/spaceroom.png`,
	roomNight: `${GH}/location/spaceroom/spaceroom-n.png`,
	skyDay: `${GH}/window/def_day_mask_fb.png`,
	skyNight: `${GH}/window/def_night_mask_fb.png`
};
