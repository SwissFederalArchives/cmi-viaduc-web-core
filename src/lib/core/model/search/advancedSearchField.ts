import {SearchField} from './searchModel';
import {FieldType} from './fieldType';

export class AdvancedSearchField implements SearchField {
	public type: FieldType;
	public key: string;
	public value: string;

	public id: string;
	public autoFocus?: boolean;
	public containsValidationErrors: boolean;

}
