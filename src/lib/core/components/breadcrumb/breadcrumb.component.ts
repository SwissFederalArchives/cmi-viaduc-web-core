import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {Router} from '@angular/router';
import {TranslationService} from '../../services/translation.service';
import {Utilities} from '../../includes';

@Component({
	selector: 'cmi-viaduc-breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements AfterViewInit {
	@Input()
	public items: any[];
	private readonly _elem: any;

	constructor(private _elemRef: ElementRef,
				private _router: Router,
				public txt: TranslationService) {
		this._elem = this._elemRef.nativeElement;
	}

	public ngAfterViewInit(): void {
		Utilities.initJQForElement(this._elem);
	}

	public open(item: any) {
		if (item.url) {
			this._router.navigate([item.url]);
		}
	}
}
