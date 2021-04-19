import {Injectable} from '@angular/core';
import {TranslationService} from './translation.service';
import {EntitiesResult, Entity, EntityMetadata, EntityMetadataCategory, EntityResult, SearchResponse} from '../model';
import {
	Abbruchgrund,
	ApproveStatus,
	DigitalisierungsKategorie,
	EntscheidGesuchStatus,
	ExternalStatus,
	InternalStatus,
	ShippingType
} from '../../orders/model';
import {Eingangsart} from '../../orders/model/eingangsart';
import {ZugaenglichkeitGemaessBga} from '../../orders/model/zugaenglichkeitGemaessBga';
import { GebrauchskopieStatus } from '../../orders/model/gebrauchskopieStatus';

@Injectable()
export class EntityDecoratorService {
	constructor(private _txt: TranslationService) {
	}

	public getIconForType(type: string): string {
		let icon = '';
		if (type) {
			switch (type.toLowerCase()) {
				case 'dossier':
					icon = 'glyphicon glyphicon-folder-open';
					break;
				case 'subdossier':
					icon = 'glyphicon glyphicon-folder-minus';
					break;
				case 'dokument':
					icon = 'glyphicon glyphicon-article';
					break;
				case 'teilserie':
				case 'serie':
					icon = 'glyphicon glyphicon-sort';
					break;
				case 'teilbestand':
					icon = 'glyphicon glyphicon-cube-empty';
					break;
				case 'hauptabteilung':
				case 'beständeserie':
				case 'akzession':
				case 'archiv':
				case 'bestand':
					icon = 'glyphicon glyphicon-show-big-thumbnails';
					break;
				default:
					break;
			}
		}
		return icon;
	}

	public decorate(entity: Entity, options?: any): Entity {
		if (!entity) {
			return entity;
		}

		entity.iconClasses = this.getIconForType(entity.level);

		if (!entity._metadata) {
			entity._metadata = <EntityMetadata>{};
			entity._metadata['identifikation'] = <EntityMetadataCategory>{};
		}

		if (entity._context) {
			this.decorateEntities(entity._context.ancestors, options);
			this.decorateEntities(entity._context.children, options);
		}

		return entity;
	}

	public decorateEntities(entities: Entity[], options?: any): Entity[] {
		if (entities) {
			for (let i = 0; i < entities.length; i += 1) {
				this.decorate(entities[i], options);
			}

		}
		return entities;
	}

	public decorateEntitiesResult(result: EntitiesResult, options?: any): EntitiesResult {
		if (result) {
			this.decorateEntities(result.items, options);
		}
		return result;
	}

	public decorateSearchResponse(response: SearchResponse, options?: any): SearchResponse {
		if (!response) {
			return response;
		}
		for (let key in response) {
			if (response.hasOwnProperty(key)) {
				let result = <EntityResult>response[key];
				this.decorateEntities(result.items, options);
			}
		}
		return response;
	}

	public translateOrderingType(type: ShippingType) {
		switch (type) {
			case ShippingType.Bestellkorb:
				return this._txt.get('orderOverviewPage.shippingTypeBestellkorb', 'Bestellkorb');
			case ShippingType.Lesesaalausleihen:
				return this._txt.get('orderOverviewPage.shippingTypeLesesaal', 'Lesesaalausleihe');
			case ShippingType.Verwaltungsausleihe:
				return this._txt.get('orderOverviewPage.shippingTypeAmt', 'Verwaltungsausleihe');
			case ShippingType.Digitalisierungsauftrag:
				return this._txt.get('orderOverviewPage.shippingTypeDigital', 'Digitalisierungsauftrag');
			case ShippingType.Einsichtsgesuch:
				return this._txt.get('orderOverviewPage.shippingTypeEinsichtsgesuch', 'Einsichtsgesuch');
			default:
				return 'Unknown';
		}
	}

