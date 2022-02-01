import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WjInputModule} from '@grapecity/wijmo.angular2.input';
import {WjGridModule} from '@grapecity/wijmo.angular2.grid';
import {CmiGridComponent} from './cmiGrid.component';
import {WjGridFilterModule} from '@grapecity/wijmo.angular2.grid.filter';
import {WijmoService} from '../../services';
import {CollectionView} from '@grapecity/wijmo';
import {FilterType, Operator} from '@grapecity/wijmo.grid.filter';
import {DataMap} from '@grapecity/wijmo.grid';

describe('CmiGridComponent', () => {
	let fixture: ComponentFixture<CmiGridComponent>;
	let grid: CmiGridComponent;
	let gridNativeElement: HTMLElement;

	let collectionView: CollectionView;
	let uniqueValues: any;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				CmiGridComponent
			],
			imports: [
				WjInputModule,
				WjGridModule,
				WjGridFilterModule,
			],
			providers: [
				WijmoService,
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CmiGridComponent);
		grid = fixture.componentInstance;
		gridNativeElement = fixture.nativeElement;

		let datasource = [
			{
				Id: 5,
				Country: 'US',
				User: 'Darth Vader'
			}, {
				Id: 1,
				Country: 'CH',
				User: 'Luke Skywalker'
			},
			{
				Id: 2,
				Country: 'CH',
				User: 'Leia'
			},
			{
				Id: 3,
				Country: 'DE',
				User: 'Chewbacca'
			}
		];

		collectionView = null;
		collectionView = new CollectionView(datasource);

		grid.itemsSource = collectionView;
		grid.autoGenerateColumns = true;
		grid.name = 'testinggrid';

		grid.refreshCells(true);

		fixture.whenRenderingDone().then(() => {
			collectionView.sortDescriptions.clear();
			fixture.detectChanges();
		});
	}));

	it(`should have set the correct default values`, () => {
		expect(grid.defaultSortColumnKey).toBeFalsy();
		expect(grid.checkedItems.length).toBe(0);
		expect(grid.selectionMode).toBe(3);
		expect(grid.filter.defaultFilterType).toBe(FilterType.Condition);
	});

	it(`should display the "Id" column header`, () => {
		const elem: Element | null = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[0];

		expect(elem).toBeDefined();
		expect(elem.textContent).toEqual('Id');
	});

	it(`should display the "Country" column header`, () => {
		const elem: Element | null = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[1];

		expect(elem).toBeDefined();
		expect(elem.textContent).toEqual('Country');
	});

	describe('sorting', () => {
		it('should be able to sort ascending a single column', () => {
			const countryHeader = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[1] as HTMLElement;
			countryHeader.click();

			grid.refreshCells(true);
			fixture.detectChanges();

			const elem: Element | null = gridNativeElement.querySelectorAll('.wj-cells .wj-cell:not([role="columnheader"])')[1];
			expect(elem).toBeDefined();
			expect(collectionView.sortDescriptions.length).toBe(1);
			expect(elem.textContent).toEqual('CH');
		});

		it('should be able to multisort on two columns', async(() => {
			grid.enableMultiSort = true;
			grid.refresh(true);
			fixture.detectChanges();

			fixture.whenRenderingDone().then(() => {
				fixture.detectChanges();

				const countryHeader = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[1] as HTMLElement;
				countryHeader.click();

				const idHeader = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[0] as HTMLElement;
				idHeader.click();
				idHeader.click();

				grid.refreshCells(true);
				fixture.detectChanges();

				expect(collectionView.sortDescriptions.length).toBe(2);
				expect(collectionView.sortDescriptions[0].property).toBe('Country');
				expect(collectionView.sortDescriptions[0].ascending).toBe(true);

				expect(collectionView.sortDescriptions[1].property).toBe('Id');
				expect(collectionView.sortDescriptions[1].ascending).toBe(false);

				const elem: Element | null = gridNativeElement.querySelectorAll('.wj-cells .wj-cell:not([role="columnheader"])')[0];
				expect(elem).toBeDefined();
				expect(elem.textContent).toEqual('2');
			});
		}));

		it('should save sortexpression in session', async(() => {
			let spy = spyOn<Storage>(window.sessionStorage, 'setItem');

			const countryHeader = gridNativeElement.querySelectorAll('.wj-row .wj-cell[role="columnheader"]')[1] as HTMLElement;
			countryHeader.click();
			grid.refreshCells(true);
			fixture.detectChanges();

			let args = spy.calls.all().filter(c => (c.args[0] as string).indexOf('Sort') >= 0).map(c => c.args[1]);
			let arg = args[0];
			expect(arg).toBe( '[{"key":"Country","asc":true}]');
		}));
	});

	describe('filtering', () => {
		beforeEach(() => {
			grid.onUpdatedView();
		});

		it('should set "contains" on condition filters on string columns per default', () => {
			let colFilter = grid.filter.getColumnFilter(2);

			expect(colFilter.conditionFilter.condition1.operator).toBe(Operator.CT);
			expect(colFilter.conditionFilter.condition2.operator).toBe(null);
		});

		it('should NOT set "contains" on condition filters on number columns per default', () => {
			let colFilter = grid.filter.getColumnFilter(0);

			expect(colFilter.conditionFilter.condition1.operator).toBe(null);
			expect(colFilter.conditionFilter.condition2.operator).toBe(null);
		});

		it('should save condition filters in session', () => {
			let colFilter = grid.filter.getColumnFilter(2);

			colFilter.conditionFilter.condition1.operator = Operator.CT;
			colFilter.conditionFilter.condition1.value = 'Leia';

			grid.filter.apply();

			grid.refresh(true);
			fixture.detectChanges();

			const elem: Element | null = gridNativeElement.querySelectorAll('.wj-cells .wj-cell:not([role="columnheader"])')[2];
			expect(elem).toBeDefined();
			expect(elem.textContent).toEqual('Leia');
			expect(grid.rows.length).toBe(1);
		});

		describe('when datamaps are given', (() => {
			beforeEach(async(async() => {
				uniqueValues = [];

				collectionView.items.forEach(i => {
					if (!uniqueValues.find(u => u.key === i.Country)) {
						uniqueValues.push(<any> { key: i.Country, value: i.Country });
					}
				});

				grid.dataMaps = <any> {
					Country: new DataMap(uniqueValues, 'key', 'value')
				};
				grid.refresh(true);
				grid.onUpdatedView();
				fixture.detectChanges();

				await fixture.whenRenderingDone();
				fixture.detectChanges();
			}));

			it('should provide a value picker', () => {
				fixture.detectChanges();
				let colFilter = grid.filter.getColumnFilter(1);
				expect(colFilter.filterType).toBe(FilterType.Value);
				expect(colFilter.valueFilter.uniqueValues).toEqual(uniqueValues.map(u => u.key));
			});

			it('should still set the condition filter on string columns without datamaps to "contains"', () => {
				fixture.detectChanges();
				let colFilter = grid.filter.getColumnFilter(2);

				expect(colFilter.conditionFilter.condition1.operator).toBe(Operator.CT);
				expect(colFilter.conditionFilter.condition2.operator).toBe(null);
			});
		}));
	});
});
