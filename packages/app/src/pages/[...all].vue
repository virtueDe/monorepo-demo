<template>
  <div w-800px h-500px style="border: 1px solid red;" id="container">

  </div>
  <div>
    <button @click="edit?.crop()">crop</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { PhotoEdit } from "./photoEdit/index";

const edit = ref<PhotoEdit | null>(null)

onMounted(() => {
  edit.value = new PhotoEdit(document.getElementById("container") as HTMLElement, {
    src: "https://picsum.photos/id/237/200/300",
  })
})

</script>
