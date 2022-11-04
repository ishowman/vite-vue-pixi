<!--
 * @Author: corinchen
 * @Date: 2022-10-26 14:27:25
 * @LastEditTime: 2022-10-26 22:48:26
 * @LastEditors: corinchen
 * @Description: 
 * @FilePath: \vite-vue-pixi\src\views\Home.vue
 * for  good code
-->
<template>
  <div class="full-page" id="home">
    <img :src="playBtn" alt="开始游戏" class="play-btn" @click="play()" />

    <img :src="prizeBtn" alt="奖品" class="prize-btn" @click="toPrize()" />
    <img :src="ruleBtn" alt="规则" class="rule-btn" @click="toRule()" />
    <!-- input 框 -->
    <div v-if="modelShow">
      <img class="input-name-bg" :src="inputNameBg" />

      <div class="input-name-title">请填写你的姓名</div>
      <input type="text" class="input-name-input" />
      <img
        :src="submit"
        class="input-submit"
        @click="sound.play(),router.replace({ name: 'Game' })"
      />
      <div class="mask" v-if="modelShow"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Howl } from "howler";
import playBgm from "@/assets/audios/play.mp3";
import bgm from "@/assets/audios/bgm.mp3";
import { ref } from "vue";

import playBtn from "@/assets/index/play-btn.png";
import prizeBtn from "@/assets/index/prize-btn.png";
import ruleBtn from "@/assets/index/rule-btn.png";
import inputNameBg from "@/assets/index/input-name-bg.png";
import input from "@/assets/index.input.png";
import submit from "@/assets/index/submit.png";
const router = useRouter();
let modelShow = ref(false);
const sound = new Howl({
  src: playBgm,
});
const bgmMusic = new Howl({
  src: bgm,
  volume: 0.5,
  loop: true,
});
function play() {
  sound.play();
  bgmMusic.play();
  // router.replace({ name: 'Game' });
  modelShow.value = true;
}

function toPrize() {
  router.push({
    name: "Prize",
    query: { random: new Date().getMilliseconds() },
  });
  sound.play();
}
function toRule() {
  router.replace({ name: "Rule" });
  sound.play();
}
</script>
<style scoped>
#home {
  background-image: url("@/assets/index/bg.png");
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

.input-name-bg {
  height: 19.43%;
  position: absolute;
  top: 38.47%;
  left: 0;
  right: 0;
  margin: auto;
  object-fit: cover;
  z-index: 9;
}
.input-name-title {
  position: absolute;
  top: 42.89%;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 15px;
  text-align: center;
  color: #d6b266;
  font-weight: bold;
  z-index: 9;
}
.input-submit {
  position: absolute;
  top: 62%;
  left: 0;
  right: 0;
  margin: auto;
  width: 46.58%;
  object-fit: cover;
  z-index: 9;
}
.input-name-input {
  padding-left: 10px;
  width: 41%;
  height: 36px;
  position: absolute;
  left: 0;
  right: 0;
  top: 48%;
  margin: auto;
  background: url("@/assets/index/input.png") no-repeat;
  background-size: 100%;
  border: none;
  z-index: 9;
}
input:focus {
  border: none;
}
input {
  background: none;
  outline: none;
  border: none;
}
.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
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
