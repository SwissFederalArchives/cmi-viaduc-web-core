
export interface ICollection {
	collectionId: number;
	parentId?: number | undefined;
	title?: string | undefined;
	descriptionShort?: string | undefined;
	description?: string | undefined;
	validFrom: Date;
	validTo: Date;
	collectionTypeId: number;
	image?: string | undefined;
	imageAltText?: string | undefined;
	link?: string | undefined;
	sortOrder: number;
	createdOn: Date;
	createdBy?: string | undefined;
	modifiedOn?: Date | undefined;
	modifiedBy?: string | undefined;
	childCollections?: Collection[] | undefined;
	parent?: Collection | undefined;
}

export class Collection implements ICollection {
	public collectionId: number;
	public parentId?: number | undefined;
	public title?: string | undefined;
	public descriptionShort?: string | undefined;
	public description?: string | undefined;
	public validFrom!: Date;
	public validTo!: Date;
	public collectionTypeId!: number;
	public image?: string | undefined;
	public imageAltText?: string | undefined;
	public link?: string | undefined;
	public sortOrder!: number;
	public createdOn!: Date;
	public createdBy?: string | undefined;
	public modifiedOn?: Date | undefined;
	public modifiedBy?: string | undefined;
	public childCollections?: Collection[] | undefined;
	public parent?: Collection | undefined;

	constructor(data?: ICollection) {
		if (data) {
			for (let property in data) {
				if (data.hasOwnProperty(property)) {
					(<any>this)[property] = (<any>data)[property];
				}
			}
		}
	}

	public init(_data?: any) {
		if (_data) {
			this.collectionId = _data['CollectionId'];
			this.parentId = _data['ParentId'];
			this.title = _data['Title'];
			this.descriptionShort = _data['DescriptionShort'];
			this.description = _data['Description'];
			this.validFrom = _data['ValidFrom'] ? new Date(_data['ValidFrom'].toString()) : <any>undefined;
			this.validTo = _data['ValidTo'] ? new Date(_data['ValidTo'].toString()) : <any>undefined;
			this.collectionTypeId = _data['CollectionTypeId'];
			this.image = _data['Image'];
			this.imageAltText = _data['ImageAltText'];
			this.link = _data['Link'];
			this.sortOrder = _data['SortOrder'];
			this.createdOn = _data['CreatedOn'] ? new Date(_data['CreatedOn'].toString()) : <any>undefined;
			this.createdBy = _data['CreatedBy'];
			this.modifiedOn = _data['ModifiedOn'] ? new Date(_data['ModifiedOn'].toString()) : <any>undefined;
			this.modifiedBy = _data['ModifiedBy'];
			if (Array.isArray(_data['ChildCollections'])) {
				this.childCollections = [] as any;
				for (let item of _data['ChildCollections']) {
					this.childCollections!.push(Collection.fromJS(item));
				}
			}
			this.parent = _data['Parent'] ? Collection.fromJS(_data['Parent']) : <any>undefined;
		}
	}

	public static fromJS(data: any): Collection {
		data = typeof data === 'object' ? data : {};
		let result = new Collection();
		result.init(data);
		return result;
	}

	public toJSON(data?: any) {
		data = typeof data === 'object' ? data : {};
		data['CollectionId'] = this.collectionId;
		data['ParentId'] = this.parentId;
		data['Title'] = this.title;
		data['DescriptionShort'] = this.descriptionShort;
		data['Description'] = this.description;
		data['ValidFrom'] = this.validFrom ? this.validFrom.toISOString() : <any>undefined;
		data['ValidTo'] = this.validTo ? this.validTo.toISOString() : <any>undefined;
		data['CollectionTypeId'] = this.collectionTypeId;
		data['Image'] = this.image;
		data['ImageAltText'] = this.imageAltText;
		data['Link'] = this.link;
		data['SortOrder'] = this.sortOrder;
		data['CreatedOn'] = this.createdOn ? this.createdOn.toISOString() : <any>undefined;
		data['CreatedBy'] = this.createdBy;
		data['ModifiedOn'] = this.modifiedOn ? this.modifiedOn.toISOString() : <any>undefined;
		data['ModifiedBy'] = this.modifiedBy;
		if (Array.isArray(this.childCollections)) {
			data['ChildCollections'] = [];
			for (let item of this.childCollections) {
				data['ChildCollections'].push(item.toJSON());
			}
		}
		data['Parent'] = this.parent ? this.parent.toJSON() : <any>undefined;
		return data;
	}
}
