"use strict";

const fs = require( "node:fs" );
let gsId = 0;

function fixURLs( str ) {
	let str2 = str;

	str2 = str2.replace( "//localhost/gridsound/daw/", "//daw.gridsound.com/" );
	str2 = str2.replace( "//localhost/gridsound/api.gridsound.com/api/", "//api.gridsound.com/" );
	str2.match( /url\([^)]*\.woff2\?\d+\)/ug ).forEach( font => {
		str2 = str2.replace( font, `url(assets/fonts/${ font.substring( 4 ) }` );
	} );
	return str2;
}

function getMatches( str, regex ) {
	return Array.from( new Set( str.match( regex ) ) ).sort( ( a, b ) => b.length - a.length );
}

function rmMatches( str, regex ) {
	let str2 = str;

	getMatches( str2, regex ).forEach( m => str2 = str2.replaceAll( m, `gs${ gsId++ }` ) );
	return str2;
}

function rmCSSClass( str, clazz ) {
	return str.replaceAll( clazz, `gs${ gsId++ }` );
}

function rmCSSClassPrefix( str, prefix ) {
	return rmMatches( str, new RegExp( `${ prefix }-[a-zA-Z0-9-]+`, "ug" ) );
}

fs.readFile( "./index-prod.html", "utf8", ( err, fileContent ) => {
	let f = fileContent;

	f = fixURLs( f );
	f = rmCSSClass( f, "gsuiIcon" );
	f = rmCSSClassPrefix( f, "gsuiComButton" );
	f = rmCSSClassPrefix( f, "gsuiComPlayer" );
	f = rmCSSClassPrefix( f, "gsuiComProfile" );
	f = rmCSSClassPrefix( f, "gsuiActionMenu" );
	f = rmCSSClassPrefix( f, "gsuiPopup" );

	console.log( f );
} );