	public translateDigitalisierungsKategorie(kat: DigitalisierungsKategorie): string {
		switch (kat) {
			case DigitalisierungsKategorie.Spezial:
				return  this._txt.get('digitalisierungskategorie.spezial', 'Spezial');
			case DigitalisierungsKategorie.Intern:
				return  this._txt.get('digitalisierungskategorie.intern', 'Intern');
			case DigitalisierungsKategorie.Oeffentlichkeit:
				return this._txt.get('digitalisierungskategorie.oeffentlichkeit', 'Öffentlichkeit');
			case DigitalisierungsKategorie.Forschungsgruppe:
				return this._txt.get('digitalisierungskategorie.forschungsgruppe', 'Forschungsgruppe');
			case DigitalisierungsKategorie.Gesuch:
				return this._txt.get('digitalisierungskategorie.gesuch', 'Gesuch');
			case DigitalisierungsKategorie.Termin:
				return this._txt.get('digitalisierungskategorie.termin', 'Termin');
			case DigitalisierungsKategorie.Amt:
				return  this._txt.get('digitalisierungskategorie.amt', 'Amt');
			default:
				return 'unknown';
		}
	}

	public translateInternalStatus(status: InternalStatus): string {
		switch (status) {
			case InternalStatus.ImBestellkorb:
				return this._txt.get('enums.orderItemStatus.imBestellkorb', 'Im Bestellkorb');
			case InternalStatus.NeuEingegangen:
				return this._txt.get('enums.orderItemStatus.neuEingegangen', 'Neu Eingegangen');
			case InternalStatus.PruefungEinsichtsgesuch:
				return this._txt.get('enums.orderItemStatus.pruefungEinsichtsgesuch', 'Prüfung Einsichtsgesuch');
			case InternalStatus.EinsichtsgesuchWeitergeleitet:
				return this._txt.get('enums.orderItemStatus.einsichtsgesuchWeitergeleitet', 'Einsichtsgesuch weitergeleitet');
			case InternalStatus.PruefungFreigabe:
				return this._txt.get('enums.orderItemStatus.pruefungFreigabe', 'Freigabe prüfen');
			case InternalStatus.Ausgeliehen:
				return this._txt.get('enums.orderItemStatus.ausgeliehen', 'Ausgeliehen');
			case InternalStatus.FuerDigitalisierungBereit:
				return this._txt.get('enums.orderItemStatus.fuerDigitalisierungBereit', 'Für Digitalisierung bereit');
			case InternalStatus.AushebungsauftragErstellt:
				return this._txt.get('enums.orderItemStatus.aushebungsauftragErstellt', 'Aushebungsauftrag erstellt');
			case InternalStatus.DigitalisierungAbgebrochen:
				return this._txt.get('enums.orderItemStatus.digitalisierungAbgebrochen', 'Digitalisierung abgebrochen');
			case InternalStatus.DigitalisierungExtern:
				return this._txt.get('enums.orderItemStatus.digitalisierungExtern', 'Digitalisierung Extern');
			case InternalStatus.ZumReponierenBereit:
				return this._txt.get('enums.orderItemStatus.zumReponierenBereit', 'Zum Reponieren bereit');
			case InternalStatus.FuerAushebungBereit:
				return this._txt.get('enums.orderItemStatus.fuerAushebungBereit', 'Für Aushebung bereit');
			case InternalStatus.Abgebrochen:
				return this._txt.get('enums.orderItemStatus.abgebrochen', 'Abgebrochen');
			case InternalStatus.Abgeschlossen:
				return this._txt.get('enums.orderItemStatus.abgeschlossen', 'Abgeschlossen');
			default:
				return 'Unknown';
		}
	}

	public translateExternalStatus(status: ExternalStatus): string {
		switch (status) {
			case ExternalStatus.ImBestellkorb:
				return this._txt.get('enums.orderItemStatus.imBestellkorb', 'Im Bestellkorb');
			case ExternalStatus.InBearbeitung:
				return this._txt.get('enums.orderItemStatus.inBearbeitung', 'In Bearbeitung');
			case ExternalStatus.Ausgeliehen:
				return this._txt.get('enums.orderItemStatus.ausgeliehen', 'Ausgeliehen');
			case ExternalStatus.Abgebrochen:
				return this._txt.get('enums.orderItemStatus.abgebrochen', 'Abgebrochen');
			case ExternalStatus.Abgeschlossen:
				return this._txt.get('enums.orderItemStatus.abgeschlossen', 'Abgeschlossen');
			default:
				return 'Unknown';
		}
	}

