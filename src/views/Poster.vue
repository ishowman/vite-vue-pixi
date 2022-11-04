<template>
  <!-- 点击分享-->
  <div>
<div
    :style="{
      position: 'absolute',
      overflowX: 'hidden',
      width: sc.w + 'px',
      height: sc.h + 'px',
    }"
    v-if="KEY"
  >
    <div
      :style="{
        position: 'absolute',
        left: 0,
        right: 0,
        width: sc.w + 'px',
        height: sc.h + 'px',
      }"
    >
    <!-- todo 这里也是 -->
      <img
        src="/poster/bg-nologo.jpg"
        :style="{
          position: 'absolute',
          left: 0,
          right: 0,
          width: sc.w + 'px',
          height: sc.h + 'px',
        }"
      />
      <img
        :src="JJ_MAP[KEY].bg"
        :style="{
          width: parseInt(sc.w) * 0.8871 + 'px',
          height: sc.h * 0.7876 + 'px',
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          top: sc.h * 0.1483 - 30 + 'px',
        }"
      />
    
      <!-- todo 图标 金银铜 此处需要变量改变显示的金银 -->
        <img
        src="/poster/btn-award.png"
        :style="{
          position: 'absolute',
          bottom: 'calc(5.43% + 30px)',
          width: sc.w * 0.3829 + 'px',
          height: sc.h * 0.0731 + 'px',
          left: sc.w * 0.11 + 'px',
        }"
        @click="router.push({name: 'Prize', query: { random: new Date().getTime()}})"
      />
      <img
        src="/poster/btn-share.png"
        :style="{
          position: 'absolute',
          bottom: 'calc(5.43% + 30px)',
          right: sc.w * 0.1248 + 'px',
          width: sc.w * 0.3829 + 'px',
          height: sc.h * 0.0731 + 'px',
          zIndex: 9
        }"
        @click="modalStatus = true"
      />
    </div>
  </div>

  <div
    v-if="modalStatus"
    :style="{
      width: sc.w + 'px',
      height: sc.h + 'px',
      background: 'rgba(0,0,0, 0.77)',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 99999,
    }"
    @click="modalStatus = false"
  >
    <!-- 一张图 -->
    <div
      :style="{
        position: 'absolute',
        left: 0,
        right: 0,
        margin: auto,
        width: sc.w + 'px',
        height: sc.h +'px',
        top: sc.h * 0.14 + 'px',
      }"
    >
      <!-- 这里是变量 金 银 铜 -->
      <img
        :src="JJ_MAP[KEY].poster"
        alt=""
        :style="{
          width: sc.w * 0.57 + 'px',
          height: sc.h * 0.576 + 'px',
          zIndex: 10,
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          borderRadius: '32px',
          zIndex: 11,
          top: '2px',
        }"
      />
       <img src="/poster/save-long-img.png" :style="{
         position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          width: sc.w * 0.394 + 'px',
          height: sc.h * 0.0192 + 'px',
          top: sc.h * 0.575 + 28 + 'px',
          zIndex: 999
      }">
      <img src="/poster/x.png" @click="modalStatus = false" :style="{
        position: 'absolute',
        left: 0,
          right: 0,
          margin: 'auto',
          top: sc.h * 0.575 + 60 + 'px',
          zIndex: 999,
          width: sc.w*0.1017 + 'px',
          height: sc.h * 0.0508 + 'px',
          zIndex: 999
      }">
    </div>

  </div>
  </div>
  
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
const poster = ref("");
const router = useRouter();
const modalStatus = ref(true);

const sc = ref({
  w: window.innerWidth,
  h: window.innerHeight,
});
const KEY = ref('silver')
const JJ_MAP = ref({
  'gold': {
    name: '金牌奖品',
    bg: '/poster/金.png',
    img: '/poster/jin.png',
    poster: '/poster/金.jpg'

  },
  'silver': {
    name: '银牌奖品',
    bg: '/poster/银.png',
    img: '/poster/yin.png',
    poster: '/poster/银.jpg'

  },
  'cu': {
    name: '铜牌奖品',
    bg: '/poster/铜.png',
    img: '/poster/tong.png',
    poster: '/poster/铜.jpg'
  },
  'empty': {
    name: '暂无奖品',
    // bg: 
  }
})
watch(()=> router.currentRoute.value.path, ()=>{
    modalStatus.value = true;
    console.log(router.currentRoute._value.query.score)
    let score = router.currentRoute._value.query.score
     if (score >= 3600) {
      KEY.value = 'gold'
    } else if (score >= 1800 && score < 3600) {
      KEY.value = 'silver'
    } else {
      KEY.value = 'cu'
    }
},{immediate: true})
onMounted(() => {

  // KEY.value = window.localStorage.getItem('keyValue') || 'cu'
});
</script>
