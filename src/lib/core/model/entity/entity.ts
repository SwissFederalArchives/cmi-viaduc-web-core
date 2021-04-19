import {EntityMetadata} from './entityMetadata';
import {Highlight} from '../search/highlight';

export interface Entity {
	_context?: any;
	_metadata?: EntityMetadata;
	highlight: Highlight;
	creationPeriod: any[];

	archiveRecordId: string;
	level?: string;
	title: string;
	treeSequence?: number;

	HasImage?: boolean;
	HasAudioVideo?: boolean;
	nichtOnlineRecherchierbareDossiers?: string;
	isWithinProtectionRange?: boolean;
	canBeOrdered?: boolean;
	isPhysicalyUsable?: boolean;
	containsPersonRelatedInformation?: boolean;
	customFields: any[];
	primaryDataLink?: any[];
	itemClasses?: string;
	iconClasses?: string;
	childCount?: number;
	referenceCode: string;
	isDownloadAllowed: boolean;
	images?: string[];
	primaryDataDownloadAccessTokens: string[];

	explanation: {
		value: string,
		explanation: string,
	};
}
