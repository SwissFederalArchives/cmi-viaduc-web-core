// Reason: Firefox prior to v52 and Safari do not have a TouchList defined.
if (!(<any>window).TouchList) {
	(<any>window).TouchList = () => void 0;
}
