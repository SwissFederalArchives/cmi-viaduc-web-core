import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {
	public getItem<T>(key: string): T {
		return <T>JSON.parse(window.localStorage.getItem(key) || null);
	}

	public setItem(key: string, item: any): void {
		window.localStorage.setItem(key, JSON.stringify(item));
	}

	public clear(): void {
		window.localStorage.clear();
	}
}
