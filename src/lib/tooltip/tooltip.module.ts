import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipDirective} from './directives/tooltip.directive';
import {TooltipContentComponent} from './components/tooltip-content.component';

export * from './directives/tooltip.directive';
export * from './components/tooltip-content.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		TooltipDirective,
		TooltipContentComponent,
	],
	exports: [
		TooltipDirective,
		TooltipContentComponent,
	],
	entryComponents: [
		TooltipContentComponent
	]
})
export class TooltipModule {

}