	public translateApproveStatus(status: ApproveStatus): string {
		switch (status) {
			case ApproveStatus.NichtGeprueft:
				return this._txt.get('enums.approveStatus.nichtGeprueft', 'Nicht geprüft');
			case ApproveStatus.FreigegebenDurchSystem:
				return this._txt.get('enums.approveStatus.inBearbeitung', 'Freigegeben (durch System)');
			case ApproveStatus.FreigegebenAusserhalbSchutzfrist:
				return this._txt.get('enums.approveStatus.ausgeliehen', 'Freigegeben (ausserhalb Schutzfrist)');
			case ApproveStatus.FreigegebenInSchutzfrist:
				return this._txt.get('enums.approveStatus.abgebrochen', 'Freigegeben (in Schutzfrist)');
			case ApproveStatus.ZurueckgewiesenEinsichtsbewilligungNoetig:
				return this._txt.get('enums.approveStatus.einsichtsbewilligungNoetig', 'Zurückgewiesen (Einsichtsbewilligung nötig)');
			case ApproveStatus.ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenInSchutzfrist:
				return this._txt.get('enums.approveStatus.unterlagenInSchutzfrist', 'Zurückgewiesen (nicht für Verwaltungsausleihe berechtigt - Unterlagen in Schutzfrist)');
			case ApproveStatus.ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenFreiBewilligung:
				return this._txt.get('enums.approveStatus.unterlagenFrei', 'Zurückgewiesen (nicht für Verwaltungsausleihe berechtigt - Unterlagen frei / Bewilligung)');
			case ApproveStatus.ZurueckgewiesenFormularbestellungNichtErlaubt:
				return this._txt.get('enums.approveStatus.formBestellungNichtErlaubt', 'Zurückgewiesen (Formularbestellung nicht erlaubt)');
			case ApproveStatus.ZurueckgewiesenDossierangabenUnzureichend:
				return this._txt.get('enums.approveStatus.dossierangaben', 'Zurückgewiesen (Dossierangaben unzureichend)');
			case ApproveStatus.ZurueckgewiesenTeilbewilligungVorhanden:
				return this._txt.get('enums.approveStatus.teilbewilligung', 'Zurückgewiesen (Teilbewilligung vorhanden)');
			default:
				return 'Unknown';
		}
	}

	public translateEntscheidGesuchStatus(status: EntscheidGesuchStatus): string {
		switch (status) {
			case EntscheidGesuchStatus.NichtGeprueft:
				return this._txt.get('enums.entscheidGesuchStatus.nichtGeprueft', 'Nicht geprüft');
			case EntscheidGesuchStatus.EinsichtsgesuchBewilligt:
				return this._txt.get('enums.entscheidGesuchStatus.einsichtsgesuchBewilligt', 'Einsichtsgesuch bewilligt');
			case EntscheidGesuchStatus.AuskunftsgesuchBewilligt:
				return this._txt.get('enums.entscheidGesuchStatus.auskunftsgesuchBewilligt', 'Auskunftsgesuch bewilligt');
			case EntscheidGesuchStatus.EinsichtsgesuchTeilbewilligt:
				return this._txt.get('enums.entscheidGesuchStatus.einsichtsgesuchTeilbewilligt', 'Einsichtsgesuch teilbewilligt');
			case EntscheidGesuchStatus.AuskunftsgesuchTeilbewilligt:
				return this._txt.get('enums.entscheidGesuchStatus.auskunftsgesuchTeilbewilligt', 'Auskunftsgesuch teilbewilligt');
			case EntscheidGesuchStatus.EinsichtVerweigert:
				return this._txt.get('enums.entscheidGesuchStatus.einsichtVerweigert', 'Einsicht verweigert');
			case EntscheidGesuchStatus.EntscheidGemaessBgOe:
				return this._txt.get('enums.entscheidGesuchStatus.entscheidGemaessBgOe', 'Entscheid gemäss BGÖ');
			default:
				return 'Unknown';
		}
	}

