import {ExternalStatus} from './externalStatus';
import {EntscheidGesuchStatus} from './entscheidGesuchStatus';

export interface OrderItem {
	title: string;
	period: string;
	referenceCode: string;
	comment: string;
	veId: number;
	id: string;
	couldNeedAReason: boolean;
	reason: number;
	status: ExternalStatus;
	einsichtsbewilligungNotwendig: boolean;
	hasPersonendaten: boolean;
	bewilligungsDatum: Date;
	externalStatus: ExternalStatus;
	entscheidGesuch: EntscheidGesuchStatus;
	datumDesEntscheids: Date;
}
