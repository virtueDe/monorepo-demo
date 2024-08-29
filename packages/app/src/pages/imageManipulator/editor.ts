import { TextEditor, ITextAttr } from './text-editor';
import { CropRect, DrawType, FilterType, FontLineThrough, FontUnderline, Image, ImageStyleKey, Line, MouseInCropModule, TextAttribute, TextGraphs } from './graphs/index'
import { getCropReferenceLine, getCropDot, getCropLine, checkInPath, rangeTransform, getNextPixel, getNextRowPixel, getPreviousPixel, isLastRow, isLastPixelInRow, getPreviousRowPixel, applyConvolution } from './utils';

export enum CanvasModel {
  Preview = 'Preview',
  Crop = 'crop',
  DrawLine = 'drawLine',
  Styled = 'styled',
  Filter = 'filter',
  Text = 'text',
}

export class CanvasImageManipulator {
  container: HTMLElement

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  private dpi: number = 1;
  canvasModel: CanvasModel = CanvasModel.Preview

  viewportWidth: number = 0;
  viewportHeight: number = 0;

  private canvasScale = {
    min: 0.1,
    max: 10,
    value: 1,
    base: 1,
  }


  mouse = {
    lastX: 0,
    lastY: 0,
    cursor: 'default',
    dragging: false,
  }


  image: Image;
  cropRect: CropRect
  line: Line
  // textEditor: TextGraphs
  textEditor: TextEditor

  ro: ResizeObserver

  // private textAttribute = {
  //   fontSize: 50,
  //   data: 'hello Canvas',
  //   fontFamily: 'sans-serif',
  //   // font: '16px sans-serif',
  //   fillStyle: 'blue',
  //   textAlign: 'center',
  //   X: 150,
  //   y: 150
  // }
  constructor(canvasId: string) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    this.container = this.canvas.parentElement as HTMLDivElement;

    const parentWidth = this.container!.offsetWidth;
    const parentHeight = this.container!.offsetHeight;

    this.canvas.width = parentWidth * this.dpi;
    this.canvas.height = parentHeight * this.dpi;

    this.canvas.style.width = parentWidth + 'px';
    this.canvas.style.height = parentHeight + 'px';
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0px'
    this.canvas.style.left = '0px'

    this.viewportWidth = parentWidth
    this.viewportHeight = parentHeight

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.scale(this.dpi, this.dpi)

    this.image = new Image();
    this.cropRect = new CropRect()
    this.line = new Line()
    // this.textEditor = new TextGraphs()
    this.textEditor = new TextEditor(this)

    this.ro = new ResizeObserver(entries => {
      entries.forEach(entry => {
        this.handleViewportResize(entry.contentRect.width, entry.contentRect.height)
      });
    });

    this.initEventListeners();

