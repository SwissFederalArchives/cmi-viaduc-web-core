import {NgModule} from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjGrid from '@grapecity/wijmo.angular2.grid';
import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { WjInputModule } from '@grapecity/wijmo.angular2.input';
import { WjGridFilterModule } from '@grapecity/wijmo.angular2.grid.filter';
import {WjGridGrouppanelModule} from '@grapecity/wijmo.angular2.grid.grouppanel';
import {WjCoreModule} from '@grapecity/wijmo.angular2.core';
import {WjAutoComplete} from '@grapecity/wijmo.angular2.input';
import {ALL_SERVICES} from './services/_all';
import {ALL_COMPONENTS} from './components/_all';
import JSZip from 'jszip';
import {CommonModule} from '@angular/common';
window['JSZip'] = JSZip;
import {WIJMO_LICENSEKEY} from './wijmo.licensekey';

@NgModule({
	declarations: [ALL_COMPONENTS],
	imports: [
		CommonModule,
		WjInputModule,
		WjGridFilterModule,
		WjGridModule
	],
	exports: [
		WjInputModule,
		WjCoreModule,
		WjGridModule,
		WjAutoComplete,
		WjGridFilterModule,
		WjGridGrouppanelModule,
		wjGrid.WjFlexGridCellTemplate,
		...ALL_COMPONENTS
	],
	providers: [
		...ALL_SERVICES
	]
})

export class WijmoModule {
	constructor() {
		wjcCore.setLicenseKey(WIJMO_LICENSEKEY);
	}
}
