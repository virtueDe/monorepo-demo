<script setup lang="ts" generic="T extends any, O extends any">
import { CanvasImageManipulator, CanvasModel, FilterType, ImageStyleKey, DrawType, FontWeight, FontStyle, FontUnderline, FontLineThrough } from './image-manipulator/index'

// import { sum } from "@v50/edit-utils";
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
    icon: 'i-carbon:cursor-2',
    title: '查看',
  },
  {
    icon: 'i-carbon-cut-out',
    title: '裁剪',
  },
  {
    icon: 'i-carbon-awake',
    title: '调整',
  },
  {
    icon: 'i-carbon-brush-freehand',
    title: '画笔',
  },
  {
    icon: 'i-carbon-edge-enhancement',
    title: '滤镜',
  },
  {
    icon: 'i-carbon-text-small-caps',
    title: '文字',
  },
])


const rotate = ref(0)
type flipValue = { x: number, y: number }
interface CropBarItem extends BarItem {
  value: number | flipValue
}
const cropBarOption = ref<CropBarItem[]>([
  {
    icon: 'i-carbon:rotate-counterclockwise',
    title: '向左旋转90度',
    value: -90
  },
  {
    icon: 'i-carbon:rotate-clockwise',
    title: '向右旋转90度',
    value: 90
  },
  {
    icon: 'i-carbon:reflect-horizontal',
    title: '水平翻转',
    value: { x: 1, y: 1 }
  },
  {
    icon: 'i-carbon:reflect-vertical',
    title: '垂直翻转',
    value: { x: 1, y: 1 }
  },

])

const handleClickCropBar = (item: CropBarItem, index: number) => {
  if (typeof item.value === 'number') {
    rotate.value += item.value
    canvasInstance.value?.rotation(rotate.value)
  } else {
    canvasInstance.value?.flip(item.value.x, item.value.y)
    if (index === 2) {
      item.value.x = -item.value.x
      canvasInstance.value?.flip(item.value.x, item.value.y)
    } else if (index === 3) {
      item.value.y = -item.value.y
      canvasInstance.value?.flip(item.value.x, item.value.y)
    }
  }
}

const handleClickCropImage = () => {
  canvasInstance.value?.crop()
}
const handleRotationInput = () => {
  canvasInstance.value?.rotation(rotate.value)
}

interface ColorOptionItem {
  min: number
  max: number
  title: string
  key: ImageStyleKey
}

const handleInputRange = () => {
  canvasInstance.value?.changeImageStyled(toRaw(imageStyle))
}

const imageStyle = reactive<Record<ImageStyleKey, number>>({
  brightness: 0,
  contrast: 0,
  exposure: 0,
  saturation: 0,
})

const colorOption = ref<ColorOptionItem[]>([
  {
    min: -100,
    max: 100,
    title: '亮度',
    key: 'brightness'
  },
  {
    min: -100,
    max: 100,
    title: '曝光度',
    key: 'exposure'
  },
  {
    min: -100,
    max: 100,
    title: '对比度',
    key: 'contrast'
  },
  {
    min: -100,
    max: 100,
    title: '饱和度',
    key: 'saturation'
  },
])


const paintDrawType = ref([
  {
    icon: 'i-carbon:paint-brush-alt',
    title: '铅笔',
    value: DrawType.Line,
  },
  {
    icon: 'i-carbon:erase',
    title: '橡皮擦',
    value: DrawType.Eraser,
  },
])
const paintDrawTypeValue = ref<DrawType>(DrawType.Line)

const drawLineWidth = ref<number>(12)

const paintColor = ref([
  'black',
  'red',
  'aqua',
  'yellow',
  'green',
  'purple',
  'pink',
  'orange',
  'brown',
  'gray',
  'white',
  'blue',
  'teal',
  'olive',
  'maroon',
  'fuchsia'
])

const handleClickDrawType = (item: { icon: string, title: string, value: DrawType }) => {
  paintDrawTypeValue.value = item.value
  handleDrawLineChange()
}

const paintColorValue = ref('red')

const handleClickPaintColor = (item: string) => {
  paintColorValue.value = item
  handleDrawLineChange()
}

const handleDrawLineChange = () => {
  // console.log(drawLineWidth);
  // console.log(paintColorValue);
  // console.log(paintDrawTypeValue);
  canvasInstance.value?.setLineOptions({
    lineWidth: drawLineWidth.value,
    strokeStyle: paintColorValue.value,
    drawType: paintDrawTypeValue.value,
  })
}

