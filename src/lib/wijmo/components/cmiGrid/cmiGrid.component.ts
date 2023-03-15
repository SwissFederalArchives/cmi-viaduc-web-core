import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	Inject,
	Injector, Input, Optional, Output,
	SkipSelf,
	ViewChild
} from '@angular/core';
import {WjFlexGrid, wjFlexGridMeta} from '@grapecity/wijmo.angular2.grid';
import {CollectionView, DataType, escapeHtml, Rect, SortDescription, Tooltip} from '@grapecity/wijmo';
import {CellRange, CellRangeEventArgs, CellType, Column, DataMap} from '@grapecity/wijmo.grid';
import {WijmoService} from '../../services/wijmo.service';
import {FilterType, FlexGridFilter, Operator} from '@grapecity/wijmo.grid.filter';
import {ODataCollectionView} from '@grapecity/wijmo.odata';
import {FlexGridXlsxConverter} from '@grapecity/wijmo.grid.xlsx';
import {Observable} from 'rxjs';

@Component ({
	selector: 'cmi-viaduc-grid',
	templateUrl: './cmiGrid.component.html',
	providers: [
		{ provide: 'WjComponent', useExisting: forwardRef(() => CmiGridComponent) },
		...wjFlexGridMeta.providers
	]
})
export class CmiGridComponent extends WjFlexGrid {

	@ViewChild('filter', { static: true })
	public filter: FlexGridFilter;

	@Input()
	/* name is used for saving gridsettings in session storage */
	public name: string;

	@Input()
	/* sets the visibility of the checkbox-selection column */
	public displaySelectionColumn = false;

	@Input()
	/* sets the default filter type (condition = 1, value = 2, both = 3) */
	public defaultFilterType = 1;

	@Input()
	/* if no sorts are session-saved, this column key is used for default sort (descending) */
	public defaultSortColumnKey: string;

	@Input()
	/* Gets or sets the pickervalues for column filter */
	public get dataMaps(): { [id: string]: DataMap; } {
		return this._dataMaps;
	}
	public set dataMaps(value: { [id: string]: DataMap; }) {
		if (this._dataMaps !== value) {
			this._dataMaps = value;
			this._updateFilterMaps();
		}
	}

	@Input()
	/* Gets or sets flag for enabling multicolumn sort */
	public get enableMultiSort(): boolean {
		return this._enableMultiSort;
	}
	public set enableMultiSort(value: boolean) {
		if (this._enableMultiSort !== value) {
			this._enableMultiSort = value;
		}
	}

	@Output('onFilterApplied')
	/* is called, when a filter on FlexGrid-filter is applied */
	public onFilterApplied: EventEmitter<any> = new EventEmitter<any>();

	/* Returns checkbox-selected items */
	public get checkedItems(): any[] {
		return Array.from(this.currentSelection.values());
	}

	public currentSelection: Set<object> = new Set<object>();

	/* Disables input, but supports selection */
	public disableInput = true;

	private _dataMaps: { [id: string]: DataMap; };
	private _enableMultiSort = false;

	private _sortGridSuffix = 'Sort';
	private _pagingGridSuffix = 'Pageing';
	private _pagingSizeSuffix = 'PageSize';
	private _filterGridSuffix = 'Filter';
	private _filterCompSuffix = 'FilterComp';
	private _selectedElementSuffix = 'selectedElement';
	private _isInitializing = false;
	private _byPassSessionSaveHandler = false;

	constructor(@Inject(ElementRef) elRef: ElementRef,
				@Inject(Injector) injector: Injector,
				@Inject('WjComponent') @SkipSelf() @Optional() parentCmp: any,
				@Inject(ChangeDetectorRef) cdRef: ChangeDetectorRef,
				private _wjs: WijmoService) {
		super(elRef, injector, parentCmp, cdRef);
	}

	/*  is called in the last line of any Wijmo component's constructor, and perform necessary initializations here. */
	public created() {
		this._isInitializing = true;
		setTimeout(() => {
			this._setDefaults();
			this._registerTooltips();
			this._restoreGridStateFromSessionStorage();

			this.filter.filterApplied.addHandler(this._onFilterAppliedInternal.bind(this));
			this.sortingColumn.addHandler((s, e) => {
				this._onSortingColumn(e as any);
			});
			this.itemFormatter = this._itemFormatterFunc.bind(this);
			this.loadedRows.addHandler(this._resetSelection.bind(this));
			this.updatedView.addHandler(this._onViewUpdated.bind(this));

		}, 0);
	}