    // this.ro.observe(this.canvas.parentElement as HTMLElement);
  }
  public loadImage(src: string) {
    if (!src) return
    this.image.imageElement.src = src;
    this.image.imageElement.crossOrigin = 'anonymous'

    this.image.imageElement.onload = () => {
      this.onResetImage()
      this.draw()
    };
  }
  public saveImage() {
    var img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = this.image.imageElement.src

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.image.width;
      canvas.height = this.image.height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, this.image.sx, this.image.sy, this.image.sw, this.image.sh, 0, 0, this.image.width, this.image.height);
      const imageName = `cropped-image-${new Date().getTime()}.png`;
      canvas.toBlob((blob) => {
        if (blob) {
          // const editedFile = new File([blob], imageName, { type: blob.type });
          const objectUrl = URL.createObjectURL(blob);
          const linkElement = document.createElement('a');
          linkElement.download = `${imageName}`;
          linkElement.href = objectUrl;
          linkElement.click();
          URL.revokeObjectURL(objectUrl);
        }
      }, 'image/png');
    }
  }
  public changeImageStyled(data: Record<ImageStyleKey, number>) {
    this.image.styleSettings.brightness = rangeTransform(-100, 100, -0.8, 1)(data.brightness)
    this.image.styleSettings.contrast = rangeTransform(-100, 100, 0, 2)(data.contrast)
    this.image.styleSettings.exposure = rangeTransform(-100, 100, -100, 100)(data.exposure)
    this.image.styleSettings.saturation = rangeTransform(-100, 100, 0, 2)(data.saturation)
    this.draw()
  }
  changeFilter(value: FilterType) {
    this.image.filterType = value
    this.draw()
  }
  rotation(deg: number) {
    this.image.angle = deg
    this.draw()
  }
  flip(x: number, y: number) {
    this.image.flip.x = x
    this.image.flip.y = y
    this.draw()
  }
  crop() {
    this.image.sx += (this.cropRect.x - this.image.x) / this.canvasScale.value
    this.image.sy += (this.cropRect.y - this.image.y) / this.canvasScale.value
    this.image.sw = this.cropRect.width / this.canvasScale.value
    this.image.sh = this.cropRect.height / this.canvasScale.value

    this.image.x = this.cropRect.x
    this.image.y = this.cropRect.y
    this.image.width = this.cropRect.width
    this.image.height = this.cropRect.height
    this.draw()
  }
  private onResetImage() {
    const canvasAspect = this.viewportWidth / this.viewportHeight;
    const imageAspect = this.image.imageElement.width / this.image.imageElement.height;

    if (imageAspect > canvasAspect) {
      this.canvasScale.value = (this.viewportWidth - 2 * this.image.margin) / this.image.imageElement.width;
    } else {
      this.canvasScale.value = (this.viewportHeight - 2 * this.image.margin) / this.image.imageElement.height;
    }


    // 计算初始位置，使得图片居中
    this.image.x = (this.viewportWidth - this.image.imageElement.width * this.canvasScale.value) / 2;
    this.image.y = (this.viewportHeight - this.image.imageElement.height * this.canvasScale.value) / 2;

    // 计算新的宽度和高度
    this.image.width = this.image.imageElement.width * this.canvasScale.value;
    this.image.height = this.image.imageElement.height * this.canvasScale.value;

    this.image.sx = 0
    this.image.sy = 0
    this.image.sw = this.image.imageElement.width
    this.image.sh = this.image.imageElement.height
  }

  private initEventListeners() {
    this.canvas.addEventListener('mouseleave', (e) => {
      this.mouse.dragging = false;
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.canvas.contains(e.target as Node)) {
        this.mouse.dragging = false;
      }
    });

    this.canvas.addEventListener('mousedown', this.handleMousedown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseup.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));


    // 最后记得停止观察
    // ro.disconnect();

    // window.addEventListener('resize', () => {
    //   const newWidth = this.canvas.parentElement!.clientWidth;
    //   const newHeight = this.canvas.parentElement!.clientHeight

    //   const ratio = newWidth / this.canvasOriginalWidth

    //   this.originX *= ratio
    //   this.originY *= ratio
    //   this.scaleWidth *= ratio
    //   this.scaleHeight *= ratio

    //   this.textAttribute.X *= ratio
    //   this.textAttribute.y *= ratio
    //   this.textAttribute.fontSize *= ratio

    //   this.cutX *= ratio
    //   this.cutY *= ratio
    //   this.cutWidth *= ratio
    //   this.cutHeight *= ratio

    //   for (let index = 0; index < this.pathData.length; index++) {
    //     const point = this.pathData[index];
    //     point.x *= ratio
    //     point.y *= ratio
    //   }

    //   this.canvasOriginalWidth = newWidth;
    //   this.canvasOriginalHeight = newHeight;

    //   this.canvas.width = newWidth * this.dpi
    //   this.canvas.height = newHeight * this.dpi

    //   this.draw()

    // });
  }
  handleViewportResize(width: number, height: number) {
    this.viewportWidth = width;
    this.viewportHeight = height;

    this.canvas.width = width * this.dpi
    this.canvas.height = height * this.dpi

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.draw()
  }

  private handleMousedown(event: MouseEvent) {
    if (event.buttons !== 1) return;
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    this.mouse.dragging = true;
    this.mouse.lastX = mouseX;
    this.mouse.lastY = mouseY;

    if (this.canvasModel === CanvasModel.Crop) {
      if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, [this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height], this.ctx)) {
        this.cropRect.InCropModule = MouseInCropModule.InCrop
      } else {
        this.cropRect.InCropModule = MouseInCropModule.InOut
      }

      const listCursor: {
        [key: number]: MouseInCropModule
      } = {
        0: MouseInCropModule.InTop,
        1: MouseInCropModule.InBottom,
        2: MouseInCropModule.InLeft,
        3: MouseInCropModule.InRight
      }
      this.cropRect.lineDataList.forEach((item, index) => {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
          this.cropRect.InCropModule = listCursor[index]
        }
      })


      const dotCursor: {
        [key: number]: MouseInCropModule
      } = {
        0: MouseInCropModule.InTop,
        1: MouseInCropModule.InBottom,
        2: MouseInCropModule.InLeft,
        3: MouseInCropModule.InRight,
        4: MouseInCropModule.InLeftTop,
        5: MouseInCropModule.InRightTop,
        6: MouseInCropModule.InLeftBottom,
        7: MouseInCropModule.InRightBottom,
      }
      this.cropRect.dotDataList.forEach((item, index) => {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
          this.cropRect.InCropModule = dotCursor[index]
        }
      })
    } else if (this.canvasModel === CanvasModel.DrawLine) {
      this.line.lineStartX = mouseX;
      this.line.lineStartY = mouseY;

      this.line.lineData.push({
        drawType: this.line.drawType,
        strokeStyle: this.line.strokeStyle,
        lineWidth: this.line.lineWidth,
        data: [{ x: this.line.lineStartX, y: this.line.lineStartY }]
      })
      if (this.line.drawType === DrawType.Eraser) {
        this.eraseCircle(this.line.lineStartX, this.line.lineStartY, this.line.lineWidth / 2)
        // this.erase(this.line.lineStartX, this.line.lineStartY, this.line.lineWidth)
      }
    } else if (this.canvasModel === CanvasModel.Text) {
      //
      // this.textEditor.createTextEditorPanel({ x: mouseX, y: mouseY, w: 200, h: 100 })
    }

    // console.log(this.cropRect.InCropModule);
  }
  private handleMousemove(event: MouseEvent) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    if (this.mouse.dragging) {
      const dx = mouseX - this.mouse.lastX;
      const dy = mouseY - this.mouse.lastY;

      this.mouse.lastX = mouseX;
      this.mouse.lastY = mouseY;
      if (this.canvasModel === CanvasModel.Crop) {
        switch (this.cropRect.InCropModule) {
          case MouseInCropModule.InTop:
            this.cropRect.y += dy
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InBottom:
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InLeft:
            this.cropRect.x += dx
            this.cropRect.width -= dx
            break;
          case MouseInCropModule.InRight:
            this.cropRect.width += dx
            break;
          case MouseInCropModule.InLeftTop:
            this.cropRect.x += dx
            this.cropRect.y += dy
            this.cropRect.width -= dx
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InRightTop:
            this.cropRect.y += dy
            this.cropRect.width += dx
            this.cropRect.height -= dy
            break;
          case MouseInCropModule.InLeftBottom:
            this.cropRect.x += dx
            this.cropRect.width -= dx
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InRightBottom:
            this.cropRect.width += dx
            this.cropRect.height += dy
            break;
          case MouseInCropModule.InCrop:
            // case MouseInCropModule.InOut:
            this.cropRect.x += dx
            this.cropRect.y += dy
            break;
          default:
            break;
        }

        // 限制裁剪框的位置和大小不能超出图片范围
        this.cropRect.x = Math.min(Math.max(this.image.x, this.cropRect.x), this.image.x + this.image.width - this.cropRect.width);
        this.cropRect.y = Math.min(Math.max(this.image.y, this.cropRect.y), this.image.y + this.image.height - this.cropRect.height);

        this.cropRect.width = Math.min(Math.max(50, this.cropRect.width), this.image.width);
        this.cropRect.height = Math.min(Math.max(50, this.cropRect.height), this.image.height);
      } else if (this.canvasModel === CanvasModel.DrawLine) {
        this.line.lineData[this.line.lineData.length - 1].data.push({ x: mouseX, y: mouseY })
      } else {
        this.image.x += dx;
        this.image.y += dy;
      }
      this.draw()
    } else {
      let cursor = 'default'
      if (this.canvasModel === CanvasModel.Crop) {
        if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, [this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height], this.ctx)) {
          cursor = 'move' || cursor
        }

        /**
         * lineCursor
         */
        const listCursor: {
          [key: number]: string
        } = {
          0: 'ns-resize',
          1: 'ns-resize',
          2: 'ew-resize',
          3: 'ew-resize'
        }
        this.cropRect.lineDataList.forEach((item, index) => {
          if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
            cursor = listCursor[index] || cursor
          }
        })
        /**
         * dotCursor
         */
        const dotCursor: {
          [key: number]: string
        } = {
          0: 'ns-resize',
          1: 'ns-resize',
          2: 'ew-resize',
          3: 'ew-resize',
          4: 'nwse-resize',
          5: 'nesw-resize',
          6: 'nesw-resize',
          7: 'nwse-resize',
        }
        this.cropRect.dotDataList.forEach((item, index) => {
          if (checkInPath(mouseX * this.dpi, mouseY * this.dpi, item, this.ctx)) {
            cursor = dotCursor[index] || cursor
          }
        })
      } else if (this.canvasModel === CanvasModel.DrawLine) {
        cursor = this.line.cursor
      } else if (this.canvasModel === CanvasModel.Text) {
        // cursor = 'text'
      }

      this.canvas.style.cursor = cursor;
    }
  }
  private handleWheel(event: WheelEvent) {
    event.preventDefault();

    let centreX = event.offsetX;
    let centreY = event.offsetY;



    const wheel = event.deltaY < 0 ? 1 : -1;

    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.canvasScale.value * zoom;

    if (newScale < this.canvasScale.min || newScale > this.canvasScale.max) return;

    if (this.canvasModel === CanvasModel.Crop) {
      centreX = this.image.x + this.image.width / 2
      centreY = this.image.y + this.image.height / 2


      this.cropRect.x = (this.cropRect.x - centreX) * zoom + centreX
      this.cropRect.y = (this.cropRect.y - centreY) * zoom + centreY

      this.cropRect.width *= zoom;
      this.cropRect.height *= zoom;
    }

    // 计算按照鼠标点进行缩放计算
    this.image.x = (this.image.x - centreX) * zoom + centreX;
    this.image.y = (this.image.y - centreY) * zoom + centreY;

    this.canvasScale.value = newScale;

    // // 计算新的宽度和高度
    this.image.width *= zoom;
    this.image.height *= zoom;

    // this.cutWidth = this.cutWidth * zoom;
    // this.cutHeight = this.cutHeight * zoom;

    // this.lineWidth *= zoom


    // for (let index = 0; index < this.pathData.length; index++) {
    //   const point = this.pathData[index];
    //   const newX = (point.x - mouseX) * zoom + mouseX;
    //   const newY = (point.y - mouseY) * zoom + mouseY;
    //   point.x = newX
    //   point.y = newY
    // }

    // this.textAttribute.X = (this.textAttribute.X - mouseX) * zoom + mouseX
    // this.textAttribute.y = (this.textAttribute.y - mouseY) * zoom + mouseY
    // this.textAttribute.fontSize = this.textAttribute.fontSize * zoom

    this.draw()
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMousedown);
    this.canvas.removeEventListener("mousemove", this.handleMousemove);
    this.canvas.removeEventListener("mouseup", this.handleMouseup);
    this.canvas.removeEventListener("wheel", this.handleWheel);
    this.ro.disconnect();
  }
  private handleMouseup() {
    this.mouse.dragging = false;
    // this.isDrawLine = false
    // console.log(JSON.stringify(this.pathData));

    // this.lastX = 0;
    // this.lastY = 0;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.canvasModel === CanvasModel.Crop) {
      this.drawCropCover()
      this.drawCropRect()
    }

    this.drawImage()
    this.drawLine()

    this.textEditor.draw()
    // this.drawText()

    // this.textController.setCursor(0, 0, 14)
    // this.ctx.font = `${this.text.textAttribute.fontSize}px ${this.text.textAttribute.fontFamily}`;
    // // this.ctx.textAlign = 'center';
    // this.ctx.fillStyle = 'red';
    // this.ctx.fillText('测', 0, 14);
  }

  drawText() {
    // this.ctx.save();
    // for (let index = 0; index < this.text.textData.length; index++) {
    //   const {
    //     boxData,
    //     textProps
    //   } = this.text.textData[index];

    //   if (this.textController.isActive) {
    //     this.textController.drawTextBox(boxData)
    //   }

    //   for (let propsIndex = 0; propsIndex < textProps.length; propsIndex++) {
    //     // console.log(123, textProps[propsIndex]);

    //     const { attribute, x, y, data, w, h, ascent } = textProps[propsIndex]
    //     const {
    //       fontSize,
    //       fontFamily,
    //       fontColor,
    //       fontWeight,
    //       fontStyle,
    //       fontUnderline,
    //       fontLineThrough
    //     } = attribute;

    //     console.log(123, w, h, x, y,);

    //     // 绘制下划线
    //     if (fontUnderline === FontUnderline.Underline) {
    //       this.ctx.lineWidth = 1;
    //       this.ctx.strokeStyle = fontColor;
    //       this.ctx.beginPath();
    //       // 5 是下划线与文本底部的距离
    //       this.ctx.moveTo(x, y + 5);
    //       this.ctx.lineTo(x + w, y + 5);
    //       this.ctx.stroke();
    //     }

    //     // 绘制删除线
    //     if (fontLineThrough === FontLineThrough.LineThrough) {
    //       this.ctx.lineWidth = 1;
    //       this.ctx.strokeStyle = fontColor;
    //       this.ctx.beginPath();
    //       // TODO: 文字基线Y有问题计算
    //       this.ctx.moveTo(x, y - 10); // -2 是删除线与文本顶部的距离
    //       this.ctx.lineTo(x + w, y - 10);
    //       this.ctx.stroke();
    //     }

    //     // this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
    //     this.ctx.font = `${fontWeight} ${fontStyle} ${fontSize}px ${fontFamily}`;
    //     // console.log(fontSize, this.ctx.measureText(data).width);
    //     this.ctx.fillStyle = fontColor;
    //     this.ctx.fillText(data, x, y);
    //   }
    // }
    // this.ctx.restore();
  }

  // // 缩放中心点，这里以画布中心为例
  // const centerX = canvas.width / 2;
  // const centerY = canvas.height / 2;

  // // 缩放点
  // const scaledPoints = points.map(point => {
  //     const newX = (point.x - centerX) * zoomLevel + centerX;
  //     const newY = (point.y - centerY) * zoomLevel + centerY;
  //     return { x: newX, y: newY };
  // });

  drawLine() {
    this.ctx.save()
    for (let index = 0; index < this.line.lineData.length; index++) {
      const lineItem = this.line.lineData[index];
      // if (lineItem.drawType === DrawType.Line) {
      this.ctx.strokeStyle = lineItem.strokeStyle;
      this.ctx.lineWidth = lineItem.lineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      if (lineItem.drawType === DrawType.Eraser) {
        this.ctx.globalCompositeOperation = 'destination-out';
      }
      this.ctx.beginPath();
      for (let j = 0; j < lineItem.data.length; j++) {
        const point = lineItem.data[j];
        if (j === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      }
      this.ctx.stroke();
      // } else {

      // for (let j = 1; j < lineItem.data.length; j++) {
      //   const point = lineItem.data[j];
      //   this.erase(point.x, point.y, lineItem.lineWidth)
      // }

      // https://code.juejin.cn/pen/7349828056090935322 橡皮擦功能
      // let p1 = lineItem.data[0]
      // let p2 = {
      //   x: 0,
      //   y: 0
      // }
      // let k = 0
      // let b = 0

      // for (let j = 1; j < lineItem.data.length; j++) {
      //   p2 = lineItem.data[j];
      //   // p1 p2直线斜率
      //   k = (p2.y - p1.y) / (p2.x - p1.x);
      //   //y = kx + b 的 b
      //   b = p1.y - k * p1.x;
      //   // 两点之间的距离
      //   var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      //   //两点之间要画多少个圆才能看起来像条平滑直线，0.2 是平均每像素的距离 画0.2个圆，100像素的距离画20个圆足够
      //   var num = d > 20 ? d * 3 : d * 0.2;
      //   var x = p1.x;
      //   var y = p1.y; //第一个圆的位置
      //   var n = (p2.x - p1.x) / num; //每个圆心之间的间距
      //   for (var i = 0; i < num; i++) {
      //     //依次在这条直线上画 num 个圆
      //     this.eraseCircle(x, y, lineItem.lineWidth / 2)
      //     x += n;
      //     y = k * x + b;
      //   }
      //   p1 = p2; //最后 将p2 赋给 p1
      // }

      // }
    }

    this.ctx.restore()
  }
  private eraseCircle(x: number, y: number, radius: number) {
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore()
  }
  private erase(x: number, y: number, radius: number) {
    this.ctx.save()
    this.ctx.globalCompositeOperation = 'destination-out';

    this.ctx.lineWidth = radius;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();

    this.ctx.restore()
  }
  private drawImage() {
    this.ctx.save()
    this.ctx.globalCompositeOperation = "destination-over"
    // 中心点
    this.ctx.translate(this.image.x + this.image.width / 2, this.image.y + this.image.height / 2);
    // 翻转
    this.ctx.scale(this.image.flip.x, this.image.flip.y);
    // 旋转
    this.ctx.rotate(this.image.angle * Math.PI / 180);
    // 渲染
    this.ctx.drawImage(this.image.imageElement, this.image.sx, this.image.sy, this.image.sw, this.image.sh, -this.image.width / 2, -this.image.height / 2, this.image.width, this.image.height);

    // TODO: 优化渲染触发逻辑
    // (this.canvasModel === CanvasModel.Styled || this.canvasModel === CanvasModel.Filter)
    // &&
    if (
      this.image.isStyleSettings()
    ) {

      const { brightness, contrast, exposure, saturation } = this.image.styleSettings
      const imageData = this.ctx.getImageData(this.image.x * this.dpi, this.image.y * this.dpi, this.image.width * this.dpi, this.image.height * this.dpi)

      console.time();

      // 遍历每个像素，调整数值
      for (let i = 0; i < imageData.data.length; i += 4) {

        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        let a = imageData.data[i + 3];

        const nextPixel = getNextPixel(imageData, i);
        const previousPixel = getPreviousPixel(imageData, i);
        const nextRowPixel = getNextRowPixel(imageData, i, imageData.width);
        const PreviousRowPixel = getPreviousRowPixel(imageData, i, imageData.width);
        const isLastRowPixel = isLastRow(i, imageData.width, imageData.height);
        const isCurRowLastPixel = isLastPixelInRow(i, imageData.width);
        // console.log({ r, g, b, a }, nextPixel, previousPixel, nextRowPixel, isLastRowPixel, isCurRowLastPixel);

        // 亮度
        r = Math.min(r * (1 + brightness), 255);
        g = Math.min(g * (1 + brightness), 255);
        b = Math.min(b * (1 + brightness), 255);

        // 对比度
        const avg = (r + g + b) / 3;
        r = Math.min(Math.max(((r - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);
        g = Math.min(Math.max(((g - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);
        b = Math.min(Math.max(((b - avg) * contrast) + avg + 128 * (contrast - 1), 0), 255);

        // 曝光
        r = Math.min(r + exposure, 255);
        g = Math.min(g + exposure, 255);
        b = Math.min(b + exposure, 255);

        // 饱和度
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = r * saturation + gray * (1 - saturation);
        g = g * saturation + gray * (1 - saturation);
        b = b * saturation + gray * (1 - saturation);

        // console.log(this.image.filterType);
        // 根据滤镜类型应用滤镜
        switch (this.image.filterType) {
          case FilterType.Normal:
            break;
          case FilterType.Grayscale:
            const gray = 0.21 * r + 0.72 * g + 0.07 * b;
            r = gray;
            g = gray;
            b = gray;
            break;
          case FilterType.Sepia:
            r = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
            g = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
            b = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
            break;
          case FilterType.Invert:
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            break;
          case FilterType.Sharpen:
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
            break;
          case FilterType.fluorescence:
            r = r * 128 / (g + b + 1);
            g = g * 128 / (r + b + 1)
            b = b * 128 / (g + r + 1)
            break;
          case FilterType.threshold:
            var average = (r + g + a) / 3;
            r = g = b = average > 150 ? 255 : 0;
            break;
          case FilterType.Emboss:
            if (isLastRowPixel) {
              // 最后一行取上一行的当前点
              r = PreviousRowPixel!.r;
              g = PreviousRowPixel!.g;
              b = PreviousRowPixel!.b;
            } else {
              // 是当前行的最后一个点就取前一个点，否则就取下一行的当前点
              if (isCurRowLastPixel) {
                r = previousPixel!.r;
                g = previousPixel!.g;
                b = previousPixel!.b;
              } else {
                r = 255 / 2 + 2 * r - nextPixel!.r - nextRowPixel!.r;
                g = 255 / 2 + 2 * g - nextPixel!.g - nextRowPixel!.g;
                b = 255 / 2 + 2 * b - nextPixel!.b - nextRowPixel!.b;
              }
            }
            break;
          default:
            console.log('Unsupported filter type');
        }

        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
      }
      this.image.cacheStyleSettings = {
        ...this.image.styleSettings,
        width: this.image.width,
        height: this.image.height,
        filterType: this.image.filterType,
        imageData: imageData,
      }
      console.timeEnd();
    }

    if (this.image.cacheStyleSettings.imageData) {
      this.ctx.putImageData(this.image.cacheStyleSettings.imageData, this.image.x * this.dpi, this.image.y * this.dpi)
    }

    this.ctx.restore()
  }

  private drawCropRect() {
    this.ctx.save()

    // 绘制裁剪框
    this.ctx.strokeStyle = 'rgba(255,255,255)'
    this.ctx.lineWidth = this.cropRect.lineWidth
    this.ctx.strokeRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height)

    this.cropRect.lineDataList = getCropLine(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height, this.cropRect.lineWidth)

    // 绘制参考线
    this.ctx.lineWidth = this.cropRect.referenceLineWidth
    this.ctx.strokeStyle = this.cropRect.referenceLinColor
    const referenceLineList = getCropReferenceLine(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height)
    referenceLineList.forEach((item) => {
      this.ctx.beginPath()
      this.ctx.moveTo(item[0], item[1])
      this.ctx.lineTo(item[2], item[3])
      this.ctx.closePath()
      this.ctx.stroke()
    })

    // 绘制操作点
    this.ctx.fillStyle = this.cropRect.dotColor;
    this.cropRect.dotDataList = getCropDot(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height, this.cropRect.dotSize)
    this.cropRect.dotDataList.forEach((item) => {
      this.ctx.fillRect(item[0], item[1], item[2], item[3])
    })

    this.ctx.restore()
  }
  private drawCropCover() {
    this.ctx.save()
    this.ctx.fillStyle = "rgba(0,0,0,0.8)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.globalCompositeOperation = "source-atop"
    this.ctx.clearRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height);
    this.ctx.restore()
  }
  switchCanvasModel(value: CanvasModel) {
    this.canvasModel = value
    switch (this.canvasModel) {
      case CanvasModel.Crop:
        this.initCrop()
        break
      case CanvasModel.DrawLine:
        this.initDrawLine()
        break
      case CanvasModel.Text:
        // this.initDrawLine()
        break
      default:
        break
    }
    this.draw()
  }
  public initCrop() {
    this.cropRect.width = this.image.width + this.cropRect.lineWidth
    this.cropRect.height = this.image.height + this.cropRect.lineWidth
    this.cropRect.x = this.image.x - this.cropRect.lineWidth / 2
    this.cropRect.y = this.image.y - this.cropRect.lineWidth / 2
  }
  public initDrawLine() {
    // this.canvas.style.cursor = this.line.cursor;
    // this.canvas.style.cursor = 'nesw-resize';
  }
  setLineOptions(options: SetLineOptions) {
    this.line.lineWidth = options.lineWidth
    this.line.strokeStyle = options.strokeStyle
    this.line.drawType = options.drawType
  }
  setTextAttribute(textAttr: ITextAttr) {
    this.textEditor.setOptions({ textAttr })
  }
}

export interface SetLineOptions {
  lineWidth: number
  strokeStyle: string
  drawType: DrawType
}
