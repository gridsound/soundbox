"use strict";

class GSSoundbox {
	#ctx = null;
	#elem = null;
	#ctxDest = null;
	#buffers = new Map();
	#stopItself = false;
	#nextId = 0;

	constructor() {
		this.#ctx = new AudioContext();
		this.#ctxDest = this.#ctx.createGain();
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
			GSSoundbox.#getFilesWebkitDataTransferItems( e.dataTransfer.items )
				.then( files => this.#loadFiles( files ) );
		}, false );
		el.addEventListener( "mousedown", e => {
			if ( e.target.classList.contains( "gsuiSoundbox-cell" ) ) {
				if ( e.button === 0 ) {
					this.#playFile( e.target.dataset.id );
				} else if ( e.button === 2 ) {
					this.#stopFile( e.target.dataset.id );
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
	clear() {
		this.#buffers.forEach( obj => obj.absnList.forEach( absn => absn.stop() ) );
		this.#buffers.clear();
		this.#elem.querySelectorAll( ".gsuiSoundbox-cell" ).forEach( c => c.remove() );
	}
	stopItself( b ) {
		this.#stopItself = b;
	}

	// .........................................................................
	#playFile( id ) {
		const absn = this.#ctx.createBufferSource();
		const obj = this.#buffers.get( id );

		if ( this.#stopItself ) {
			const cursors = this.#elem.querySelectorAll( `[data-id="${ id }"] .gsuiSoundbox-cell-cursor` );

			obj.absnList.forEach( absn => absn.stop() );
			cursors.forEach( el => el.remove() );
		}
		absn.buffer = obj.buffer;
		absn.connect( this.#ctxDest );
		absn.start();
		obj.absnList.push( absn );
		this.#createCursor( id, obj.buffer.duration );
	}
	#stopFile( id ) {
		const obj = this.#buffers.get( id );
		const cursors = this.#elem.querySelectorAll( `[data-id="${ id }"] .gsuiSoundbox-cell-cursor` );

		obj.absnList.forEach( absn => absn.stop() );
		cursors.forEach( el => el.remove() );
	}
	#createCursor( id, dur ) {
		const cell = this.#elem.querySelector( `[data-id="${ id }"] .gsuiSoundbox-cell-wave` );
		const cursor = GSUI.$createElement( "div", { class: "gsuiSoundbox-cell-cursor" } );

		cursor.style.transitionDuration = `${ dur * 3 }s`;
		cell.append( cursor );
		setTimeout( () => cursor.style.left = "300%", 1 );
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
						const cell = GSSoundbox.#createCell( id, f.name );

						this.#buffers.set( id, {
							buffer: buf,
							absnList: [],
						} );
						GSSoundbox.#drawWave( id, buf, cell.querySelector( "svg" ) );
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
				this.#ctx.decodeAudioData( e.target.result ).then( res, () => res(null) );
			};
			rd.readAsArrayBuffer( file );
		} );
	}
	static #createCell( id, name ) {
		return GSUI.$createElement( "button", { class: "gsuiSoundbox-cell", "data-id": id, title: name },
			GSUI.$createElement( "div", { class: "gsuiSoundbox-cell-wave" },
				GSUI.$createElementSVG( "svg" ),
			),
			GSUI.$createElement( "div", { class: "gsuiSoundbox-cell-title" }, GSSoundbox.#removeExtension( name ) ),
		);
	}
	static #removeExtension( name ) {
		const lastPnt = name.lastIndexOf( "." );

		return lastPnt > -1
			? name.substr( 0, lastPnt )
			: name;
	}
	static #drawWave( id, buf, svg ) {
		const uiWave = new gsuiWaveform( svg );

		uiWave.setResolution( 300, 60 );
		uiWave.drawBuffer( buf );
	}
	static #getFilesWebkitDataTransferItems( dataTransferItems ) {
		const files = [];

		return new Promise( res => {
			const proms = [];

			for ( let it of dataTransferItems ) {
				proms.push( GSSoundbox.#traverseFileTreePromise( files, it.webkitGetAsEntry() ) );
			}
			Promise.all( proms ).then( () => res( files ) );
		} );
	}
	static #traverseFileTreePromise( files, item, path = "" ) {
		return new Promise( res => {
			if ( item.isFile ) {
				item.file( f => {
					f.filepath = path + f.name;
					files.push( f );
					res( f );
				} );
			} else if ( item.isDirectory ) {
				const dirReader = item.createReader();

				dirReader.readEntries( entries => {
					const proms = [];

					for ( let ent of entries ) {
						proms.push( GSSoundbox.#traverseFileTreePromise( files, ent, path + item.name + "/" ) );
					}
					res( Promise.all( proms ) );
				} );
			}
		} );
	}
}