const filterTypeList = ref([
  {
    title: '原图',
    value: FilterType.Normal
  },
  {
    title: '黑白',
    value: FilterType.Grayscale
  },
  {
    title: '怀旧',
    value: FilterType.Sepia
  },
  {
    title: '反色',
    value: FilterType.Invert
  },
  {
    title: '荧光',
    value: FilterType.fluorescence
  },
  {
    title: '阈值',
    value: FilterType.threshold
  },
  {
    title: '浮雕',
    value: FilterType.Emboss
  },
  // {
  //   title: '锐化',
  //   value: FilterType.Sharpen
  // },
  // {
  //   title: '像素',
  //   value: FilterType.Pixelate
  // },
])

const filterTypeValue = ref<FilterType>(FilterType.Normal)

const handleClickFilter = (item: FilterType) => {
  filterTypeValue.value = item
  canvasInstance.value?.changeFilter(filterTypeValue.value)
}

const fontSize = ref(30)
const fontColor = ref('#ff0000')

watch(() => [fontSize.value, fontColor.value], () => {
  setTextAttribute()
})

const handleClickTextStyle = (item: { title: string, icon: string, use: boolean }) => {
  console.log(item);
  item.use = !item.use
  setTextAttribute()
}

const setTextAttribute = () => {
  canvasInstance.value?.setTextAttribute({
    fontFamily: 'sans-serif',
    fontSize: Number(fontSize.value),
    fontColor: fontColor.value,

    fontWeight: fontStyleList.value[0].use ? FontWeight.Bold : FontWeight.Normal,
    fontStyle: fontStyleList.value[1].use ? FontStyle.Italic : FontStyle.Normal,
    fontUnderline: fontStyleList.value[2].use ? FontUnderline.Underline : FontUnderline.Normal,
    fontLineThrough: fontStyleList.value[3].use ? FontLineThrough.LineThrough : FontLineThrough.Normal,
  })
}

const fontStyleList = ref([
  {
    title: '加粗',
    icon: 'i-carbon:text-bold',
    use: false
  },
  {
    title: '斜体',
    icon: 'i-carbon:text-italic',
    use: false
  },
  {
    title: '下划线',
    icon: 'i-carbon:text-underline',
    use: false
  },
  {
    title: '删除线',
    icon: 'i-carbon:text-strikethrough',
    use: false
  }
])



onMounted(() => {
  initActiveTranslateLeft(0)
})

const handleChangeIndex = (item: BarItem, index: number) => {
  // if (currentBarIndex.value === index) return;

  currentBarIndex.value = index;
  initActiveTranslateLeft(currentBarIndex.value)


  setTimeout(() => {
    // const width = document.getElementById('canvas')?.parentElement?.offsetWidth as number
    // const height = document.getElementById('canvas')?.parentElement?.offsetHeight as number
    // // console.log(width, height, document.getElementById('canvas')?.parentElement?.clientWidth);

    // canvasInstance.value?.handleViewportResize(width, height)


    if (index === 1) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.Crop)
    } else if (index === 0) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.Preview)
    } else if (index === 2) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.Styled)
    } else if (index === 4) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.Filter)
    } else if (index === 3) {
      canvasInstance.value?.switchCanvasModel(CanvasModel.DrawLine)
    } else if (index === 5) {
      setTextAttribute()
      canvasInstance.value?.switchCanvasModel(CanvasModel.Text)
    }
  })

}

const setBarItemRefs = (el: refItem) => {
  if (el)
    barItemRefs.value.push(el);
};

const initActiveTranslateLeft = (index: number) => {
  let marginTop = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginTop);
  let marginBottom = parseInt(window.getComputedStyle(barItemRefs.value[index] as Element).marginBottom);


  const b_offsetHeight = (barItemRefs.value[index] as HTMLElement).offsetHeight + marginTop + marginBottom
  const a_offsetHeight = (activeLine.value as HTMLElement).offsetHeight
  // 计算下划线位置
  activeTranslateLeft.value = b_offsetHeight * index + (b_offsetHeight - a_offsetHeight) / 2;
}


const canvasInstance = shallowRef<CanvasImageManipulator | null>(null)

// const canvasInstanceObj = ref({
//   instance: null as CanvasImageManipulator | null
// })

onMounted(() => {
  const imagePath = new URL('./237-300x300.jpg', import.meta.url).href;
  canvasInstance.value = new CanvasImageManipulator('canvas')
  canvasInstance.value?.loadImage(imagePath);
  // canvasInstance.value?.loadImage('https://picsum.photos/id/237/300/300');

  // setTimeout(() => {
  //   canvasInstance.value?.loadImage('./hjNvQge.jpeg');
  // }, 1000)
})
const imageFileName = ref('请上传图片')

