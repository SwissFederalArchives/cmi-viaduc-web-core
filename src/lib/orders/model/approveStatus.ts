export enum ApproveStatus {
	NichtGeprueft = 0,

	// 0 < Codes < 100 bedeuten Freigegeben
	FreigegebenDurchSystem = 1,
	FreigegebenAusserhalbSchutzfrist = 2,
	FreigegebenInSchutzfrist = 3,

	// Codes >= 100 bedeuten "Zurückgewiesen"
	ZurueckgewiesenEinsichtsbewilligungNoetig = 100,
	ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenInSchutzfrist= 101,
	ZurueckgewiesenNichtFuerVerwaltungsausleiheBerechtigtUnterlagenFreiBewilligung= 102,
	ZurueckgewiesenFormularbestellungNichtErlaubt= 103,
	ZurueckgewiesenDossierangabenUnzureichend= 104,
	ZurueckgewiesenTeilbewilligungVorhanden= 105,
}
