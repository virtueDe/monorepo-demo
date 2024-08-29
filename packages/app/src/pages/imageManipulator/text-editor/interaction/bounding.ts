import { Interaction } from ".";
import { IDrawBoundingOptions } from "../types";

export class Bounding {
  constructor(private interaction: Interaction) {
  }
  draw({ x, y, w, h, borderColor, borderWidth }: IDrawBoundingOptions) {
    this.interaction.ctx.strokeStyle = borderColor
    this.interaction.ctx.lineWidth = borderWidth
    this.interaction.ctx.strokeRect(x, y, w, h);
  }
}
