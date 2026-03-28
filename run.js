"use strict";

$body.$append(
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
		GSUcreateLabel( null,
			GSUcreateInput( { id: "loop", type: "checkbox" } ),
			GSUcreateSpan( null, "loop" ),
		),
		GSUcreateElement( "gsui-com-button", { id: "stop", text: "stop" } ),
		GSUcreateElement( "gsui-com-button", { id: "clear", text: "clear" } ),
	),
	GSUcreateDiv( { id: "foot" },
		GSUcreateSpan( { id: "copyright" },
			`© ${ new Date().getFullYear() } `,
			GSUcreateA( { href: "https://gridsound.com" }, "gridsound.com" ),
			" all rights reserved",
		),
	),
);

$body.$setAttr( "data-skin", "gray" );

const el = $( "#mySoundbox" );
const elGain = $( "#gain" );
const elLoop = $( "#loop" );
const elStop = $( "#stop" );
const elClear = $( "#clear" );
const elStopItself = $( "#stopItself" );
const sndbx = new GSSoundbox();

sndbx.init( el );

elGain.$oninput( () => sndbx.setGain( elGain.$value() / 100 ) );
elLoop.$onchange( () => sndbx.$setLoop( elLoop.$checked() ) );
elStop.$onclick( () => sndbx.$stop() );
elClear.$onclick( () => sndbx.clear() );
elStopItself.$onchange( () => sndbx.stopItself( elStopItself.$checked() ) );

elLoop.$trigger( "onchange" );
elStopItself.$trigger( "onchange" );
