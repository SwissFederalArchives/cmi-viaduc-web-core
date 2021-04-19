import {GroupOperator} from './groupOperator';
import {FieldOperator} from './fieldOperator';
import {FieldType} from './fieldType';

export interface SearchModel {
	searchGroups: SearchGroup[];
	groupOperator: GroupOperator;
}

export interface SearchGroup {
	searchFields: SearchField[];
	fieldOperator: FieldOperator;
}

export interface SearchField {
	type: FieldType;
	key: string;
	value: string;
}
