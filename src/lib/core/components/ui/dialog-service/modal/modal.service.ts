import { ViewContainerRef, Injectable, Type, ComponentRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private viewContainerRef: ViewContainerRef;
	public activeInstances: number;
	public activeInstances$: Subject<number> = new Subject();
	public modalRef: ComponentRef<any>[] = [];

	constructor(protected injector: Injector, private resolver: ComponentFactoryResolver) {
	}

	public RegisterContainerRef(vcRef: ViewContainerRef) {
		this.viewContainerRef = vcRef;
	}

	public open<T>(component: Type<T>, parameters?: Object): Observable<ComponentRef<T>> {
		const componentRef$ = new ReplaySubject();
		const factory = this.resolver.resolveComponentFactory(component);
		const componentRef = factory.create(this.injector);

		if (!this.viewContainerRef) {
			alert('CanDeactivateGuard benötigt cmi-viaduc-modal-service-container Control');
			return null;
		}

		this.viewContainerRef.insert(componentRef.hostView);
		Object.assign(componentRef.instance, parameters);
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
		return <Observable<ComponentRef<T>>>componentRef$.asObservable();
		};
	}
}
