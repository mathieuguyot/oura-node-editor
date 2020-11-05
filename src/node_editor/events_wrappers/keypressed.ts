/* onKey(down|up) event wrapper to simplify access to key states */
export default class KeyPressedWrapper {
    private keysDown: Set<string> = new Set();

    constructor() {
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    isKeyDown(key: string): boolean {
        return this.keysDown.has(key);
    }

    attachListeners(): void {
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("keydown", this.onKeyDown);
    }

    detachListeners(): void {
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("keydown", this.onKeyDown);
    }

    private onKeyUp(e: KeyboardEvent) {
        this.keysDown.delete(e.key.toLowerCase());
    }

    private onKeyDown(e: KeyboardEvent) {
        this.keysDown.add(e.key.toLowerCase());
    }
}
