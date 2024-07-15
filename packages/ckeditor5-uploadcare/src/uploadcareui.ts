/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module uploadcare/uploadcareui
 * @publicApi
 */

import { Plugin } from 'ckeditor5/src/core.js';
import {
	addListToDropdown,
	createDropdown,
	ViewModel,
	Dialog,
	type ListDropdownItemDefinition,
	type ButtonExecuteEvent
} from 'ckeditor5/src/ui.js';

import imageUploadIcon from '../theme/icons/image-upload.svg';
import { Collection } from 'ckeditor5/src/utils.js';
import UploadcareFormView from './ui/uploadcareformview.js';

import '../theme/uploadcare-form.css';
import '@uploadcare/blocks/web/lr-file-uploader-inline.min.css';

// TODO: move it to the config.
const PREDEFINED_BUTTONS = [
	{ icon: imageUploadIcon, type: 'url', text: 'Insert using URL' },
	{ icon: imageUploadIcon, type: 'camera', text: 'Insert using camera' },
	{ icon: imageUploadIcon, type: 'gdrive', text: 'Insert using Google Drive' }
];

/**
 * The UI plugin of the AI assistant.
 */
export default class UploadcareUI extends Plugin {
	/**
	 * The dialog plugin instance.
	 *
	 * @internal
	 */
	private _dialog!: Dialog;

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'UploadcareUI' as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [ Dialog ] as const;
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const { editor } = this;
		const { t } = editor;
		const uploadcareCommand = editor.commands.get( 'uploadcare' );

		if ( !uploadcareCommand ) {
			return;
		}

		this._dialog = editor.plugins.get( Dialog );

		editor.ui.componentFactory.add( 'uploadcare', locale => {
			const dropdown = createDropdown( locale );
			const listItems = new Collection<ListDropdownItemDefinition>(
				PREDEFINED_BUTTONS.map( definition => this._getButtonDefinition( definition.type, definition.text, definition.icon ) )
			);

			addListToDropdown( dropdown, listItems, {
				role: 'menu'
			} );

			this.listenTo<ButtonExecuteEvent>( dropdown, 'execute', evt => {
				const { _type } = evt.source;
				const form = new UploadcareFormView( locale );

				this._dialog.show( {
					id: 'uploadCare',
					icon: imageUploadIcon,
					title: t( 'Uploadcare' ),
					content: form,
					onShow: () => {
						uploadcareCommand.execute( _type );
					},
					onHide: () => {
						uploadcareCommand.fire( 'uploadcare:close' );
					}
				} );
			} );

			dropdown.buttonView.set( {
				label: t( 'Uploadcare' ),
				icon: imageUploadIcon,
				tooltip: true
			} );

			dropdown.on( 'change:isOpen', ( evt, name, isOpen ) => {
				console.log( isOpen );
			} );

			return dropdown;
		} );
	}

	/**
	 * Returns a definition of the upload button to be used in the dropdown.
	 */
	private _getButtonDefinition( type: string, label: string, icon: string ): ListDropdownItemDefinition {
		return {
			type: 'button' as const,
			model: new ViewModel( {
				label,
				icon,
				withText: true,
				withKeystroke: true,
				role: 'menuitem',
				_type: type
			} )
		};
	}
}