<script setup lang="ts" generic="T extends any, O extends any">
import { sum } from "@v50/edit-utils";
import type { ComponentPublicInstance } from 'vue';
type refItem = Element | ComponentPublicInstance | null

// console.log(sum(1, 2));


defineOptions({
  name: 'IndexPage',
})


/**
 * @module: Bar
 */
const currentBarIndex = ref(0)
const activeTranslateLeft = ref(0)
const barItemRefs = ref<refItem[]>([]);
const activeLine = ref<refItem>(null)



interface BarItem {
  icon: string,
  title: string,
  handle?: () => void
}

const barOption = ref<BarItem[]>([
  {
    icon: 'i-carbon-cut-out',
    title: '裁剪',
    handle: () => {
      canvasInstance.value?.startCrop()
    }
  }, {
    icon: 'i-carbon-awake',
    title: '亮度',
  }, {
    icon: 'i-carbon-brush-freehand',
    title: '画笔',
  }, {
    icon: 'i-carbon-edge-enhancement',
    title: '滤镜',
  }, {
    icon: 'i-carbon-text-small-caps',
    title: '文字',
  },
])

onMounted(() => {
  initActiveTranslateLeft(0)
})

const handleChangeIndex = (item: BarItem, index: number) => {
  // if (currentBarIndex.value === index) return;

  currentBarIndex.value = index;
  initActiveTranslateLeft(currentBarIndex.value)

  item.handle?.()
}

const setBarItemRefs = (el: refItem) => {
  if (el)
    barItemRefs.value.push(el);
};

const initActiveTranslateLeft = (index: number) => {
  let marginLeft = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginLeft);
  let marginRight = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginRight);
  const b_offsetWidth = (barItemRefs.value[index] as HTMLElement).offsetWidth + marginLeft + marginRight

  const A_offsetWidth = (activeLine.value as HTMLElement).offsetWidth
  // 计算下划线位置
  activeTranslateLeft.value = b_offsetWidth * index + (b_offsetWidth - A_offsetWidth) / 2;
}

/**
 * @module: Image
 */

class CanvasImageManipulator {
  /**
   * @description: canvas && Img
   */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement = new Image();

  /**
   * @description: Scale
   * minScale 缩放最小比例
   * maxScale 缩放最大比例
   * scale 缩放比例
   * baseScale  // 基础缩放比例
   */
  private minScale: number = 0.1
  private maxScale: number = 10
  private baseScale: number = 1;
  public scale: number = 1;

  /**
   * @description: 距离边界的空隙
   */
  private margin: number = 100;

  private dpi: number = 1;

  /**
    * @description: 当前的坐标点
    */
  private originX: number = 0;
  private originY: number = 0;

  /**
    * @description: 上次的坐标点
    */
  private lastX: number = 0;
  private lastY: number = 0;


  /**
    * @description: 缩放后的宽度高度
    */
  private scaleWidth: number = 0;
  private scaleHeight: number = 0;


  /**
    * @description: 裁剪框
    */
  private cutWidth: number = 0;
  private cutHeight: number = 0;
  private cutX: number = 0;
  private cutY: number = 0;
  private cutLineWidth: number = 2;
  private cutReferenceLineWidth: number = 1;
  private cutDotWidth: number = 40;

  private dragging: boolean = false;

  private cropping: boolean = false;
  // private isResizing: boolean = false;
  private resizeEdge: string | null = null;

  /***
   * @description: 鼠标在裁剪模块内
   * 1. crop: 鼠标在裁剪框内
   * 2. edge: 鼠标在裁剪框的边上
   * 3. corner: 鼠标在裁剪框的角上
   */
  private mouseInCropModule: 'crop' | 'edge' | 'corner' | null = null

