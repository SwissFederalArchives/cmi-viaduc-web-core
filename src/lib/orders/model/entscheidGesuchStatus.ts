export enum EntscheidGesuchStatus {
	// 0 = wurde noch nicht entschieden
	NichtGeprueft = 0,

	// 0 < Codes < 100 bedeuten vollständig bewilligt
	EinsichtsgesuchBewilligt = 1,
	AuskunftsgesuchBewilligt = 2,

	// Codes >= 100 bedeuten (teilweise) "zurückgewiesen"
	EinsichtsgesuchTeilbewilligt = 100,
	AuskunftsgesuchTeilbewilligt = 101,
	EinsichtVerweigert = 102,
	EntscheidGemaessBgOe = 103,
}
