import {Utilities as _util} from '../includes/utilities';
import {Injectable} from '@angular/core';

@Injectable()
export class CoreOptions {
	public clientConfig: any;

	public readonly baseUrl: string;
	public readonly serverUrl: string;
	public readonly publicPort: string;
	public readonly privatePort: string;
	public readonly settingsUrl: string;
	public readonly odataUrl: string;
	public readonly httpTimeoutInSeconds: number;
	public readonly spinnerAppearanceDelayInSeconds: number;

	constructor() {
		const config = this.clientConfig = window['viaducclient'] || {};

		const loc = window.location;
		const port = isNaN(parseInt(loc.port, 10)) ? undefined : parseInt(loc.port, 10);
		let baseUrl = '' + loc.protocol + '//' + loc.hostname + (port ? ':' + port : '') + loc.pathname;
		if (_util.endsWith(baseUrl, '/')) {
			baseUrl = baseUrl.substring(0, baseUrl.length - 1);
		}

		let serverUrl = baseUrl;
		let publicPort = '';
		let privatePort = '';
		let settingsUrl = '';
		let odataUrl = '';

		const api = config['api'];
		if (api) {
			serverUrl = api.server || serverUrl;
			publicPort = api.public || publicPort;
			privatePort = api.private || privatePort;
		}

		if (settingsUrl === '') {
			settingsUrl = _util.addToString(serverUrl, '/', 'api/Public/GetSettings');
		}

		if (odataUrl === '') {
			odataUrl = _util.addToString(serverUrl, '/', 'odata');
		}

		this.baseUrl = baseUrl;
		this.serverUrl = serverUrl;
		this.publicPort = publicPort;
		this.privatePort = privatePort;
		this.settingsUrl = settingsUrl;
		this.odataUrl =  odataUrl;

		this.httpTimeoutInSeconds = 10;
		this.spinnerAppearanceDelayInSeconds = .3;
	}
}