  constructor(canvasId: string) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    // this.canvas.width = this.canvas.parentElement!.clientWidth * this.dpi;
    // this.canvas.height = this.canvas.parentElement!.clientHeight * this.dpi;
    this.canvas.width = this.canvas.parentElement!.clientWidth;
    this.canvas.height = this.canvas.parentElement!.clientHeight;
    this.ctx = this.canvas.getContext('2d')!;
    this.initEventListeners();
  }
  public loadImage(src: string) {
    if (!src) return
    this.image.src = src;
    this.image.onload = () => {
      this.onLoadImage()
      this.drawImage()
    };
  }
  private onLoadImage() {
    const canvasAspect = this.canvas.width / this.canvas.height;
    const imageAspect = this.image.width / this.image.height;

    if (imageAspect > canvasAspect) {
      this.baseScale = (this.canvas.width - 2 * this.margin) / this.image.width;
    } else {
      this.baseScale = (this.canvas.height - 2 * this.margin) / this.image.height;
    }

    this.scale = this.baseScale;

    // 计算初始位置，使得图片居中
    this.originX = (this.canvas.width - this.image.width * this.scale) / 2;
    this.originY = (this.canvas.height - this.image.height * this.scale) / 2;

    // 计算新的宽度和高度
    this.scaleWidth = this.image.width * this.scale;
    this.scaleHeight = this.image.height * this.scale;
  }

  private initEventListeners() {
    this.canvas.addEventListener('mouseleave', (e) => {
      this.dragging = false;
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.canvas.contains(e.target as Node)) {
        this.dragging = false;
      }
    });

    this.canvas.addEventListener('mousedown', this.startDragging.bind(this));
    this.canvas.addEventListener('mousemove', this.dragImage.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDragging.bind(this));

    this.canvas.addEventListener('wheel', this.zoomImage.bind(this));
  }
  private startDragging(event: MouseEvent) {
    if (event.buttons !== 1) return;
    this.dragging = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;

    const edge = this.getEdge(event.offsetX, event.offsetY)

    if (edge) {
      this.mouseInCropModule = 'edge'
      this.resizeEdge = edge;
    }

    if (this.isInCropBox(event.offsetX, event.offsetY)) {
      this.mouseInCropModule = 'crop'
    }

    // if (this.resizeEdge) {
    //   this.isResizing = true;
    // }

  }
  private dragImage(event: MouseEvent) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    if (this.dragging) {
      const dx = mouseX - this.lastX;
      const dy = mouseY - this.lastY;

      this.lastX = mouseX;
      this.lastY = mouseY;

      if (this.cropping) {
        if (this.mouseInCropModule === 'edge') {
          mouseX = Math.max(mouseX, this.originX)
          mouseX = Math.min(mouseX, this.originX + this.scaleWidth)
          mouseY = Math.max(mouseY, this.originY)
          mouseY = Math.min(mouseY, this.originY + this.scaleHeight)
          switch (this.resizeEdge) {
            case "left":
              this.cutWidth += this.cutX - mouseX;
              this.cutX = mouseX;
              break;
            case "right":
              this.cutWidth = mouseX - this.cutX;
              break;
            case "top":
              this.cutHeight += this.cutY - mouseY;
              this.cutY = mouseY;
              break;
            case "bottom":
              this.cutHeight = mouseY - this.cutY;
              break;
          }
        }
        if (this.mouseInCropModule === 'crop') {
          this.cutX += dx;
          this.cutY += dy;

          // 确保裁剪框在图片范围内
          this.cutX = Math.max(
            this.cutX,
            this.originX
          );

          this.cutY = Math.max(
            this.cutY,
            this.originY
          );

          if (this.cutX + this.cutWidth > this.originX + this.scaleWidth) {
            this.cutX = this.originX + this.scaleWidth - this.cutWidth
          }

          if (this.cutY + this.cutHeight > this.originY + this.scaleHeight) {
            this.cutY = this.originY + this.scaleHeight - this.cutHeight
          }

        }
      } else {
        this.originX += dx;
        this.originY += dy;
      }
      this.draw()
    } else {
      this.canvas.style.cursor = this.getCursorStyle(mouseX, mouseY);
    }
  }
  private getCorner(x: number, y: number) {
    const size = 10;
    // if (Math.abs(x - this.cutX) < size && Math.abs(y - this.cutY) < size)
    //   return "tl"; // top-left
    // if (
    //   Math.abs(x - (this.cutX + this.cutWidth)) < size &&
    //   Math.abs(y - this.cutY) < size
    // )
    //   return "tr"; // top-right
    // if (
    //   Math.abs(x - this.cutX) < size &&
    //   Math.abs(y - (this.cutY + this.cutHeight)) < size
    // )
    //   return "bl"; // bottom-left
    // if (
    //   Math.abs(x - (this.cutX + this.cutWidth)) < size &&
    //   Math.abs(y - (this.cutY + this.cutHeight)) < size
    // )
    //   return "br"; // bottom-right
    return null;
  }
  private getEdge(x: number, y: number) {
    if (Math.abs(x - this.cutX) < this.cutLineWidth) return "left";
    if (Math.abs(x - (this.cutX + this.cutWidth)) < this.cutLineWidth) return "right";
    if (Math.abs(y - this.cutY) < this.cutLineWidth) return "top";
    if (Math.abs(y - (this.cutY + this.cutHeight)) < this.cutLineWidth) return "bottom";
    return null;
  }
  private getCursorStyle(x: number, y: number) {
    const corner = this.getCorner(x, y);
    const edge = this.getEdge(x, y);
    if (corner) {
      switch (corner) {
        case "tl":
        case "br":
          return "nwse-resize";
        case "tr":
        case "bl":
          return "nesw-resize";
      }
    }
    if (edge) {
      switch (edge) {
        case "left":
        case "right":
          return "ew-resize";
        case "top":
        case "bottom":
          return "ns-resize";
      }
    }
    if (this.isInCropBox(x, y)) {
      return "move";
    }
    return "default";
  }
  private isInCropBox(x: number, y: number): boolean {
    return (
      x > this.cutX &&
      x < this.cutX + this.cutWidth &&
      y > this.cutY &&
      y < this.cutY + this.cutHeight
    );
  }
  private zoomImage(event: WheelEvent) {
    event.preventDefault();

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const wheel = event.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.scale * zoom;

    if (newScale < this.baseScale * this.minScale || newScale > this.baseScale * this.maxScale) return;

    const relativeX = this.originX - this.cutX
    const relativeY = this.originY - this.cutY

    // 计算按照鼠标点进行缩放计算
    this.originX = mouseX - (mouseX - this.originX) * zoom;
    this.originY = mouseY - (mouseY - this.originY) * zoom;

    this.cutX = this.originX - relativeX * zoom
    this.cutY = this.originY - relativeY * zoom

    this.scale = newScale;

    // 计算新的宽度和高度
    this.scaleWidth = this.image.width * this.scale;
    this.scaleHeight = this.image.height * this.scale;

    this.cutWidth = this.cutWidth * zoom;
    this.cutHeight = this.cutHeight * zoom;

    this.draw()
  }

  private stopDragging() {
    this.dragging = false;
    this.lastX = 0;
    this.lastY = 0;
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.cropping) {
      this.drawCover()

    }
    this.drawImage()

    if (this.cropping) {
      this.drawCutBox()
    }
  }

  private drawImage() {
    this.ctx.save()
    this.ctx.globalCompositeOperation = "destination-over"
    // 绘制图片
    this.ctx.drawImage(this.image, this.originX, this.originY, this.scaleWidth, this.scaleHeight);
    this.ctx.restore()
  }

  private drawCutBox() {
    this.ctx.save()

    // 绘制裁剪框
    this.ctx.strokeStyle = 'rgba(255,255,255)'
    this.ctx.lineWidth = this.cutLineWidth
    this.ctx.strokeRect(this.cutX, this.cutY, this.cutWidth, this.cutHeight)

    // 绘制参考线
    this.ctx.lineWidth = this.cutReferenceLineWidth
    this.ctx.strokeStyle = 'rgba(255,255,255,.2)'
    this.ctx.beginPath()
    this.ctx.moveTo(this.cutX, this.cutY + this.cutHeight / 3)
    this.ctx.lineTo(this.cutX + this.cutWidth, this.cutY + this.cutHeight / 3)
    this.ctx.moveTo(this.cutX, this.cutY + (this.cutHeight * 2) / 3)
    this.ctx.lineTo(this.cutX + this.cutWidth, this.cutY + (this.cutHeight * 2) / 3)
    this.ctx.moveTo(this.cutX + this.cutWidth / 3, this.cutY)
    this.ctx.lineTo(this.cutX + this.cutWidth / 3, this.cutY + this.cutHeight)
    this.ctx.moveTo(this.cutX + (this.cutWidth * 2) / 3, this.cutY)
    this.ctx.lineTo(this.cutX + (this.cutWidth * 2) / 3, this.cutY + this.cutHeight)
    this.ctx.stroke()

    // 绘制Dot线点

    // this.ctx.lineWidth = this.cutLineWidth
    // this.ctx.beginPath()

    // this.ctx.moveTo(this.cutX + this.cutWidth / 2 - this.cutDotWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth / 2 + this.cutDotWidth, this.cutY - this.cutLineWidth)

    // this.ctx.moveTo(this.cutX + this.cutWidth / 2 - this.cutDotWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth / 2 + this.cutDotWidth, this.cutY + this.cutHeight + this.cutLineWidth)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight / 2 - this.cutDotWidth)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight / 2 + this.cutDotWidth)

    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight / 2 - this.cutDotWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight / 2 + this.cutDotWidth)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutDotWidth / 2, this.cutY - this.cutLineWidth)
    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutDotWidth / 2)


    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutDotWidth / 2, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.moveTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight - this.cutDotWidth / 2)
    // this.ctx.lineTo(this.cutX - this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)


    // this.ctx.moveTo(this.cutX + this.cutWidth - this.cutDotWidth / 2, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY - this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutDotWidth / 2)


    // this.ctx.moveTo(this.cutX + this.cutWidth - this.cutDotWidth / 2, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)
    // this.ctx.moveTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight - this.cutDotWidth / 2)
    // this.ctx.lineTo(this.cutX + this.cutWidth + this.cutLineWidth, this.cutY + this.cutHeight + this.cutLineWidth)

    // this.ctx.strokeStyle = 'rgba(255,255,255)'
    // this.ctx.stroke()

    this.ctx.restore()
  }
  private drawCover() {
    this.ctx.save()
    this.ctx.fillStyle = "rgba(0,0,0,0.5)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.globalCompositeOperation = "source-atop"
    this.ctx.clearRect(this.cutX, this.cutY, this.cutWidth, this.cutHeight);
    this.ctx.restore()
  }
  public startCrop() {
    this.cropping = true

    this.onLoadImage()

    this.cutX = this.originX - this.cutLineWidth / 2
    this.cutY = this.originY - this.cutLineWidth / 2
    this.cutWidth = this.scaleWidth + this.cutLineWidth
    this.cutHeight = this.scaleHeight + this.cutLineWidth


    // this.cutX = this.originX + 50
    // this.cutY = this.originY + 50
    // this.cutWidth = 100 * this.scale
    // this.cutHeight = 100 * this.scale
    this.draw()
  }
  public endCrop() {
    this.cropping = false
  }
}

