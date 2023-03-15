import {Injectable} from '@angular/core';
import {DataMap, FlexGrid} from '@grapecity/wijmo.grid';
import {FilterType, FlexGridFilter} from '@grapecity/wijmo.grid.filter';

@Injectable()
export class WijmoService {
	private regExp = /[(\u0000-\u0008|\u000B-\u000C|\u000E-\u001F)]/g;

	public setUpListColumn(grid: FlexGrid, filter: FlexGridFilter, key: string, dataMap: DataMap) {
		if (!grid || !grid.columns.getColumn(key)) {
			return;
		}

		this.setUpColumn(grid, filter, key, dataMap);
	}

	private setUpColumn(grid: FlexGrid, filter: FlexGridFilter, key: string, dataMap: DataMap) {
		if (filter.getColumnFilter(key).valueFilter.dataMap !== undefined) {
			return;
		}

		grid.columns.getColumn(key).dataMap = dataMap;
		const cf = filter.getColumnFilter(key);

		cf.filterType = FilterType.Value;
		cf.valueFilter.dataMap = dataMap;
		cf.valueFilter.uniqueValues = dataMap.getDisplayValues();
	}

	public getDataMap(enumClass, translateFn: (val) => string) {
		const pairs = [];
		for (const key of Object.keys(enumClass)) {
			const val: number = parseInt(key, 10);
			if (!isNaN(val)) {
				pairs.push({ key: val, name: translateFn(enumClass[enumClass[val]]) });
			}
		}
		return new DataMap(pairs, 'key', 'name');
	}

	public replaceExcelCorruptionCharsCallback(args: any) {
		// Beim Callback sind this Parameter null
		const regEx = /[(\u0000-\u0008|\u000B-\u000C|\u000E-\u001F)]/g;
		if (args.xlsxCell && args.xlsxCell.formula) {
			args.xlsxCell.value = '\'' + args.xlsxCell.formula;
			args.xlsxCell.formula = null;
		}

		if (args.xlsxCell && args.xlsxCell.value && typeof args.xlsxCell.value === 'string') {
			args.xlsxCell.value = args.xlsxCell.value.replace(regEx, '');
		}
	}

	public replaceExcelCorruptionChars(str: string): string {
		let result = str.replace(this.regExp, '');
		if (result[0] === '=') {
			result = '\'' + result ;
		}
		return result;
	}
}
