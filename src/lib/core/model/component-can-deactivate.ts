import { HostListener, Directive } from '@angular/core';

@Directive()
export abstract class ComponentCanDeactivate {
	public abstract canDeactivate(): boolean;
	public abstract promptForMessage(): false | 'question' | 'message';
	public abstract message(): string;

	@HostListener('window:beforeunload', ['$event'])
	public unloadNotification($event: any) {
		if (!this.canDeactivate()) {
			$event.returnValue = true;
		}
	}

}
