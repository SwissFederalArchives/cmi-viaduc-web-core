import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {TranslationService} from '../../services/translation.service';

@Component({
	selector: 'cmi-viaduc-breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
	@Input()
	public items: any[];

	constructor(private _router: Router,
				public txt: TranslationService) {
	}

	public open(item: any) {
		if (item.url) {
			this._router.navigate([item.url]);
		}
	}
}
