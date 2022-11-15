import {DEFAULT_LANGUAGE} from '../model/translations';
import {ClientModel} from './clientModel';
import {Injectable} from '@angular/core';
import * as moment_ from 'moment';
import {Session} from '../model/session';
import {Utilities as _util} from '../includes/utilities';
import * as wjCore from '@grapecity/wijmo';
import {SearchState} from '../model/searchState';

const moment = moment_;

@Injectable()
export class ClientContext {

	public get client(): ClientModel {
		return this._clientModel;
	}

	private _defaultLanguage: string = DEFAULT_LANGUAGE;
	private _currentLanguage: string = DEFAULT_LANGUAGE;
	private _loadingLanguage: string = undefined;

	private _currentSession: Session = <Session>{};
	private _searchState: SearchState = <SearchState>{};

	public lastSearchLink: string;

	constructor(private _clientModel: ClientModel) {
	}

	public get defaultLanguage(): string {
		return this._defaultLanguage || DEFAULT_LANGUAGE;
	}

	public set defaultLanguage(value: string) {
		this._defaultLanguage = value;
	}

	public get language(): string {
		return this._currentLanguage || DEFAULT_LANGUAGE;
	}

	public set language(lang: string) {
		this._currentLanguage = lang;
		moment.locale(lang);

		this.loadWijmoLocalizationFile(lang);
		wjCore.Control.invalidateAll();
	}

	public loadWijmoLocalizationFile(language: string) {
		if (language === 'de') {
			language = 'de-CH';
		}

		let node = document.createElement('script');
		node.src = `client/wijmo.culture.${language}.js`;
		node.type = 'text/javascript';
		node.async = true;

		let children = document.getElementsByTagName('head')[0].childNodes;
		for (let i = 0; i < children.length; i++) {
			if (children[i] && children[i]['src'] && children[i]['src'].indexOf('wijmo.culture') > 0) {
				document.getElementsByTagName('head')[0].removeChild(children[i]);
			}
		}
		document.getElementsByTagName('head')[0].appendChild(node);
	}

	public get loadingLanguage(): string {
		return this._loadingLanguage;
	}

	public set loadingLanguage(value: string) {
		this._loadingLanguage = value;
	}

	public get authenticated(): boolean {
		return this._currentSession.authenticated === true;
	}

	public get currentSession(): Session {
		return this._currentSession || <Session>{};
	}

	public set currentSession(value: Session) {
		this._currentSession = value;
	}

	public get search(): SearchState {
		return this._searchState;
	}

	public set search(value: SearchState) {
		this._searchState = value;
	}
}
