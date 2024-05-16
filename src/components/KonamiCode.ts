export const KonamiTriggeredEventCode = "konami-code-triggered";

class KonamiCode extends HTMLElement {
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
  buttonElements: Element[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    const buttonTemplate =
      this.querySelector<HTMLTemplateElement>(".button-template");
    if (!buttonTemplate) {
      throw new Error(
        "You must provide a template for the Konami Code buttons",
      );
    }
    KonamiCode.KONAMI_SEQUENCE.forEach((key) => {
      const newButton = (buttonTemplate.content.cloneNode(true) as Element)
        .firstElementChild!;
      newButton.classList.add(key.toLowerCase());
      this.buttonElements.push(this.appendChild(newButton));
    });

    document.addEventListener("keydown", (event) => {
      if (KonamiCode.KONAMI_SEQUENCE[this.nextIndex] == event.code) {
        this.nextIndex = this.nextIndex + 1;

        if (this.nextIndex == KonamiCode.KONAMI_SEQUENCE.length) {
          this.nextIndex = 0;
          this.classList.add("triggered");
          document.dispatchEvent(new Event(KonamiTriggeredEventCode));
        }
      } else {
        this.nextIndex = 0;
      }

      this.buttonElements.forEach((element, index) => {
        element.classList.toggle("hit", index < this.nextIndex);
      });
    });
  }
}

export const registerKonamiCode = () => {
  customElements.define("konami-code", KonamiCode);
};
