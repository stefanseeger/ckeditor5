/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module uploadcare/ui/uploadcareformview
 */

import { type Locale } from 'ckeditor5/src/utils.js';
import { View } from 'ckeditor5/src/ui.js';

import * as LR from '@uploadcare/blocks';

/**
 * A class representing the form view of the Uploadcare feature.
 */
export default class UploadcareFormView extends View {
	/**
	 * @inheritDoc
	 */
	constructor( locale: Locale ) {
		super( locale );

		LR.registerBlocks( LR );

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-reset_all-excluded',
					'ck-uploadcare-form'
				]
			},
			children: [
				{
					tag: 'lr-file-uploader-inline',
					attributes: {
						'ctx-name': 'uploader'
					}
				}
			]
		} );
	}
}