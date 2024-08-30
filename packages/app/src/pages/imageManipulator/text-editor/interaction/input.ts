import { Interaction } from ".";

export class Input {
  private inputEl!: HTMLTextAreaElement;
  private containerEl!: HTMLElement;

  private isCompositing: Boolean = false
  constructor(private interaction: Interaction) {
    this.inputEl = document.createElement('textarea');
    const styles = {
      padding: '0',
      position: 'absolute',
      zIndex: '-20',
    } as const;
    Object.assign(this.inputEl.style, styles);
    this.inputEl.addEventListener('input', this.onInput.bind(this));
    // this.inputEl.addEventListener('compositionstart', () => {
    //   this.isCompositing = true
    // })
    // this.inputEl.addEventListener('compositionend', () => {
    //   this.isCompositing = false
    // })

    this.containerEl = this.interaction.getTextEditor().getRootCanvas.container
    this.containerEl.appendChild(this.inputEl)
  }

  onInput(Event: Event) {
    const e = Event as InputEvent
    let data = e.data
    if (!data) {
      return
    }
    this.interaction.getTextEditor().getCore().onInput(data)
  }
  setPosition(x: number, y: number) {
    this.inputEl.style.left = x + 'px'
    this.inputEl.style.top = y + 'px'
  }
  focus() {
    setTimeout(() => {
      this.inputEl.focus()
    })
  }
  blur() {
    setTimeout(() => {
      this.inputEl.blur()
    })
  }
}
