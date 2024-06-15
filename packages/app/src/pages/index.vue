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
const barOption = ref([
  {
    icon: 'i-carbon-cut-out',
    title: '裁剪',
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

const handleChangeIndex = (index: number) => {
  if (currentBarIndex.value === index) return;
  currentBarIndex.value = index;
  initActiveTranslateLeft(currentBarIndex.value)
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
  public scale: number = 1;
  private baseScale: number = 1;

  /**
   * @description: 距离边界的空隙
   */
  private margin: number = 20;

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

  private dragging: boolean = false;

  constructor(canvasId: string) {
    this.dpi = window.devicePixelRatio || 1;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.canvas.width = this.canvas.parentElement!.clientWidth * this.dpi;
    this.canvas.height = this.canvas.parentElement!.clientHeight * this.dpi;
    this.ctx = this.canvas.getContext('2d')!;
    this.initEventListeners();
  }
  public loadImage(src: string) {
    if (!src) return
    this.image.src = src;
    this.image.onload = () => {

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

      this.drawImage()
    };
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

    this.canvas.addEventListener('mousedown', (e) => this.startDragging(e));
    this.canvas.addEventListener('mousemove', (e) => this.dragImage(e));
    this.canvas.addEventListener('mouseup', () => this.stopDragging());

    this.canvas.addEventListener('wheel', (e) => this.zoomImage(e));
  }
  private startDragging(event: MouseEvent) {
    if (event.buttons !== 1) return;
    this.dragging = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }
  private dragImage(event: MouseEvent) {
    if (this.dragging) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      const dx = mouseX - this.lastX;
      const dy = mouseY - this.lastY;

      this.originX += dx;
      this.originY += dy;

      this.lastX = mouseX;
      this.lastY = mouseY;

      this.drawImage();
    }
  }
  private zoomImage(event: WheelEvent) {
    event.preventDefault();

    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const wheel = event.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * 0.1);

    const newScale = this.scale * zoom;

    if (newScale < this.baseScale * this.minScale || newScale > this.baseScale * this.maxScale) return;

    // Calculate the new origin to keep the point under the mouse stationary
    this.originX = mouseX - (mouseX - this.originX) * zoom;
    this.originY = mouseY - (mouseY - this.originY) * zoom;

    this.scale = newScale;
    console.log(this.scale);

    this.drawImage()
  }

  private stopDragging() {
    this.dragging = false;
    this.lastX = null;
    this.lastY = null;
  }

  private drawImage() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 计算新的宽度和高度
    const newWidth = this.image.width * this.scale;
    const newHeight = this.image.height * this.scale;
    // 绘制图片
    this.ctx.drawImage(this.image, this.originX, this.originY, newWidth, newHeight);
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
          v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(idx)"></div>
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