	public dispose() {
		this.filter.filterApplied.removeAllHandlers();
		this.sortingColumn.removeAllHandlers();
		this.loadedRows.removeAllHandlers();
		this.updatedView.removeAllHandlers();

		super.dispose();
	}

	/* Handles the checbox selection */
	public addOrRemoveItemFromSelection(item: any, action: 'remove' | 'add' | 'toggle' = 'toggle'): void {
		if (!item) {
			return;
		}

		if (action === 'toggle') {
			if (this.currentSelection.has(item)) {
				this.currentSelection.delete(item);
			} else {
				this.currentSelection.add(item);
			}
		} else if (action === 'add') {
			if (!this.currentSelection.has(item)) {
				this.currentSelection.add(item);
			}
		} else {
			if (this.currentSelection.has(item)) {
				this.currentSelection.delete(item);
			}
		}

		this.refresh();
	}

	/* Runs excelexport for OData grids */
	public exportToExcelOData(fileName: string): Observable<void> {
		// Save current state
		this._byPassSessionSaveHandler = true;
		const oDataCol = this._getSourceAsODataCollectionView();
		const originPageSize = oDataCol.pageSize;
		const originPageIndex = oDataCol.pageIndex;

		// Load every page
		oDataCol.pageSize = 0;
		oDataCol.sortOnServer = false;
		oDataCol.pageOnServer = false;

		return new Observable<void>((obs) => {
			const onLoadedFuncExcel = () => {
				this._exportToExcelInternal(fileName).subscribe(() => {
					// Reset view to previous state when saved
					oDataCol.pageSize = originPageSize;
					oDataCol.pageOnServer = true;
					oDataCol.sortOnServer = true;

					oDataCol.loaded.removeHandler(onLoadedFuncExcel);
					oDataCol.moveToPage(originPageIndex);
					oDataCol.load();

					obs.next();
					obs.complete();
					this._byPassSessionSaveHandler = false;

				}, (err) => {
					// Reset view to previous state when saved
					oDataCol.pageSize = originPageSize;
					oDataCol.pageOnServer  = true;
					oDataCol.sortOnServer = true;

					oDataCol.loaded.removeHandler(onLoadedFuncExcel);
					oDataCol.moveToPage(originPageIndex);
					oDataCol.load();

					obs.error(err);
					obs.complete();
					this._byPassSessionSaveHandler = false;
				});
			};
			oDataCol.loaded.addHandler(onLoadedFuncExcel);
			oDataCol.load();
		});
	}

	/* Runs excelexport for client-side grids */
	public exportToExcel(fileName: string): Observable<void> {
		// Save current state
		this._byPassSessionSaveHandler = true;
		const colView = this._getSourceAsCollectionView();
		const originPageSize = colView.pageSize;
		const originPageIndex = colView.pageIndex;

		// Load every page
		colView.pageSize = 0;

		return new Observable<void>((obs) => {
			this._exportToExcelInternal(fileName).subscribe(() => {
				// Reset view to previous state when saved
				colView.pageSize = originPageSize;
				colView.moveToPage(originPageIndex);

				obs.next();
				obs.complete();
				this._byPassSessionSaveHandler = false;

			}, (err) => {
				// Reset view to previous state when saved
				colView.pageSize = originPageSize;
				colView.moveToPage(originPageIndex);

				obs.error(err);
				obs.complete();
				this._byPassSessionSaveHandler = false;
			});
		});
	}

	private _exportToExcelInternal(fileName: string): Observable<void> {
		return new Observable((observer) => {
			FlexGridXlsxConverter.saveAsync(this as any, {
				includeColumnHeaders: true,
				includeCellStyles: false,
				formatItem: this._wjs.replaceExcelCorruptionCharsCallback
			}, fileName, () => {
				observer.next();
				observer.complete();
			}, reason => {
				observer.error(reason);
				observer.complete();
			});
		});
	}

