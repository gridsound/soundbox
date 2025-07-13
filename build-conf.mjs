export default {
	title:         "Soundbox by GridSound",
	desc:          "A simple app to check super quickly an entire audio sample library in few clicks",
	favicon:       "assets/favicon.png",
	url:           "https://soundbox.gridsound.com/",
	manifest:      "manifest.json",
	ogImage:       "https://soundbox.gridsound.com/cover.png",
	ogImageW:      960,
	ogImageH:      760,
	serviceWorker: "serviceWorker.js",
	// .........................................................................
	cssSrcA: [
		"assets/fonts/fonts.css",
		"gsuiSoundbox.css",
		"style.css",
	],
	// jsSrcA: [
	// 	"checkBrowser.js",
	// ],
	jsSrcB: [
		"gsuiSoundbox.js",
		"run.js",
	],
	// .........................................................................
	cssDep: [
		"gs-ui-components/gsui.css",
		"gs-ui-components/gsuiRipple/gsuiRipple.css",
		"gs-ui-components/gsuiComButton/gsuiComButton.css",
	],
	// .........................................................................
	jsDep: [
		"gs-utils/gs-utils.js",
		"gs-utils/gs-utils-dom.js",
		"gs-utils/gs-utils-func.js",
		"gs-utils/gs-utils-files.js",
		"gs-utils/gs-utils-checkType.dev.js",
		"gs-utils/gs-utils-audio-nodes.dev.js",

		// .....................................................................
		"gs-ui-components/gsui0ne/gsui0ne.js",
		"gs-ui-components/gsuiRipple/gsuiRipple.js",
		"gs-ui-components/gsuiComButton/gsuiComButton.js",
		"gs-ui-components/gsuiWaveform/gsuiWaveform.js",
	],
};
