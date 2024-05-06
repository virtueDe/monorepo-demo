<script setup lang="ts" generic="T extends any, O extends any">
import { sum } from "@v50/edit-utils";

console.log(sum(1, 2));


defineOptions({
  name: 'IndexPage',
})


onMounted(() => {
  console.log('mounted');
})
// const name = ref('')

// const router = useRouter()
// function go() {
//   if (name.value)
//     router.push(`/hi/${encodeURIComponent(name.value)}`)
// }
</script>

<template>
  <div>
    123123
    <!-- <TheInput v-model="name" placeholder="What's your name?" autocomplete="false" @keydown.enter="go" /> -->

    <!-- <div>
      <button class="m-3 text-sm btn" :disabled="!name" @click="go">
        Go
      </button>
    </div> -->
  </div>
</template>
