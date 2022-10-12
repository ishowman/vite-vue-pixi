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
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.play-btn {
  position: absolute;
  bottom: 15%;
  left: 9%;
  right: 9%;
  width: 82%;
  animation-name: scaleAnimation;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  transition-timing-function: ease-in-out;
}
@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.08);
  }

  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.08);
  }
}
</style>
