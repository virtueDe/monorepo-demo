import { TextEditor } from "../editor";
import { Cursor } from "./cursor";
import { editorRange } from "./range";
import { Bounding } from "./bounding";
import { Input } from "./input";
import { KeyboardListener } from "./KeyboardListener";
import { KeyboardHandler } from "./keyboardHandler";
export class Interaction {
  ctx!: CanvasRenderingContext2D;
  cursor!: Cursor
  rang!: editorRange;
  bounding!: Bounding;
  input!: Input
  keyboardListener!: KeyboardListener
  keyboardHandler!: KeyboardHandler
  constructor(private textEditor: TextEditor) {
    this.ctx = this.textEditor.getRootCanvas.ctx

    this.cursor = new Cursor(this)
    this.rang = new editorRange(this)
    this.bounding = new Bounding(this)
    this.input = new Input(this)
    this.keyboardListener = new KeyboardListener()
    this.keyboardHandler = new KeyboardHandler(this)
  }
  getTextEditor() {
    return this.textEditor
  }

  setCursorPosition(x: number, y: number) {
    this.input.setPosition(x, y)
    this.cursor.computeCursorPosition(x, y)
  }
}
