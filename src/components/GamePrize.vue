<script setup>
import { ref } from 'vue';

defineProps({
  msg: String,
});
</script>

<template>
  <div class="game-prize grid align-center">
    <div class="prize-img"></div>
    <slot>
      <p>xxxxx</p>
      <button>兑换</button>
    </slot>
  </div>
</template>

<style scoped>
.prize-img {
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.game-prize {
  grid-template-columns: 50px 1fr auto;
  padding: 8px;
  gap: 8px;
  background-color: #d7ae5a;
  border-radius: 38px;

  color: #fff;
  font-size: 20px;
}
</style>
