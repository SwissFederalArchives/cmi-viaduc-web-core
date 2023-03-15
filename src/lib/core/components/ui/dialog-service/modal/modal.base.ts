export class ModalBase {
	// eslint-disable-next-line
	public destroy: Function;
	public componentIndex: number;
	public closeModal() {
		this.destroy();
	}
}
