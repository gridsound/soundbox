"use strict";

document.body.append(
	GSUcreateElement( "div", { id: "title" },
		GSUcreateElement( "span", null, "Soundbox" ),
		GSUcreateElement( "span", null, "by GridSound" ),
	),
	GSUcreateElement( "div", { id: "niceBorder" },
		GSUcreateElement( "div", { id: "mySoundbox" } ),
	),
	GSUcreateElement( "div", { id: "btns" },
		GSUcreateElement( "input", { id: "gain", type: "range", name: "gain", min: 0, max: 100, value: 100 } ),
		GSUcreateElement( "label", null,
			GSUcreateElement( "input", { id: "stopItself", type: "checkbox", checked: true } ),
			GSUcreateElement( "span", null, "stop itself" ),
		),
		GSUcreateElement( "button", { id: "clear", type: "button" }, "clear" ),
	),
	GSUcreateElement( "div", { id: "foot" },
		GSUcreateElement( "span", { id: "copyright" },
			"© 2023 ",
			GSUcreateElement( "a", { href: "https://gridsound.com" }, "gridsound.com" ),
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
