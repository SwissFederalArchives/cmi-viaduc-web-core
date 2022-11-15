import {NgModule, ModuleWithProviders, ErrorHandler} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ALL_COMPONENTS} from './components/_all';
import {ALL_DIRECTIVES} from './directives/_all';
import {ALL_PIPES} from './pipes/_all';
import {ALL_SERVICES} from './services/_all';
import {GlobalErrorHandler} from './services/globalErrorHandler';
import {ALL_RESOLVERS} from './routing/_all';
import {WijmoModule} from '../wijmo/index';
import JSZip from 'jszip';
import {TooltipModule} from '../tooltip/tooltip.module';
import { ArchiveModel } from './services/archiveModel';
import { ClientModel } from './services/clientModel';
import { CoreOptions } from './services/coreOptions';
import {ClientContext} from './services/clientContext';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';

window['JSZip'] = JSZip;

@NgModule({
	declarations: [
		...ALL_COMPONENTS,
		...ALL_DIRECTIVES,
		...ALL_PIPES,
	],
	exports: [
		...ALL_COMPONENTS,
		...ALL_DIRECTIVES,
		...ALL_PIPES,
		CommonModule,
		RouterModule,
		FormsModule,
		WijmoModule,
		TooltipModule
	],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		WijmoModule,
		HttpClientModule,
		TooltipModule
	]
})
export class CoreModule {

	constructor() {
	}

	public static forRoot(): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule,
			providers: [
				{ provide: ArchiveModel, useClass: ArchiveModel },
				{ provide: ClientModel, useClass: ClientModel },
				{ provide: CoreOptions, useClass: CoreOptions },
				{ provide: ClientContext, useClass: ClientContext, deps: [ClientModel] },
				{ provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
				{ provide: ErrorHandler, useClass: GlobalErrorHandler},
				...ALL_SERVICES,
				...ALL_PIPES,
				...ALL_RESOLVERS
			]
		};
	}
}
