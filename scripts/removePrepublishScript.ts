const fs = require('fs');
const path = require('path');
/*
	`10.03.2020/sbe:
	In Angular 9 und höher ist zurzeit nicht erlaubt, Ivy-kompilierte Libraries zu publizieren (zwecks Kompatibilität).
	Wir setzen jedoch im Frontend als auch im Management ebenfalls auf Ivy und können daher auf die Kompatibilät verzichten.
	Daher entfernen wir hier das Script, das den Publish verhindert.
	
	Zukünftig sollte der Publish mit Ivy möglich sein und dann kann dieses Script entfernt werden.
	*/
// Define absolute paths for original pkg and temporary pkg.
const ORIG_PKG_PATH = path.resolve(__dirname, '../dist/@cmi/viaduc-web-core/package.json');
// Obtain original `package.json` contents.
const pkgData = require(ORIG_PKG_PATH);
// Delete Scripts
delete pkgData.scripts;
// Overwrite original `package.json` with new data (i.e. minus the specific data).
fs.writeFile(ORIG_PKG_PATH, JSON.stringify(pkgData, null, 2), function (err) {
	if (err) {
		throw err;
	}
});