	/* Saves grid state to session storage, every time when grid is updated */
	private _onViewUpdated() {
		if (this._isInitializing || this._byPassSessionSaveHandler) {
			this._updateFilterMaps();
			this._setContainsOnConditionFilterColumns();
			return;
		}

		const dataSet = this._getSourceAsCollectionView();
		if (!dataSet) {
			return;
		}

		this._setItem(this.name + this._sortGridSuffix, dataSet.sortDescriptions && dataSet.sortDescriptions.length > 0
			? dataSet.sortDescriptions.map(s => {
				return { key: s.property, asc: s.ascending };
			}) : null);

		this._setItem(this.name + this._pagingSizeSuffix, dataSet ? dataSet.pageSize : null);

		const pageIndex = dataSet ? dataSet.pageIndex : null;
		this._setItem(this.name + this._pagingGridSuffix, pageIndex);

		const oDataSet = this._getSourceAsODataCollectionView();
		if (oDataSet) {
			this._setItem(this.name + this._filterGridSuffix, oDataSet && oDataSet.filterDefinition ? oDataSet.filterDefinition : null);
		}

		this._setItem(this.name + this._filterCompSuffix, this.filter ? this.filter.filterDefinition : null);

		// Selektierte Element speichern
		if (this.selection && this.selection.row >= 0 && this.selection.col >= 0) {
			this._setItem(this._getNameSelectedElement(dataSet, dataSet.pageIndex), this.selection.row);
			const pageCount = dataSet && dataSet.pageCount !== undefined ? dataSet.pageCount : 300;
			for (let i = 0; i < pageCount; i++) {
				if (i === dataSet.pageIndex) {
					continue;
				}

				const selectedItemSessionName = this._getNameSelectedElement(null, i);
				this._removeItem(selectedItemSessionName);
			}
		}

		this._updateFilterMaps();
		this._setContainsOnConditionFilterColumns();

	}

	private _getNameSelectedElement(dataSet: CollectionView, index?: number) {
		if (!dataSet || index === undefined || index == null) {
			return this.name + this._selectedElementSuffix;
		}

		const pageIndex = index ?  index : dataSet.pageIndex;
		return this.name + '_' + pageIndex + '_' + this._selectedElementSuffix;
	}

	/* Reset grid state to session storage */
	public resetGridState() {
		this._setItem(this.name + this._sortGridSuffix, null);
		this._setItem(this.name + this._pagingGridSuffix, null);
		this._setItem(this.name + this._pagingSizeSuffix, null);
		this._setItem(this.name + this._filterGridSuffix, null);
		this._setItem(this.name + this._filterCompSuffix, null);
		this._setItem(this.name + this._selectedElementSuffix, null);

		/* make sure, new columns has the filter map */
		this._updateFilterMaps();
	}

	private _restorePaging(isOData: boolean) {
		const colView = this._getSourceAsCollectionView();

		// Restoring Pageindex & Size
		const paging = this._getItem<number>(this.name + this._pagingGridSuffix);
		const pagingSize = this._getItem<number>(this.name + this._pagingSizeSuffix);

		// Restoring Pagingsize
		if (colView && pagingSize) {
			colView.pageSize = pagingSize;
		}

		if (colView && paging !== null && paging !== undefined) {

			if (isOData) {
				colView._pgIdx = paging; // moveToPage does not work, so we have to use the private property..

			} else {
				colView.moveToPage(paging);
			}
			colView.onPageChanged();
		}
	}

	private _restoreGridStateFromSessionStorage() {
		this._byPassSessionSaveHandler = true;
		const colView = this._getSourceAsCollectionView();
		const oDataView = this._getSourceAsODataCollectionView();
		const isOData = !!oDataView;

		// BE CAREFUL: the order of the restore functions are important and any change can break this function
		this._restoreSortExpressions(colView);
		this._restoreFilterDefinitions();
		if (isOData) {
			this._restoreOdataFilter(oDataView);
		}

		this._restorePaging(isOData);

		setTimeout(() => {
			this._restoreSelection(isOData ? oDataView : colView);
			this._byPassSessionSaveHandler = false;
		}, 1000);
	}

	private _restoreSelection(view: CollectionView) {
		this._resetSelection();
		if (!view) {
			return;
		}

		const selectedRow = this._getItem<number>(this._getNameSelectedElement(view, view.pageIndex));

		if (selectedRow && selectedRow >= 0) {
			this.select(new CellRange(selectedRow), true);
		}
	}

	private _restoreFilterDefinitions() {
		// Restoring FlexGrid Filter
		const filterWerte = this._getItem<string>(this.name + this._filterCompSuffix);
		if (this.filter && filterWerte) {
			this.filter.filterDefinition = filterWerte;
		}

		/* Snapshoting the values of the valuesfilter */
		if (this._dataMaps) {
			const filterValues = this.columns.map(c => {
				if (c.binding) {
					const cf = this.filter.getColumnFilter(c.binding);
					if (cf && cf.valueFilter.showValues) {
						return {key: c.binding, values: cf.valueFilter.showValues};
					}
				}
			});

			/* Restore datamaps for the valuepicker filters */
			this._updateFilterMaps();

			/* restoring snapshoted values of valuefilters  */
			for (const fv of filterValues) {
				if (fv) {
					const cf = this.filter.getColumnFilter(fv.key);
					cf.valueFilter.showValues = fv.values;
				}
			}
		}

		/* Appyling all column filters to the grid */
		this.filter.apply();
		this.onFilterApplied.next(filterWerte);
	}

