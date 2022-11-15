
import * as moment from 'moment';
import {TestBed} from '@angular/core/testing';
import {CollectionDto, CollectionListItemDto} from '../entityFramework-models';

describe('Collection', () => {
	let collection = new CollectionDto();

	beforeEach(() => {
		collection.collectionId = -1;
		collection.validFrom = moment().startOf('day').toDate();
		collection.validTo = moment().startOf('day').add(30, 'days').toDate();
		collection.createdOn = moment().startOf('day').toDate();
		collection.modifiedOn = moment().startOf('day').toDate();
		collection.collectionTypeId = 0;
		collection.description = 'Test long';
		collection.descriptionShort = 'Test';
		collection.parentId = -1;
		collection.title = 'Totel';

		TestBed.configureTestingModule({
			imports: [
			],
			providers: [
				{ useClass: CollectionDto, multi: true }
			],
		});

	});
	it('Collection fromJS toJSON', () => {
		const result = CollectionDto.fromJS(collection.toJSON());
		expect(collection.title).toEqual(result.title);
		expect(collection.validTo).toEqual(result.validTo);
		expect(collection.validFrom).toEqual(result.validFrom);
		expect(collection.description).toEqual(result.description);
		expect(collection.descriptionShort).toEqual(result.descriptionShort);
		expect(collection.modifiedOn).toEqual(result.modifiedOn);
	});

	it('Collection fromJS ', () => {
		const result = CollectionDto.fromJS({
			collectionId: -1,
			validFrom: moment().startOf('day').toISOString(),
			validTo: moment().startOf('day').add(30, 'days').toDate().toISOString(),
			createdOn: moment().startOf('day').toISOString(),
			modifiedOn: moment().startOf('day').toISOString(),
			collectionTypeId: 0});

		expect(collection.collectionId).toEqual(result.collectionId);
		expect(collection.validTo).toEqual(result.validTo);
		expect(collection.validFrom).toEqual(result.validFrom);
		expect(collection.collectionTypeId).toEqual(result.collectionTypeId);
	});
});

describe('CollectionListItem', () => {
	let collection = new CollectionListItemDto();

	beforeEach(() => {
		collection.collectionId = -1;
		collection.validFrom = moment().startOf('day').toDate();
		collection.validTo = moment().startOf('day').add(6, 'days').toDate();
		collection.createdOn = moment().startOf('day').toDate();
		collection.modifiedOn = moment().startOf('day').toDate();
		collection.collectionTypeId = 0;
		collection.description = 'Test long';
		collection.descriptionShort = 'Test';
		collection.parentId = -1;
		collection.title = 'Totel';
		collection.imageAltText = 'Ein Bild';
		collection.imageMimeType = '/gif';
		collection.link = 'www.google.de';
		collection.collectionPath = '0815';
		collection.sortOrder = 12;
		collection.createdBy = 'Pet';
		collection.modifiedBy = 'Pet';

		TestBed.configureTestingModule({
			imports: [
			],
			providers: [
				{ useClass: CollectionListItemDto, multi: true }
			],
		});

	});
	it('CollectionListItem fromJS toJSON', () => {
		const result = CollectionListItemDto.fromJS(collection.toJSON());
		expect(collection.parent).toBeUndefined();
		expect(result.parent).toBeUndefined();
		expect(collection.title).toEqual(result.title);
		expect(collection.validTo).toEqual(result.validTo);
		expect(collection.validFrom).toEqual(result.validFrom);
		expect(collection.description).toEqual(result.description);
		expect(collection.descriptionShort).toEqual(result.descriptionShort);
		expect(collection.modifiedOn).toEqual(result.modifiedOn);
	});

	it('Collection.fromJS CollectionListItem.toJSON', () => {
		const result = CollectionDto.fromJS(collection.toJSON());
		expect(collection.parent).toBeUndefined();
		expect(result.parent).toBeUndefined();
		expect(collection.title).toEqual(result.title);
		expect(collection.validTo).toEqual(result.validTo);
		expect(collection.validFrom).toEqual(result.validFrom);
		expect(collection.description).toEqual(result.description);
		expect(collection.descriptionShort).toEqual(result.descriptionShort);
		expect(collection.modifiedOn).toEqual(result.modifiedOn);
	});

	it('CollectionListItem fromJS ', () => {
		const result = CollectionDto.fromJS({
			collectionId: -1,
			validFrom: moment().startOf('day').toISOString(),
			validTo: moment().startOf('day').add(6, 'days').toDate().toISOString(),
			createdOn: moment().startOf('day').toISOString(),
			modifiedOn: moment().startOf('day').toISOString(),
			collectionTypeId: 0});

		expect(collection.collectionId).toEqual(result.collectionId);
		expect(collection.validTo).toEqual(result.validTo);
		expect(collection.validFrom).toEqual(result.validFrom);
		expect(collection.collectionTypeId).toEqual(result.collectionTypeId);
	});
});