const canvasInstance = shallowRef<CanvasImageManipulator | null>(null)

// const canvasInstanceObj = ref({
//   instance: null as CanvasImageManipulator | null
// })

onMounted(() => {
  canvasInstance.value = new CanvasImageManipulator('canvas')

  canvasInstance.value?.loadImage('https://via.placeholder.com/1600x500');
  // canvasInstance.value.
  // setInterval(() => {
  //   console.log(canvasInstanceObj.value.instance, canvasInstanceObj.value.instance?.scale);
  // }, 1000)
  // const canvasInstance = reactive(new CanvasImageManipulator('canvas'))
})
const imageFileName = ref('请上传图片')

const scale = computed(() => {
})


const handleChangeUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      canvasInstance.value?.loadImage(e.target?.result as string);
      if (input.files && input.files.length > 0) {
        imageFileName.value = input.files[0].name;
      } else {
        // 处理input.files为空的情况，例如设置默认值或显示错误信息
        imageFileName.value = '请上传图片';
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}
</script>

<template>
  <div w-full h-full flex flex-col>
    <div h-50px w-full class="bg-[#1A212B] color-[#fff]" flex justify-between items-center>
      <div flex h-full items-center>
        <div rel="noreferrer" href="javascript:0" h-full w-50px flex justify-center items-center class="bg-[#2D333C]">
          <div class="i-carbon-image-copy" font-size="25px"></div>
        </div>
        <div pl-3 max-w-200px truncate :title="imageFileName">{{ imageFileName }}</div>
      </div>
      <div flex font-size="22px" class="bar" pos-relative>
        <div :class="[item.icon, 'bar-item-btn']" :title="item.title" :ref="setBarItemRefs"
          v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(item, idx)"></div>
        <div class="active-line" ref="activeLine" pos-absolute w-18px h-5px left-0
          :style="{ left: activeTranslateLeft + 'px' }"></div>
      </div>
      <div class="right" p-r-3>
        <div btn>保存</div>
      </div>
    </div>
    <div flex-auto pos-relative class="bg-[#2D333C]">
      <canvas id="canvas" w-full h-full pos-absolute top-0 left-0></canvas>
    </div>
    <div h-60px w-full class="bg-[#23292c]">
      <input type="file" @change="handleChangeUpload($event)" id="uploadImage" accept="image/*">
      <div class=" color-[#fff]">{{ canvasInstance?.scale }}</div>
    </div>
  </div>
</template>

<style scoped>
.bar>div:is(.bar-item-btn) {
  cursor: pointer;
  margin: 0px 8px;
}

.bar>div:is(.bar-item-btn):hover {
  color: #A9A9A9;
}

.active-line {
  background-color: rgb(13 148 136 / var(--un-bg-opacity));
  bottom: 0;
  transform: translateY(120%);
  transition: left 0.3s ease;
}
</style>