	private _restoreOdataFilter(oDataView) {
		oDataView.oDataVersion = 4;

		const updatedViewHandler = () => {
			this.deferUpdate(() => {
				this._setContainsOnConditionFilterColumns();
			});

			this.loadedRows.removeHandler(updatedViewHandler);
		};

		oDataView.loaded.addHandler(updatedViewHandler);
		oDataView.onLoaded();

		// Restoring ODataFilter
		const filter = this._getItem<string>(this.name + this._filterGridSuffix);
		if (filter) {
			oDataView.filterDefinition = filter;
		}
	}

	private _restoreSortExpressions(colView) {
		const sorts = this._getItem<any[]>(this.name + this._sortGridSuffix);
		if (sorts) {
			for (const sort of sorts) {
				if (sort.key) {
					colView.sortDescriptions.push(new SortDescription(sort.key, sort.asc));
				}
			}
		} else {
			if (this.defaultSortColumnKey && this.defaultSortColumnKey.trim().length > 0) {
				// Standardmässig nach der Ersten Spalte (ohne Checkbox) sortieren
				const defaultSortCol = this.columns.filter(c => c.binding === this.defaultSortColumnKey)[0];
				if (defaultSortCol && defaultSortCol.binding) {
					colView.sortDescriptions.push(new SortDescription(defaultSortCol.binding, false));
				}
			}
		}
	}

	private _setContainsOnConditionFilterColumns() {
		this.filter.defaultFilterType = FilterType.Condition;

		for (const c of this.columns) {
			if (c.binding) {
				const col = this.filter.getColumnFilter(c.binding);

				if (!col || col.valueFilter && col.valueFilter.dataMap) {
					// when a datamap for valuefilter is provided, we dont activate the condition filter
					continue;
				}

				const cond = col.conditionFilter;
				if (c.dataType === DataType.String || c.dataType === DataType.Object) {
					cond.condition1.operator = !cond.condition1.operator ? Operator.CT : cond.condition1.operator;
				}
			}
		}
	}

	private _getItem<T>(key: string): T {
		const result = window.sessionStorage.getItem(key);
		if (result === 'undefined') {
			return null;
		}

		return <T>JSON.parse(result || null);
	}

	private _setItem(key: string, item: any): void {
		window.sessionStorage.setItem(key, JSON.stringify(item));
	}

	private _removeItem(key: string): void {
		window.sessionStorage.removeItem(key);
	}

	/* Displays a tooltip for every cell which has been clipped off */
	private _registerTooltips() {
		let range = null;
		const tooltip = new Tooltip();
		/* eslint-disable @typescript-eslint/no-this-alias */
		const flexGrid = this;
		/* eslint-enable @typescript-eslint/no-this-alias */
		this.hostElement.addEventListener('mousemove', function (e) {
			const ht = flexGrid.hitTest(e);
			if (!ht.range.equals(range)) {
				if (ht.cellType === CellType.Cell) {
					range = ht.range;
					const cellElement = document.elementFromPoint(e.clientX, e.clientY);

					const cellBounds = flexGrid.getCellBoundingRect(ht.row, ht.col);
					const data = escapeHtml(flexGrid.getCellData(range.row, range.col, true));

					if (cellElement.clientWidth !== cellElement.scrollWidth) {
						tooltip.show(flexGrid.hostElement, data, cellBounds);
					}
				} else if (ht.cellType === CellType.ColumnHeader) {
					range = ht.range;
					const cellElement = document.elementFromPoint(e.clientX, e.clientY);
					const column = flexGrid.columns[ht.col] as Column;
					const data = column.header;
					if (cellElement.clientWidth !== cellElement.scrollWidth) {

						const cellBounds = cellElement.getBoundingClientRect();
						const rect = new Rect(cellBounds.left, cellBounds.top, cellBounds.width, cellBounds.height);
						tooltip.show(flexGrid.hostElement, data, rect);
					}
				}

			}
		});

		flexGrid.hostElement.addEventListener('mouseout', function (e) {
			tooltip.hide();
		});
	}

