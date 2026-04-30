"use strict";

class GSSoundbox {
	#ctx = null;
	#elem = $noop;
	#loop = false;
	#ctxDest = null;
	#buffers = new Map();
	#stopItself = false;
	#nextId = 0;

	constructor() {
		this.#ctx = GSUaudioContext();
		this.#ctxDest = GSUaudioGain( this.#ctx );
		this.#ctxDest.connect( this.#ctx.destination );
	}

	// .........................................................................
	init( el ) {
		this.#elem = el;
		el.$addClass( "gsuiSoundbox" );
		$body.$addEventListener( "dragover", e => e.preventDefault(), false );
		$body.$addEventListener( "drop", e => {
			e.preventDefault();
			this.#ctx.resume();
			GSUgetFilesDataTransfert( e.dataTransfer.items ).then( fs => this.#loadFiles( fs ) );
		}, false );
		el.$addEventListener( "mousedown", e => {
			if ( e.target.classList.contains( "gsuiSoundbox-cell" ) ) {
				if ( e.button === 0 ) {
					this.#playFile( e.target.dataset.id );
				} else if ( e.button === 2 ) {
					this.#stopFile( this.#stopItself ? null : e.target.dataset.id );
				}
			}
		}, false );
		el.$addEventListener( "contextmenu", e => e.preventDefault(), false );
		el.$addEventListener( "transitionend", e => {
			if ( e.target.classList.contains( "gsuiSoundbox-cell-cursor" ) ) {
				e.target.remove();
			}
		}, false );
	}
	$stop() {
		this.#stopFile();
	}
	clear() {
		this.#buffers.forEach( obj => obj.absnList.forEach( absn => absn.stop() ) );
		this.#buffers.clear();
		this.#elem.$query( ".gsuiSoundbox-cell" ).$remove();
	}
	stopItself( b ) {
		this.#stopItself = b;
	}
	setGain( v ) {
		this.#ctxDest.gain.value = v;
	}
	$setLoop( b ) {
		this.#loop = !!b;
	}

	// .........................................................................
	#playFile( id ) {
		const absn = GSUaudioBufferSource( this.#ctx );
		const obj = this.#buffers.get( id );

		if ( this.#stopItself ) {
			this.#stopFile();
		}
		absn.loop = this.#loop;
		absn.buffer = obj.buffer;
		absn.connect( this.#ctxDest );
		absn.start();
		obj.absnList.push( absn );
		this.#createCursor( id, obj.buffer.duration );
	}
	#stopFile( id ) {
		this.#elem.$query( `${ id ? `[data-id="${ id }"] ` : "" }.gsuiSoundbox-cell-cursor` ).$remove();
		if ( id ) {
			this.#buffers.get( id ).absnList.forEach( absn => absn.stop() );
		} else {
			this.#buffers.forEach( obj => obj.absnList.forEach( absn => absn.stop() ) );
		}
	}
	#createCursor( id, dur ) {
		const cell = this.#elem.$query( `[data-id="${ id }"] .gsuiSoundbox-cell-wave` );
		const cursor = $( "<div>" ).$addClass( "gsuiSoundbox-cell-cursor" );

		!this.#loop
			? cursor.$css( "transition", `${ dur * 3 }s linear left` )
			: cursor.$css( "animation", `gsuiSoundbox-cell-cursor-anim ${ dur }s linear infinite forwards` );
		cell.$append( cursor );
		if ( !this.#loop ) {
			GSUsetTimeout( () => cursor.$left( 300, "%" ), .001 );
		}
	}
	#getNextId() {
		return `${ this.#nextId++ }`;
	}
	#loadFiles( files ) {
		const proms = Array.from( files ).map( f => {
			return new Promise( res => {
				const id = this.#getNextId();

				this.#loadFile( id, f ).then( buf => {
					if ( buf ) {
						const cell = GSSoundbox.#createCell( id, f.name, buf.duration );

						this.#buffers.set( id, {
							buffer: buf,
							absnList: [],
						} );
						GSSoundbox.#drawWave( id, buf, cell.$query( "svg" ) );
						res( cell );
					}
					res( null );
				} );
			} );
		} );

		Promise.all( proms ).then( cells => this.#elem.$append( ...cells.filter( Boolean ) ) );
	}
	#loadFile( id, file ) {
		return new Promise( res => {
			const rd = new FileReader();

			rd.onload = e => {
				this.#ctx.decodeAudioData( e.target.result ).then( res, () => res( null ) );
			};
			rd.readAsArrayBuffer( file );
		} );
	}
	static #createCell( id, name, dur ) {
		const title = `${ name } (${ GSSoundbox.#formatDuration( dur ) })`;

		return $( $.$button( { class: "gsuiSoundbox-cell", "data-id": id, title },
			$.$div( { class: "gsuiSoundbox-cell-wave" },
				$.$elem( "svg" ),
			),
			$.$div( { class: "gsuiSoundbox-cell-info" },
				$.$div( { class: "gsuiSoundbox-cell-title" }, GSSoundbox.#formatTitle( name ) ),
				$.$div( { class: "gsuiSoundbox-cell-duration" }, GSSoundbox.#formatDuration( dur ) ),
			),
		) );
	}
	static #formatTitle( name ) {
		const lastPnt = name.lastIndexOf( "." );

		return lastPnt > -1
			? name.substring( 0, lastPnt )
			: name;
	}
	static #formatDuration( dur ) {
		return `${ dur.toFixed( 3 ) }s`;
	}
	static #drawWave( id, buf, svg ) {
		const uiWave = new gsuiWaveform( svg.$get( 0 ) );

		uiWave.$setResolution( 300, 60 );
		uiWave.$drawBuffer( buf );
	}
}
