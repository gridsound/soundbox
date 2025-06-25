"use strict";

class GSSoundbox {
	#ctx = null;
	#elem = null;
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
		el.classList.add( "gsuiSoundbox" );
		document.body.addEventListener( "dragover", e => e.preventDefault(), false );
		document.body.addEventListener( "drop", e => {
			e.preventDefault();
			this.#ctx.resume();
			GSUgetFilesDataTransfert( e.dataTransfer.items ).then( fs => this.#loadFiles( fs ) );
		}, false );
		el.addEventListener( "mousedown", e => {
			if ( e.target.classList.contains( "gsuiSoundbox-cell" ) ) {
				if ( e.button === 0 ) {
					this.#playFile( e.target.dataset.id );
				} else if ( e.button === 2 ) {
					this.#stopFile( this.#stopItself ? null : e.target.dataset.id );
				}
			}
		}, false );
		el.addEventListener( "contextmenu", e => e.preventDefault(), false );
		el.addEventListener( "transitionend", e => {
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
		GSUdomQSA( this.#elem, ".gsuiSoundbox-cell" ).forEach( c => c.remove() );
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
		const cursors = GSUdomQSA( this.#elem, `${ id ? `[data-id="${ id }"] ` : "" }.gsuiSoundbox-cell-cursor` );

		cursors.forEach( el => el.remove() );
		if ( id ) {
			this.#buffers.get( id ).absnList.forEach( absn => absn.stop() );
		} else {
			this.#buffers.forEach( obj => obj.absnList.forEach( absn => absn.stop() ) );
		}
	}
	#createCursor( id, dur ) {
		const cell = GSUdomQS( this.#elem, `[data-id="${ id }"] .gsuiSoundbox-cell-wave` );
		const cursor = GSUcreateElement( "div", { class: "gsuiSoundbox-cell-cursor" } );

		if ( !this.#loop ) {
			cursor.style.transition = `${ dur * 3 }s linear left`;
		} else {
			cursor.style.animation = `gsuiSoundbox-cell-cursor-anim ${ dur }s linear infinite forwards`;
		}
		cell.append( cursor );
		if ( !this.#loop ) {
			GSUsetTimeout( () => cursor.style.left = "300%", .001 );
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
						GSSoundbox.#drawWave( id, buf, GSUdomQS( cell, "svg" ) );
						res( cell );
					}
					res( null );
				} );
			} );
		} );

		Promise.all( proms ).then( cells => this.#elem.append( ...cells.filter( Boolean ) ) );
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

		return GSUcreateElement( "button", { class: "gsuiSoundbox-cell", "data-id": id, title },
			GSUcreateElement( "div", { class: "gsuiSoundbox-cell-wave" },
				GSUcreateElementSVG( "svg" ),
			),
			GSUcreateElement( "div", { class: "gsuiSoundbox-cell-info" },
				GSUcreateElement( "div", { class: "gsuiSoundbox-cell-title" }, GSSoundbox.#formatTitle( name ) ),
				GSUcreateElement( "div", { class: "gsuiSoundbox-cell-duration" }, GSSoundbox.#formatDuration( dur ) ),
			),
		);
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
		const uiWave = new gsuiWaveform( svg );

		uiWave.$setResolution( 300, 60 );
		uiWave.drawBuffer( buf );
	}
}
