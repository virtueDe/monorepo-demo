<script setup lang="ts" generic="T extends any, O extends any">
import { sum } from "@v50/edit-utils";
import type { ComponentPublicInstance } from 'vue';
type refItem = Element | ComponentPublicInstance | null

console.log(sum(1, 2));


defineOptions({
  name: 'IndexPage',
})

/**
 * @description: Bar
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

// const name = ref('')

// const router = useRouter()
// function go() {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }
</script>

<template>
  <div w-full h-full flex flex-col>
    <div h-50px w-full class="bg-[#1A212B] color-[#fff]" flex justify-between items-center>
      <div flex h-full items-center>
        <div rel="noreferrer" href="javascript:0" h-full w-50px flex justify-center items-center class="bg-[#2D333C]">
          <div class="i-carbon-image-copy" font-size="25px"></div>
        </div>
        <div pl-3 max-w-120px truncate>当前图片文件名字+icon</div>
      </div>
      <div flex font-size="22px" class="bar" pos-relative>
        <div :class="[item.icon, 'bar-item-btn']" :title="item.title" :ref="setBarItemRefs"
          v-for="(item, idx) in barOption" :key="idx" @click="handleChangeIndex(idx)"></div>
        <div class="active-line" ref="activeLine" pos-absolute w-18px h-5px left-0
          :style="{ left: activeTranslateLeft + 'px' }"></div>
      </div>
      <div class="right" p-r-3>
        <div btn> 保存</div>
      </div>
    </div>
    <div flex-auto>
      <canvas id="canvas"></canvas>
    </div>
    <div h-60px w-full class="bg-[#23292c]"></div>
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
