<template>
  <!-- 这里其实就是实现一个zIndex 最大 同-->
  <div :style="{
    position: 'absolute',
    overflowX: 'hidden',
    width: sc.w + 'px',
    height: sc.h +'px'
  }">
  <div :style="{
    position: 'absolute',
    left: 0, 
    right:0,
    width: sc.w + 'px',
    height: sc.h+ 'px',
  }">
     <img src="poster/jin.png" :style="{
      position: 'absolute',
      left: sc.w * 0.1411 + 'px',
      top: sc.h * 0.17 + 'px',
      width: sc.w * 0.2521 + 'px',
      height: sc.h * 0.1688 + 'px',
      zIndex: 8
     }">
     <img src="poster/bg.png" :style="{
      position: 'absolute',
      left: 0,
      right: 0,
      width: sc.w+ 'px',
      height: sc.h+ 'px',
     }">
     <img src="poster/poster.png" :style="{
        width: parseInt(sc.w) * 0.82  + 'px',
        height: (parseInt(sc.w) / 869) * 1543 + 'px',
        position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        top: (parseInt(sc.w) / 869) * 1543 * 0.14 + 'px'
     }">
    <img src="poster/get-poster-text.png" :style="{
      position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.28 + 'px',
        width: sc.w * 0.32 + 'px',
        height: sc.h * 0.038 + 'px'
    }">
    <img src="poster/squre.png" :style="{
        width: sc.w * 0.58 + 'px',
        height: sc.h * 0.089 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.16 + 'px',
        position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
    }"/>
      <!-- 图标 金银铜 -->
      <img src="poster/jin.png" :style="{
        width: sc.w * 0.166 + 'px',
        height: sc.w * 0.166 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.16 + 4+ 'px',
        position:'absolute',
        left: sc.w * 0.25 + 'px',
        margin: 'auto',
      }">
      <div :style="{
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.16 + 24+ 'px',
        position:'absolute',
        left: sc.w * 0.425 + 'px',
        margin: 'auto',
        fontWeight: 500,
        fontSize: '30.34px',
        color: '#FFFFFF' ,
      }">金牌奖品</div>
    <img src="poster/btn-award.png" :style="{
      position:'absolute',
      bottom: (parseInt(sc.w) / 869) * 1543 * 0.06 + 'px',
      width: sc.w * 0.3829 + 'px',
      height: sc.h *0.0731 + 'px',
      left: sc.w*0.11 +'px',

    }">
    <img src="poster/btn-share.png" :style="{
      position:'absolute',
      bottom: (parseInt(sc.w) / 869) * 1543 * 0.06 + 'px',
      right: sc.w*0.11 +'px',
      width: sc.w * 0.3829 + 'px',
      height: sc.h *0.0731 + 'px'
    }">
  </div>
  </div>
  
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const poster = ref('');
const router = useRouter();

const sc = ref({
  w: window.innerWidth,
  h: window.innerHeight
})
// console.log(sc.value.w, sc.value.h)
onMounted(() => {  
})
</script>
