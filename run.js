"use strict";

document.body.append(
	GSUcreateDiv( { id: "title" },
		GSUcreateSpan( null, "Soundbox" ),
		GSUcreateSpan( null, "by GridSound" ),
	),
	GSUcreateDiv( { id: "niceBorder" },
		GSUcreateDiv( { id: "mySoundbox" } ),
	),
	GSUcreateDiv( { id: "btns" },
		GSUcreateInput( { id: "gain", type: "range", name: "gain", min: 0, max: 100, value: 100 } ),
		GSUcreateLabel( null,
			GSUcreateInput( { id: "stopItself", type: "checkbox", checked: true } ),
			GSUcreateSpan( null, "stop itself" ),
		),
		GSUcreateElement( "gsui-com-button", { id: "clear", text: "clear" } ),
	),
	GSUcreateDiv( { id: "foot" },
		GSUcreateSpan( { id: "copyright" },
			`© ${ ( new Date() ).getFullYear() } `,
			GSUcreateA( { href: "https://gridsound.com" }, "gridsound.com" ),
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
