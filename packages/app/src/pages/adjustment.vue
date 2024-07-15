<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {

  // canvas操作-修改图片亮度 https://www.cnblogs.com/suyuanli/p/14541067.html#javascript%E5%AE%9E%E7%8E%B0%E4%BB%A3%E7%A0%81-1
  // canvas渲染网络图片(旋转，灰阶，饱和度操作)并保存到本地 https://blog.csdn.net/qq_35321405/article/details/79786977
  // 神奇canvas 带你实现魔法摄像头 https://juejin.cn/post/7264125562393788473?searchId=2024071514153402ACCCA792C396EF180B
  // 用 canvas 2D 实现图片美化 https://juejin.cn/post/6951694989311082504?searchId=2024071514153402ACCCA792C396EF180B
  // html5 canvas系列教程 - 像素操作(反色,黑白,亮度,复古,蒙版,透明)  https://www.cnblogs.com/ghostwu/p/7606009.html
  // js操作像素实现图片编辑 https://juejin.cn/post/7045935743037866020
  name: 'adjustment',
  data() {
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

        // Adjust brightness
        r = Math.min(r * (1 + this.brightness), 255);
        g = Math.min(g * (1 + this.brightness), 255);
        b = Math.min(b * (1 + this.brightness), 255);

        // // Adjust contrast
        // const avg = (r + g + b) / 3;
        // r = Math.min(Math.max(((r - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);
        // g = Math.min(Math.max(((g - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);
        // b = Math.min(Math.max(((b - avg) * this.contrast) + avg + 128 * (this.contrast - 1), 0), 255);

        // // Adjust exposure
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