const scale = computed(() => {
})

const handleEndCrop = () => {
  // canvasInstance.value?.reversal()
}

const handleClickSavaImage = () => {
  canvasInstance.value?.saveImage()
}


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
const handleDragRange = (event: InputEvent) => {
  console.log((event.target as HTMLInputElement).value);

  // canvasInstance.value?.changeLuminance(Number((event.target as HTMLInputElement).value))
  canvasInstance.value?.rotation(Number((event.target as HTMLInputElement).value))
}


/** FPS*/
const fps = ref(0);

let startTime = performance.now();
let frameCount = 0;
let lastTimestamp = 0;

function updateFps(timestamp: DOMHighResTimeStamp) {
  frameCount++;
  if (timestamp - lastTimestamp >= 10) {
    const elapsed = timestamp - startTime;
    fps.value = Math.round(1000 * frameCount / elapsed);
    frameCount = 0;
    startTime = timestamp;
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateFps);
}

onMounted(() => {
  requestAnimationFrame(updateFps);
});

const handleUndo = () => {
  canvasInstance.value?.undo()
}

const handleRedo = () => {
  canvasInstance.value?.redo()
}

</script>

<template>
  <div w-full h-full flex flex-col>
    <div h-60px w-full class="bg-[#1A212B] color-[#fff]" flex justify-between items-center>
      <div flex h-full items-center>
        <div rel="noreferrer" href="javascript:0" h-full w-60px flex justify-center items-center class="bg-[#24262b]">
          <div class="i-carbon-image-copy" font-size="25px"></div>
        </div>

        <div>
          <!-- <span pl-3 max-w-200px truncate :title="imageFileName">
            {{ imageFileName }}
          </span> -->
          <div>
            <!-- 点击 -->
            <input type="file" @change="handleChangeUpload($event)" id="uploadImage" accept="image/*">
          </div>
        </div>
      </div>
      <div class="flex font-size-2xl cup gap-20px items-center justify-center">
        <div class="i-carbon:undo hover:color-[#A9A9A9] transition duration-200 ease-in-out" @click="handleUndo"></div>
        <div class="i-carbon:redo hover:color-[#A9A9A9] transition duration-200 ease-in-out" @click="handleRedo"></div>
      </div>
      <div class="right p-r-3 flex gap-10px items-center w-250px justify-end">
        <div>Current FPS: {{ fps }}</div>
        <div btn @click="handleClickSavaImage">保存</div>
      </div>
    </div>
    <div class="flex pos-relative flex-auto">
      <div class="h-100% color-[#fff] flex pos-relative">
        <!-- menu bar -->
        <div class="bg-[#292c31] pos-relative z-2">
          <!-- :class="[currentBarIndex === idx ? 'bg-#1A212B' : '']" -->
          <div class="group h-60px w-60px cursor-pointer flex items-center justify-center" :title="item.title"
            :ref="setBarItemRefs" v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(item, idx)">
            <div :class="[item.icon]"
              class="font-size-22px group-hover:color-[#A9A9A9] transition duration-200 ease-in-out">
            </div>
          </div>
          <div class="pos-absolute w-6px h-30px right-0 top-0 bg-sky-500 transition-top" ref="activeLine"
            :style="{ top: activeTranslateLeft + 'px' }"></div>
        </div>
        <!-- tool -->
        <!-- transition-transform duration-350 -->
        <div class="p12px h-100% w-280px bg-#292c31 border-l-1  border-black border-solid pos-absolute top-0 z-1"
          :class="['left-60px']">
          <!-- currentBarIndex !== 0 ?  : '-translate-x-100%'-->

          <div class="font-size-16p mb-12px">{{ barOption[currentBarIndex].title }}</div>
          <!-- crop -->
          <div v-if="currentBarIndex === 1"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="text-left mb12px font-size-14px">旋转与翻转</div>
            <div class="flex">
              <input @input="handleRotationInput" class="w-100%" type="range" min="-180" max="180" v-model="rotate"
                step="1">
              <div class="ml10px w-40px">{{ rotate }}°</div>
            </div>
            <div class="flex justify-between group mt12px mb12px">
              <div :class="[item.icon]"
                class="cursor-pointer font-size-18px hover:color-[#A9A9A9] transition duration-200 ease-in-out"
                v-for="(item, idx) in cropBarOption" :key="idx" :title="item.title"
                @click="handleClickCropBar(item, idx)"></div>
            </div>

            <div class="mt40px btn w100%" @click="handleClickCropImage">
              确定裁剪
            </div>
          </div>
          <div v-if="currentBarIndex === 2"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="flex font-size-14px mb-20px" v-for="(item, idx) in colorOption" :key="idx">
              <div class="mr10px">{{ item.title }}</div>
              <input @input="handleInputRange" class="w-100% flex-1" type="range" :min="item.min" :max="item.max"
                v-model="imageStyle[item.key]" step="1">
              <div class="ml10px w-40px">{{ imageStyle[item.key] }}</div>
            </div>

          </div>
          <div v-if="currentBarIndex === 3">
            <div class="rounded-12px border-1 border-[#34373A] hover:border-[#424549]">
              <div class="p12px">
                <div class="text-left font-size-12px">画笔宽度</div>
                <div class="flex mt12px">
                  <input @input="handleDrawLineChange" class="w-100% cup" type="range" min="1" max="32"
                    v-model="drawLineWidth" step="1">
                  <div class="ml10px w-30px">{{ drawLineWidth }}</div>
                </div>
              </div>
              <div class="p-12px flex flex-gap-8px">
                <div class="flex-auto cup rounded-8px h-36px flex items-center justify-center bg-[#383A3E]"
                  v-for="(item, idx) in paintDrawType" :key="idx"
                  :class="[item.value === paintDrawTypeValue ? 'bg-primary' : '']" @click="handleClickDrawType(item)"
                  :title="item.title">
                  <div :class="[item.icon]"></div>
                </div>
              </div>
              <div class="p-12px flex flex-gap-9px flex-wrap">
                <div v-for="(item, idx) in paintColor" :key="idx" class="w20px h20px cursor-pointer rounded-2px"
                  :style="{ backgroundColor: item }"
                  :class="[item === paintColorValue ? 'border-1 border-solid border-primary shadow-md shadow-blue-500/40' : '']"
                  @click="handleClickPaintColor(item)">
                </div>
              </div>
            </div>

          </div>
          <div v-if="currentBarIndex === 4"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px flex flex-gap-8px flex-wrap overflow-y-auto h-90%">
            <div v-for="(item, idx) in filterTypeList" :key="idx" @click="handleClickFilter(item.value)"
              :class="[item.value === filterTypeValue ? 'border-1 border-solid border-primary shadow-md shadow-blue-500/40' : '']"
              class="flex-auto bg-[#383A3E] rounded-2px font-size-12px color-[#868686] cup h-200px w-100px flex items-center justify-center">
              {{
                item.title
              }}
            </div>
          </div>
          <div v-if="currentBarIndex === 5"
            class="rounded-12px border-1 border-[#34373A] hover:border-[#424549] p-12px">
            <div class="flex font-size-14px mb-20px justify-center">
              <div class="mr10px">文本大小</div>
              <input type="Number" v-model="fontSize" min="12" max="64" class="w-100% flex-1 color-black pl6px">
            </div>
            <div class="flex font-size-14px mb-20px">
              <div class="mr10px">文本颜色</div>
              <input class="w-100% flex-1" type="color" v-model="fontColor">
            </div>
            <div class="flex justify-between font-size-18px gap-10px">
              <div class="flex-1 cup bg-[#383A3E] flex items-center justify-center p6px rounded-5px"
                v-for="(item, idx) in fontStyleList" :key="idx" :class="[item.use ? 'bg-primary' : '']"
                @click="handleClickTextStyle(item)">
                <div :class="[item.icon]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- transition-left duration-350 currentBarIndex === 0 ? 'left-60px w-[calc(100%-60px)]' :-->
      <div class="h-100% flex-auto bg-[#202020] pos-absolute top-0 box-border overflow-hidden"
        :class="['left-340px w-[calc(100%-340px)]']">
        <canvas id="canvas"></canvas>
      </div>
    </div>
    <!-- <img class="w100px h100px" src="./hjNvQge.jpeg" alt="" srcset=""> -->
    <!-- <div h-40px w-full class="bg-[#23292c]" flex justify-between items-center> -->

    <!-- <div class=" color-[#fff]">{{ canvasInstance?.scale }}</div>
      <input type="range" max="360" value="0" min="0" step="1" @input="handleDragRange($event as InputEvent)">
      <div btn @click="handleEndCrop">
        确认裁剪
      </div> -->
    <!-- </div> -->
  </div>
</template>

<style scoped>
/* .bar>div:is(.bar-item-btn) {
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
} */
</style>
