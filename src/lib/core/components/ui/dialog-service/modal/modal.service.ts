import { ViewContainerRef, Injectable, ComponentRef, Injector } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import {ConfirmationModalComponent} from '../dialogs/confirmation.modal.component';
import {BasicModalComponent} from '../dialogs/basic.modal.component';
import {CanDeactivateData} from '../../../../model';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private viewContainerRef: ViewContainerRef;
	public activeInstances: number;
	public activeInstances$: Subject<number> = new Subject();
	public modalRef: ComponentRef<any>[] = [];

	constructor(protected injector: Injector) {
	}

	public RegisterContainerRef(vcRef: ViewContainerRef) {
		this.viewContainerRef = vcRef;
	}

	public openDialog( parameters?: CanDeactivateData): Observable<ComponentRef<ConfirmationModalComponent>> {
		if (!this.viewContainerRef) {
			alert('CanDeactivateGuard benötigt cmi-viaduc-modal-service-container Control');
			return null;
		}

		const componentRef = this.viewContainerRef.createComponent(ConfirmationModalComponent, {injector: this.injector});
		componentRef.instance.candeactive = parameters;
		componentRef.instance.content = parameters.content;
		componentRef.instance.noButtonText = parameters.noButtonText;
		componentRef.instance.yesButtonText = parameters.yesButtonText;
		this.open(componentRef);
	}

	public openMessage( parameters?: CanDeactivateData) : Observable<ComponentRef<ConfirmationModalComponent>> {
		if (!this.viewContainerRef) {
			alert('CanDeactivateGuard benötigt cmi-viaduc-modal-service-container Control');
			return null;
		}

		const componentRef = this.viewContainerRef.createComponent(BasicModalComponent, {injector: this.injector});
		componentRef.instance.candeactive = parameters;
		componentRef.instance.content = parameters.content;
		componentRef.instance.closeButtonText = parameters.closeButtonText;

		this.open(componentRef);
	}

	private open<T>(componentRef: ComponentRef<T>)  {
		this.viewContainerRef.insert(componentRef.hostView);
		const componentRef$ = new ReplaySubject();
		this.viewContainerRef.insert(componentRef.hostView);
		this.activeInstances++;
		this.activeInstances$.next(this.activeInstances);
		componentRef.instance['componentIndex'] = this.activeInstances;
		componentRef.instance['destroy'] = () => {
			this.activeInstances--;
			this.activeInstances = Math.max(this.activeInstances, 0);

			const idx = this.modalRef.indexOf(componentRef);
			if (idx > -1) {
				this.modalRef.splice(idx, 1);
			}
			this.activeInstances$.next(this.activeInstances);
			componentRef.destroy();

			this.modalRef.push(componentRef);
			componentRef$.next(componentRef);
			componentRef$.complete();
		};
	}
}
