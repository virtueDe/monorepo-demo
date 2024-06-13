<template>
  <div>
    state {{ currentTime }}
  </div>
</template>
<script lang='ts' setup>
import { ref, watch } from 'vue'

class View {
  private _time = 0;
  constructor() {
    this.setTime()
  }
  private setTime() {
    setInterval(() => {
      this._time = new Date().getTime()
      console.log(this.time);
    }, 2000)
  }
  get time() {
    return this._time;
  }
}

const state = ref<number | View>(0)
state.value = new View()

const currentTime = ref(state.value.time);
console.log(currentTime.value);


// const currentTime = computed(() => state.value.time);
watch(currentTime, (newValue, oldValue) => {
  console.log(123, newValue, oldValue);
});
// setInterval(() => {
//   console.log(1111111111, state.value.time);
// }, 2000)

// watch(() => state, (newValue, oldValue) => {
//   console.log(123, newValue, oldValue);
// })
</script>
