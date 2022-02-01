export class ModalBase {
	public destroy: Function;
	public componentIndex: number;
	public closeModal() {
		this.destroy();
	}
}
