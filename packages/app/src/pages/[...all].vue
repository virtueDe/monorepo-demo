<template>
  <canvas ref="canvas" width="600" height="400"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let isDrawing = false
let startX = 0
let startY = 0
let currentX = 0
let currentY = 0

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')!
    canvas.value.addEventListener('mousedown', handleMouseDown)
    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('mouseup', handleMouseUp)
    canvas.value.addEventListener('mouseleave', handleMouseLeave)

    // 在 canvas 上绘制一张示例图片
    const img = new Image()
    img.src = 'https://via.placeholder.com/600x400'
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      drawCropBox(0, 0, 0, 0)
    }
  }
})

function handleMouseDown(event: MouseEvent) {
  isDrawing = true
  startX = event.offsetX
  startY = event.offsetY
}

function handleMouseMove(event: MouseEvent) {
  if (isDrawing) {
    currentX = event.offsetX
    currentY = event.offsetY
    drawCropBox(startX, startY, currentX - startX, currentY - startY)
  }
}

function handleMouseUp(event: MouseEvent) {
  isDrawing = false
  currentX = event.offsetX
  currentY = event.offsetY
  drawCropBox(startX, startY, currentX - startX, currentY - startY)
}

function handleMouseLeave(event: MouseEvent) {
  isDrawing = false
}

function drawCropBox(x: number, y: number, width: number, height: number) {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')!
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 绘制背景遮罩
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, canvas.value.width, canvas.value.height)
    ctx.clip()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.restore()

    // 绘制裁剪框
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, width, height)

    // 绘制参考线
    ctx.beginPath()
    ctx.moveTo(x, y + height / 3)
    ctx.lineTo(x + width, y + height / 3)
    ctx.moveTo(x, y + (height * 2) / 3)
    ctx.lineTo(x + width, y + (height * 2) / 3)
    ctx.moveTo(x + width / 3, y)
    ctx.lineTo(x + width / 3, y + height)
    ctx.moveTo(x + (width * 2) / 3, y)
    ctx.lineTo(x + (width * 2) / 3, y + height)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.stroke()
  }
}
</script>
