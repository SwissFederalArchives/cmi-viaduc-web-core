import {OrderItem} from './orderItem';
import {ShippingType} from './shippingType';
import {ExternalStatus} from './externalStatus';
import {EntscheidGesuchStatus} from './entscheidGesuchStatus';
import {Abbruchgrund} from './abbruchgrund';

export class OrderListDisplayItem implements OrderItem {
	public title: string;
	public period: string;
	public referenceCode: string;
	public comment: string;
	public veId: number;
	public id: string;
	public status: ExternalStatus;
	public statusDisplay: string;
	public statusTime: Date;
	public statusComment: string;
	public bewilligungsDatum: Date;
	public enthaeltPersonendaten: boolean;
	public reasonDisplay: string;
	public hasPersonendaten: boolean;
	public orderingHasEigenePersonendaten: boolean;
	public orderingPeronenbezogeneNachforschung: boolean;
	public orderingId: string;
	public orderingComment: string;
	public orderingType: ShippingType;
	public orderingTypeDisplay: string;
	public artDerArbeitDisplay: string;
	public orderingLieferdatumLesesaal: Date;
	public orderingDate: Date;
	public couldNeedAReason: boolean;
	public reason: number;
	public einsichtsbewilligungNotwendig: boolean;
	public externalStatus: ExternalStatus;
	public orderingEinsichtsgesuchZweck: string;
	public orderingEigeneUnterlagen: boolean;
	public orderingAbbruch: string;
	public entscheidGesuch:EntscheidGesuchStatus;
	public entscheidGesuchDisplay:string;
	public datumDesEntscheids: Date;
	public abbruchgrund: Abbruchgrund;
	public abbruchgrundDisplay: string;
}