import {FieldType} from './fieldType';

export class SearchFieldDefinition {
	public type: FieldType;
	public key: string;
	public displayName: string;

	public constructor(type: FieldType, key?: string, displayName?: string) {
		this.type = type;
		this.key = key;
		this.displayName = displayName;
	}
}
