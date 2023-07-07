"use strict";

document.body.append(
	GSUI.$createElement( "div", { id: "title" },
		GSUI.$createElement( "span", null, "Soundbox" ),
		GSUI.$createElement( "span", null, "by GridSound" ),
	),
	GSUI.$createElement( "div", { id: "niceBorder" },
		GSUI.$createElement( "div", { id: "mySoundbox" } ),
	),
	GSUI.$createElement( "div", { id: "btns" },
		GSUI.$createElement( "input", { id: "gain", type: "range", name: "gain", min: 0, max: 100, value: 100 } ),
		GSUI.$createElement( "label", null,
			GSUI.$createElement( "input", { id: "stopItself", type: "checkbox", checked: true } ),
			GSUI.$createElement( "span", null, "stop itself" ),
		),
		GSUI.$createElement( "button", { id: "clear", type: "button" }, "clear" ),
	),
	GSUI.$createElement( "div", { id: "foot" },
		GSUI.$createElement( "span", { id: "copyright" },
			"© 2023 ",
			GSUI.$createElement( "a", { href: "https://gridsound.com" }, "gridsound.com" ),
			" all rights reserved",
		),
	),
);

const el = document.querySelector( "#mySoundbox" );
const elGain = document.querySelector( "#gain" );
const elClear = document.querySelector( "#clear" );
const elStopItself = document.querySelector( "#stopItself" );
const sndbx = new GSSoundbox();

sndbx.init( el );
elGain.oninput = () => sndbx.setGain( elGain.value / 100 );
elClear.onclick = () => sndbx.clear();
elStopItself.onchange = () => sndbx.stopItself( elStopItself.checked );
elStopItself.onchange();
