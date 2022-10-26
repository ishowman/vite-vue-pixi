<template>
  <div class="full-page" id="home">
    <img :src="playBtn" alt="开始游戏" class="play-btn" @click="play()" />

    <img :src="prizeBtn" alt="奖品" class="prize-btn" @click="toPrize()" />
    <img :src="ruleBtn" alt="规则" class="rule-btn" @click="toRule()" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { Howl } from 'howler';
import playBgm from '@/assets/audios/play.mp3';
import bgm from '@/assets/audios/bgm.mp3';


import playBtn from '@/assets/index/play-btn.png';
import prizeBtn from '@/assets/index/prize-btn.png';
import ruleBtn from '@/assets/index/rule-btn.png';

const router = useRouter();
const sound = new Howl({
  src: playBgm,
});
const bgmMusic = new Howl({
  src: bgm,
  volume: 0.5,
  loop: true
});
function play() {
  sound.play();
  bgmMusic.play()
  router.replace({ name: 'Game' });
}

function toPrize() {
  router.replace({ name: 'Prize' });
  sound.play();

}
function toRule() {
  router.replace({ name: 'Rule' });
  sound.play();

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

.prize-btn,
.rule-btn {
  position: absolute;
  bottom: 5%;
  width: 14.7%;
}
.prize-btn {
  left: 33.5%;
}
.rule-btn {
  left: 53.5%;
}
</style>
