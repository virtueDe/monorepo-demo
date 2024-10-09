import { IBounding, IPointBase } from ".";


type IBoundingWithoutGap = Omit<IBounding, 'gap'>;

export interface IDrawBoundingOptions extends IPointBase, IBoundingWithoutGap {

}
