import {AdvancedSearchField} from './advancedSearchField';

export interface DropdownSearchFieldValue {
	value: string;
	label: string;
}

export class DropdownSearchField extends AdvancedSearchField {
	public values: DropdownSearchFieldValue[];
}
