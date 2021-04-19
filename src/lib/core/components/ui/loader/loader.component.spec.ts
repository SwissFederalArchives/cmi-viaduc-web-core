import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {LoaderComponent} from './loader.component';
import {By} from '@angular/platform-browser';

describe('LoaderComponent', function () {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoaderComponent]
		}).compileComponents();
	}));

	let fixture: ComponentFixture<LoaderComponent>;
	let component: LoaderComponent;
	let debugElement: DebugElement;

	beforeEach(() => {
		fixture = TestBed.createComponent(LoaderComponent);
		component = fixture.componentInstance;
		debugElement = fixture.debugElement;
	});

	it('should create component', () => expect(component).toBeDefined());

	it('should not set visible class', () => {
		fixture.detectChanges();

		expect(debugElement.nativeElement.classList).not.toContain('cmi-visible');
	});

	it('should hide hint element', () => {
		fixture.detectChanges();

		expect(debugElement.query(By.css('p'))).toBe(null);
	});

	it('should show hint element with hint', () => {
		component.options.hint = 'Do or do not, there is no try.';

		fixture.detectChanges();
		expect(debugElement.query(By.css('p'))).toBeDefined();
	});
});
