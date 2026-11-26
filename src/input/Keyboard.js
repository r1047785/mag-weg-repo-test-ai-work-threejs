// e.code is the physical key: KeyW/KeyA/... is ZQSD on AZERTY, WASD on QWERTY.
const KEY_MAP = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

/** Tracks which driving actions are currently held down. */
export class Keyboard {
  constructor() {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;

    window.addEventListener("keydown", (e) => this.#onKey(e, true));
    window.addEventListener("keyup", (e) => this.#onKey(e, false));
    // Release everything when the tab loses focus, so the car doesn't keep driving.
    window.addEventListener("blur", () => this.#releaseAll());
  }

  /** -1 (backward) … 1 (forward) */
  get throttle() {
    return Number(this.forward) - Number(this.backward);
  }

  /** -1 (right) … 1 (left) */
  get steer() {
    return Number(this.left) - Number(this.right);
  }

  #onKey(event, pressed) {
    const action = KEY_MAP[event.code];
    if (!action) return;
    this[action] = pressed;
    event.preventDefault();
  }

  #releaseAll() {
    this.forward = this.backward = this.left = this.right = false;
  }
}
