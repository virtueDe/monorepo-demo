<template>
  <div w-800px h-500px style="border: 1px solid red;">
    <canvas id="myCanvas" width="600" height="400"></canvas>
    <button @click="current++">demo</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'


let current = 1;
onMounted(() => {

  function flipImage(index) {
    let state = states[index];

    if (state.scaleX === 1) {
      state.scaleX = -1;
    } else {
      state.scaleX = 1;
    }
  }

  function moveImage(index) {
    let from = states[index];
    let to = states[index - 1];

    if (from.x === to.x && from.y === to.y) {
      flipImage(index);
      to = states[index - 1];
    }

    let dx = Math.sign(to.x - from.x) * 5;
    let dy = Math.sign(to.y - from.y) * 5;

    from.x += dx;
    from.y += dy;
  }


  function animate() {
    flipImage(current);
    moveImage(current);

    if (states[current].x === states[current - 1].x && states[current].y === states[current - 1].y) {
      current++;

      if (current >= states.length) {
        current = 1;
      }
    }

    window.requestAnimationFrame(animate);
  }


  let states = [
    { x: 100, y: 100, scaleX: 1, scaleY: 1 },
    { x: 100, y: 100, scaleX: -1, scaleY: 1 },
    { x: 500, y: 100, scaleX: 1, scaleY: 1 },
  ];
  function draw() {
    // 绘制原始元素
    let state = states[0];
    ctx.drawImage(img, state.x, state.y, img.width * state.scaleX, img.height * state.scaleY);

    // 绘制所有副本
    for (let i = 1; i < states.length; i++) {
      let state = states[i];

      // 翻转图片
      ctx.save();
      ctx.translate(state.x + img.width / 2, state.y + img.height / 2);
      ctx.scale(state.scaleX, state.scaleY);
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
      ctx.restore();

      // 移动图片
      moveImage(i);
    }
  }
  // 获取 Canvas 上下文
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  // 定义元素图片
  let img = new Image();
  img.src = "https://via.placeholder.com/600x400";

  // 定义包含所有状态信息的数组

  img.onload = () => {
    console.log(12312);
    draw()
    animate();
  }
})

</script>
