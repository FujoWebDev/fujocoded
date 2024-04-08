export class KonamiCode extends HTMLElement {
  static KONAMI_SEQUENCE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  nextIndex = 0;

  constructor() {
    super();
  }

  connectedCallback() {
    console.log("The Konami Code has been added to the page");
    document.addEventListener("keydown", (event) => {
      if (KonamiCode.KONAMI_SEQUENCE[this.nextIndex] == event.code) {
        console.log("Way to go")!;
        this.nextIndex = this.nextIndex + 1;

        if (this.nextIndex == KonamiCode.KONAMI_SEQUENCE.length) {
          console.log("Congratulations");
          this.nextIndex = 0;
        }
      } else {
        console.log("try again");
        this.nextIndex = 0;
      }
    });
  }
}

export const registerKonamiCode = () => {
  customElements.define("konami-code", KonamiCode);
};
