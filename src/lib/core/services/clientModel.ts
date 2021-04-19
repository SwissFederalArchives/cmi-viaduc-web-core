import {Utilities as _util} from '../includes/utilities';
import {Injectable} from '@angular/core';
import {ClientVersion} from '../model/clientVersion';

@Injectable()
export class ClientModel {

	public version: ClientVersion = <ClientVersion>{};

	// noinspection JSUnusedGlobalSymbols
	public setVersion(version: any): void {
		this.version = this.updateVersion(<ClientVersion>{}, version);
	}

	public updateVersion(version: ClientVersion, update: any): ClientVersion {
		if (_util.isString(update)) {
			let m = update.match(/^(?:(\w+)\W)(?:(\w+)\W)(?:(\w+))\W?(\w+)?$/);
			if (m !== null && m.length >= 4) {
				version = <ClientVersion>{
					...version,
					major: m[1],
					minor: m[2],
					revision: m[3],
					build: (m[4] || version.build)
				};
			}
		} else {
			version = <ClientVersion>{...version, ...update};
		}

		return version;
	}

	public versionPartIsLessOrEqual(vp1: string, vp2: string): boolean {
		return (vp1 <= vp2);
	}

	// noinspection JSUnusedGlobalSymbols
	public versionIsLessOrEqualThan(v1: any, v2: any): boolean {
		v1 = _util.isString(v1) ? this.updateVersion(<ClientVersion>{}, v1) : v1;
		v2 = _util.isString(v2) ? this.updateVersion(<ClientVersion>{}, v2) : v2;
		return (
			this.versionPartIsLessOrEqual(v1.major, v2.major) &&
			this.versionPartIsLessOrEqual(v1.minor, v2.minor) &&
			this.versionPartIsLessOrEqual(v1.revision, v2.revision) &&
			this.versionPartIsLessOrEqual(v1.build, v2.build)
		);
	}
}
