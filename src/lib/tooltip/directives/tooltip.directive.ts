import { Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver} from '@angular/core';
import {TooltipContentComponent} from '../components/tooltip-content.component';

@Directive({
	selector: '[tooltip]'
})
export class TooltipDirective {

	private tooltip: ComponentRef<TooltipContentComponent>;
	private visible: boolean;

	constructor(private viewContainerRef: ViewContainerRef,
				private resolver: ComponentFactoryResolver) {
	}

	@Input('tooltip')
	public content: string|TooltipContentComponent;

	@Input()
	public tooltipDisabled: boolean;

	@Input()
	public tooltipAnimation = true;

	@Input()
	public tooltipPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

	@HostListener('focusin')
	@HostListener('mouseenter')
	public show(): void {
		if (this.tooltipDisabled || this.visible) {
			return;
		}

		this.visible = true;
		if (typeof this.content === 'string') {
			const factory = this.resolver.resolveComponentFactory(TooltipContentComponent);
			if (!this.visible) {
				return;
			}

			this.tooltip = this.viewContainerRef.createComponent(factory);
			this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
			this.tooltip.instance.content = this.content as string;
			this.tooltip.instance.placement = this.tooltipPlacement;
			this.tooltip.instance.animation = this.tooltipAnimation;
		} else {
			const tooltip = this.content as TooltipContentComponent;
			tooltip.hostElement = this.viewContainerRef.element.nativeElement;
			tooltip.placement = this.tooltipPlacement;
			tooltip.animation = this.tooltipAnimation;
			tooltip.show();
		}
	}

	@HostListener('focusout')
	@HostListener('mouseleave')
	public hide(): void {
		if (!this.visible) {
			return;
		}

		this.visible = false;
		if (this.tooltip) {
			this.tooltip.destroy();
		}

		if (this.content instanceof TooltipContentComponent) {
			(this.content as TooltipContentComponent).hide();
		}
	}
}
