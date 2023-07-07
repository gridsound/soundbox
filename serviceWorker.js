"use strict";

self.addEventListener( "install", e => {
	e.waitUntil( caches.open( "soundbox1" ).then( cache => (
		cache.addAll( [
			"/",
			"/index.html",
			"/manifest.json",
			"/assets/favicon.png",
			"/assets/fonts/fa-duotone-900.woff2",
			"/assets/fonts/montserrat-500-latin.woff2",
			"/assets/fonts/montserrat-700-latin.woff2",
		] )
	) ) );
} );

self.addEventListener( "fetch", e => {
	e.respondWith(
		fetch( e.request ).catch( () => caches.match( e.request ) )
	);
} );
