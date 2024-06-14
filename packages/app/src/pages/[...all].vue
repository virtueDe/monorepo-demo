<template>
  <div style="border: 1px solid red;">
    <canvas ref="canvas" @wheel="onWheel" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let isMouseDown = false
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let imageX = 100
let imageY = 100
let imageWidth = 100
let imageHeight = 100
let scale = 1

onMounted(() => {
  if (canvas.value) {
    drawImage()
  }
})

function drawImage() {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')!
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.save()
    ctx.translate(imageX, imageY)
    ctx.scale(scale, scale)
    ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight)
    ctx.restore()
  }
}

function onWheel(event: WheelEvent) {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const delta = event.deltaY * -0.01
    scale = Math.max(0.5, Math.min(5, scale + delta))
    imageX = x - (x - imageX) * scale
    imageY = y - (y - imageY) * scale
    drawImage()
  }
}

function onMouseDown(event: MouseEvent) {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    if (x >= imageX - imageWidth / 2 && x <= imageX + imageWidth / 2 && y >= imageY - imageHeight / 2 && y <= imageY + imageHeight / 2) {
      isMouseDown = true
      dragStartX = x - imageX
      dragStartY = y - imageY
    }
  }
}

function onMouseMove(event: MouseEvent) {
  if (canvas.value && isMouseDown) {
    const rect = canvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    imageX = x - dragStartX
    imageY = y - dragStartY
    drawImage()
  }
}

function onMouseUp() {
  isMouseDown = false
  isDragging = false
}

const image = new Image()
image.src = 'https://via.placeholder.com/100x100'
image.onload = () => {
  drawImage()
}
</script>
