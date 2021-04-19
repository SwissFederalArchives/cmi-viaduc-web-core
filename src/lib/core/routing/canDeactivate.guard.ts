import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {ComponentCanDeactivate} from '../model/component-can-deactivate';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

	public canDeactivate(component: ComponentCanDeactivate): boolean {
		if (!component.canDeactivate()) {
			switch (component.promptForMessage()) {
				case 'message':
					alert(component.message());
					return false;
				case 'question':
					return confirm(component.message());
				case false:
					return false;
				default:
					return false;
			}
		}
		return true;
	}
}
