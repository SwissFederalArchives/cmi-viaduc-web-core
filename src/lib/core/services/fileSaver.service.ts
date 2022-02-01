import {Injectable} from '@angular/core';
import {HttpEventType} from '@angular/common/http';
import * as fileSaver from 'file-saver';

@Injectable()
export class FileSaverService {

	// Checks whether the download request was answered with a file name and
	// tries to save the file. It always checks first whether there is a file name star
	// that could contain special characters. This is always tried to save first.
	// If the file name asterisk does not exist or if saving goes wrong, the file name is tried to be saved.
	public saveDownloadResponseToFile (event) {
		if (event.type === HttpEventType.Response) {
			let filename: string;
			let filenameStar: string;
			let blob = event.body;

			try {

				let parts = event.headers.get('content-disposition').split(';');
				parts.forEach(name => {
					if (name.indexOf('filename=') > -1) {
						filename =  name.substring(('filename=').length + 1);
					} else if (name.indexOf('filename*=utf-8\'\'') > -1) {
						filenameStar =  name.substring(('filename*=utf-8\'\'').length + 1);
					}
				});
				if (filenameStar) {
					fileSaver.saveAs(blob, decodeURIComponent(filenameStar));
				} else {
					fileSaver.saveAs(blob, filename);
				}
			} catch (ex) {
				console.error(ex);
				if (filenameStar) {
					try {
						fileSaver.saveAs(blob, filename);
					} catch (e) {
						console.error(e);
					}
				}
			}
		}
	}
}
