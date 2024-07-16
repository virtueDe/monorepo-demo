<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {

  // canvas操作-修改图片亮度 https://www.cnblogs.com/suyuanli/p/14541067.html#javascript%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81-1
  // canvas渲染网络图片(旋转，灰阶，饱和度操作)并保存到本地 https://blog.csdn.net/qq_35321405/article/details/79786977
  // 用 canvas 2D 实现图片美化 https://juejin.cn/post/6951694989311082504?searchId=2024071514153402ACCCA792C396EF180B  // Canvas 10款基础滤镜（原理篇） https://juejin.cn/post/7119893640264024071
  name: 'adjustment',
  data() {
    // 饱和度
    //     const canvas = document.getElementById('myCanvas');
    // const ctx = canvas.getContext('2d');

    // const img = new Image();
    // img.src = 'path/to/your/image.jpg';
    // img.onload = function() {
    //   canvas.width = img.width;
    //   canvas.height = img.height;

    //   // 绘制原图到canvas
    //   ctx.drawImage(img, 0, 0);

    //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //   const data = imageData.data;

    //   // 遍历每个像素，调整饱和度
    //   for (let i = 0; i < data.length; i += 4) {
    //     const r = data[i];
    //     const g = data[i + 1];
    //     const b = data[i + 2];

    //     // 计算平均灰度值
    //     const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    //     // 调整饱和度，例如降低50%
    //     const saturationFactor = 0.5;
    //     data[i]     = r * saturationFactor + gray * (1 - saturationFactor); // red
    //     data[i + 1] = g * saturationFactor + gray * (1 - saturationFactor); // green
    //     data[i + 2] = b * saturationFactor + gray * (1 - saturationFactor); // blue
    //   }

    //   // 将修改后的像素数据重新绘制到canvas
    //   ctx.putImageData(imageData, 0, 0);
    // };
    return {
      brightness: 1,
      contrast: 1,
      exposure: 0,
      //       brightness: 控制图像的亮度，值为-1到1之间，正数增加亮度，负数降低亮度。
      // contrast: 控制图像的对比度，值为0到任意大，1表示原始对比度，小于1降低对比度，大于1增加对比度。
      // exposure: 控制图像的曝光度，值为-255到255，正值增加曝光，负值减少曝光。
      // 调整参数
      // 亮度 (brightness): 修改brightness的值。例如，将其设为0.2会增加亮度，设为-0.2会降低亮度。
      // 对比度 (contrast): 修改contrast的值。例如，将其设为1.5会增加对比度，设为0.5会降低对比度。
      // 曝光度 (exposure): 修改exposure的值。例如，将其设为50会增加曝光，设为-50会减少曝光。
    };
  },
  mounted() {
    this.canvasInstance = this.$refs.canvas;
    this.loadImage();
  },
  methods: {
    loadImage() {
      const img = new Image();
      img.src = 'https://picsum.photos/id/237/300/300';
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.adjustImage(img);
      };
    },
    adjustImage(image) {
      const canvas = this.canvasInstance;
      const ctx = canvas.getContext('2d');

      // Set the canvas size to match the image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // 亮度
        r = Math.min(r * (1 + this.brightness), 255);
        g = Math.min(g * (1 + this.brightness), 255);
        b = Math.min(b * (1 + this.brightness), 255);

        // 对比度
        // const avg = (r + g + b) / 3;
        // r = Math.min(Math.max(((r - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);
        // g = Math.min(Math.max(((g - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);
        // b = Math.min(Math.max(((b - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);

        // 曝光
        // r = Math.min(r + this.exposure, 255);
        // g = Math.min(g + this.exposure, 255);
        // b = Math.min(b + this.exposure, 255);

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      // Put the modified image data back into the canvas
      ctx.putImageData(imageData, 0, 0);
    }
  }
};
</script>