	public translateAbbruchgrund(grund: Abbruchgrund): string {
		switch (grund) {
			case Abbruchgrund.NichtGesetzt:
				return this._txt.get('enums.abbruchgrund.nichtGesetzt', 'Nicht gesetzt');
			case Abbruchgrund.Storniert:
				return this._txt.get('enums.abbruchgrund.storniert', 'Storniert');
			case Abbruchgrund.DossierMomentanNichtVerfuegbar:
				return this._txt.get('enums.abbruchgrund.dossierMomentanNichtVerfuegbar', 'Dossier momentan nicht verfügbar');
			case Abbruchgrund.DigitalisierungNichtMoeglich:
				return this._txt.get('enums.abbruchgrund.digitalisierungNichtMoeglich', 'Digitalisierung nicht möglich');
			case Abbruchgrund.ZurueckgewiesenEinsichtsbewilligungNoetig:
				return this._txt.get('enums.abbruchgrund.einsichtsbewilligungNoetig', 'Einsichtsbewilligung nötig');
			case Abbruchgrund.ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenInSchutzfrist:
				return this._txt.get('enums.abbruchgrund.unterlagenInSchutzfrist', 'Nicht für Verwaltungsausleihe berechtigt - Unterlagen in Schutzfrist');
			case Abbruchgrund.ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenFreiBewilligung:
				return this._txt.get('enums.abbruchgrund.unterlagenFrei', 'Nicht für Verwaltungsausleihe berechtigt - Unterlagen frei / Bewilligung');
			case Abbruchgrund.ZurueckgewiesenFormularbestellungNichtErlaubt:
				return this._txt.get('enums.abbruchgrund.formBestellungNichtErlaubt', 'Formularbestellung nicht erlaubt');
			case Abbruchgrund.ZurueckgewiesenDossierangabenUnzureichend:
				return this._txt.get('enums.abbruchgrund.dossierangaben', 'Dossierangaben unzureichend');
			case Abbruchgrund.ZurueckgewiesenTeilbewilligungVorhanden:
				return this._txt.get('enums.abbruchgrund.teilbewilligung', 'Teilbewilligung vorhanden');
			default:
				return 'Unknown';
		}
	}

	public translateEingangsart(eingangsart: Eingangsart): string {
		switch (eingangsart) {
			case Eingangsart.ErfasstDurchKunde:
				return this._txt.get('enums.eingangsart.erfasstDurchKunde', 'Durch Kunde erfasst');
			case Eingangsart.ErfasstDurchBar:
				return this._txt.get('enums.eingangsart.erfasstDurchBar', 'Durch BAR erfasst');
			default:
				return 'Unknown';
		}
	}

	public translateZugaenglichkeitGemaessBga(zugaenglichkeitGemaessBga: ZugaenglichkeitGemaessBga): string {
		switch (zugaenglichkeitGemaessBga) {
			case ZugaenglichkeitGemaessBga.FreiZugaenglich:
				return this._txt.get('enums.zugaenglichkeitGemaessBga.freiZugaenglich', 'Frei zugänglich');
			case ZugaenglichkeitGemaessBga.InSchutzfrist:
				return this._txt.get('enums.zugaenglichkeitGemaessBga.inSchutzfrist', 'In Schutzfrist');
			case ZugaenglichkeitGemaessBga.PruefungNoetig:
				return this._txt.get('enums.zugaenglichkeitGemaessBga.pruefungNoetig', 'Prüfung nötig');
			default:
				return 'Unknown';
		}
	}

	public translateGebrauchskopieStatus(gebrauchskopieStatus: GebrauchskopieStatus): string {
		switch (gebrauchskopieStatus) {
			case GebrauchskopieStatus.NichtErstellt:
				return this._txt.get('enums.gebrauchskopieStatus.nichtErstellt', ' ');
			case GebrauchskopieStatus.ErfolgreichErstellt:
				return this._txt.get('enums.gebrauchskopieStatus.erfolgreichErstellt', 'Erfolgreich erstellt');
			case GebrauchskopieStatus.Fehlgeschlagen:
				return this._txt.get('enums.gebrauchskopieStatus.fehlgeschlagen', 'Fehlgeschlagen');
			case GebrauchskopieStatus.Versendet:
			return this._txt.get('enums.gebrauchskopieStatus.versendet', 'Versendet');
			default:
				return 'Unknown';
		}
	}
}
