<template>
  <div class="full-page" id="home">
    <img :src="playBtn" alt="开始游戏" class="play-btn" @click="play()" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import playBtn from '@/assets/index/play-btn.png';

const router = useRouter();

function play() {
  router.push({ name: 'Game' });
}
</script>
<style scoped>
#home {
  background-image: url('@/assets/index/bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}
.play-btn {
  position: absolute;
  bottom: 15%;
  left: 9%;
  right: 9%;
  width: 82%;
}
</style>
