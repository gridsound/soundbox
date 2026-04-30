"use strict";

$body.$append(
	$.$div( { id: "title" },
		$.$span( null, "Soundbox" ),
		$.$span( null, "by GridSound" ),
	),
	$.$div( { id: "niceBorder" },
		$.$div( { id: "mySoundbox" } ),
	),
	$.$div( { id: "btns" },
		$.$input( { id: "gain", type: "range", name: "gain", min: 0, max: 100, value: 100 } ),
		$.$label( null,
			$.$input( { id: "stopItself", type: "checkbox", checked: true } ),
			$.$span( null, "stop itself" ),
		),
		$.$label( null,
			$.$input( { id: "loop", type: "checkbox" } ),
			$.$span( null, "loop" ),
		),
		$.$elem( "gsui-com-button", { id: "stop", text: "stop" } ),
		$.$elem( "gsui-com-button", { id: "clear", text: "clear" } ),
	),
	$.$div( { id: "foot" },
		$.$span( { id: "copyright" },
			`© ${ new Date().getFullYear() } `,
			$.$link( { href: "https://gridsound.com" }, "gridsound.com" ),
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
