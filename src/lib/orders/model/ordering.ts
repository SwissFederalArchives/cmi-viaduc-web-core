import {OrderItem} from './orderItem';
import {ShippingType} from './shippingType';

export interface Ordering {
	id: string;
	userId: string;
	comment: string;
	type: ShippingType;
	lesesaalDate: Date;
	artDerArbeit: number;
	artDerArbeitTranslated: string;
	termsAccepted: boolean;
	begruendungAngegebenFallsNoeting: boolean;
	begruendungEinsichtsgesuch: string;
	orderDate: Date;
	items: OrderItem[];
	personenbezogeneNachforschung: boolean;
	hasEigenePersonendaten: boolean;
}