	/* Sets cmi-defaultvalues for the grid */
	private _setDefaults() {
		this.selectionMode = 3;
		this.autoGenerateColumns = false;
	}

	public canEditCell(r: number, c: number): boolean {
		return !this.disableInput;
	}

	private _onFilterAppliedInternal(s, ev) {
		this.onFilterApplied.emit(ev);
	}

	/* Handles the multi-columnsort */
	private _onSortingColumn(e: CellRangeEventArgs) {
		if (!this.enableMultiSort) {
			return true;
		}

		// prevent grid from sorting, and add multi-column-sort
		e.cancel = true;

		let asc = true;

		// add multisort based on the column that was clicked
		if (e.col === null || e.col === undefined) {
			return;
		}

		const col = this.columns[e.col] as Column;
		if (col.binding === 'unknown') {
			return;
		}

		const collection = this._getSourceAsCollectionView();
		const existingSort = collection.sortDescriptions.filter(c => c.property === col.binding)[0] as SortDescription;
		if (existingSort) {
			asc = !existingSort.ascending;
			collection.sortDescriptions.remove(existingSort);
		}

		if (asc && existingSort) {
			return; // allow tripple state, clear filter on third click
		}

		const sd = new SortDescription(col.binding, asc);
		collection.sortDescriptions.push(sd);
	}

	private _getSourceAsODataCollectionView() {
		return (this.itemsSource instanceof ODataCollectionView) ? this.itemsSource as ODataCollectionView : null;
	}

	private _getSourceAsCollectionView() {
		return this.itemsSource as CollectionView;
	}

	/* Updates the column filterpicker values */
	private _updateFilterMaps() {
		if (!this._dataMaps) {
			return;
		}

		for (const cf of this.columns.map(c => c.binding ? this.filter.getColumnFilter(c.binding) : null)) {
			if (!cf || cf.valueFilter.dataMap !== undefined) {
				continue;
			}

			const key = cf.column.binding;
			if (!this._dataMaps.hasOwnProperty(key)) {
				continue;
			}

			const dm = this._dataMaps[key];
			this._wjs.setUpListColumn(this as any, this.filter, key, dm);
		}
	}

	private _resetSelection() {
		this.currentSelection = new Set<object>();
	}

	/* Formats the checkbox column */
	private _itemFormatterFunc = (panel, r, c, cell) => {
		if (panel.cellType === CellType.ColumnHeader) {
			const flex = panel.grid;
			const col = flex.columns[c] as Column;

			// check that this is a boolean column
			if (col.dataType === DataType.Boolean && col.header.trim().length === 0) {

				// prevent sorting on click
				col.allowSorting = false;

				// count true values to initialize checkbox
				let cnt = 0;
				for (let i = 0; i < flex.rows.length; i++) {
					const item = flex.rows[i].dataItem;
					if (this.currentSelection.has(item)) {
						cnt++;
					}
				}

				// create and initialize checkbox
				cell.innerHTML = '<input type="checkbox"> ' + cell.innerHTML;
				const cb = cell.firstChild;
				cb.checked = cnt > 0;
				cb.indeterminate = cnt > 0 && cnt < flex.rows.length;

				/* eslint-disable @typescript-eslint/no-this-alias */
				const flexGrid = this;
				/* eslint-enable @typescript-eslint/no-this-alias */
				// apply checkbox value to cells
				cb.addEventListener('click', function (e) {
					flex.beginUpdate();
					for (let i = 0; i < flex.rows.length; i++) {
						const item = flex.rows[i].dataItem;
						flexGrid.addOrRemoveItemFromSelection(item, cb.checked ? 'add' : 'remove');
					}
					flex.endUpdate();
				});
			}
		} else if (panel.cellType === CellType.Cell) {
			const input = cell.firstChild;
			if (!input) {
				return;
			}

			if (this.disableInput) {
				input.readOnly = true;
			}
		}
	}

	public onSelectionChanging(e: CellRangeEventArgs): boolean {
		if (!this.disableInput) {
			return super.onSelectionChanging(e);
		}

		return true;
	}

	public onBeginningEdit(e: CellRangeEventArgs): boolean {
		if (this.disableInput) {
			return super.onBeginningEdit(e);
		}

		const odata = this.collectionView as ODataCollectionView;

		if (odata) {
			odata.cancelEdit();
		}

		e.cancel = true;
		return false;
	}

}
