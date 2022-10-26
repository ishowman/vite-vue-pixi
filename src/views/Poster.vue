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
  }" id="html2canvas">
     <img src="poster/jin.png" :style="{
      position: 'absolute',
      left: sc.w * 0.1411 + 'px',
      top: sc.h * 0.09 + 'px',
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
        top: (parseInt(sc.w) / 869) * 1543 * 0.08 + 'px'
     }">
    <img src="poster/get-poster-text.png" :style="{
      position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.32 + 'px',
        width: sc.w * 0.32 + 'px',
        height: sc.h * 0.038 + 'px'
    }">
    <img src="poster/squre.png" :style="{
        width: sc.w * 0.58 + 'px',
        height: sc.h * 0.089 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 'px',
        position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
    }"/>
    <img src="poster/footer-logo.png" :style="{
        position:'absolute',
        left: sc.w * 0.0538 + 'px',
        bottom: '10px',
        margin: 'auto',
        width:  '82.5px',
        height: '104px',
      }">
      <img src="poster/scan.png" :style="{
        position: 'absolute',
        margin: 'auto',
        left: 0,
        right: 0,
        bottom:  '20px',
        width: sc.w * 0.35 + 'px',
        height: sc.h * 0.0316 + 'px'
      }">
      <!-- 图标 金银铜 -->
      <img src="poster/jin.png" :style="{
        width: sc.w * 0.1486 + 'px',
        height: sc.w * 0.1486 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 4+ 'px',
        position:'absolute',
        left: sc.w * 0.25 + 'px',
        margin: 'auto',
      }">
      <div :style="{
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 24+ 'px',
        position:'absolute',
        left: sc.w * 0.425 + 'px',
        margin: 'auto',
        fontWeight: 500,
        fontSize: '30.34px',
        color: '#FFFFFF' ,
      }">金牌奖品</div>
      <img src="poster/qrcode.png" :style="{
        width: sc.w * 0.18 + 'px',
        height: sc.w * 0.18 + 'px',
        position:'absolute',
        right: sc.w * 0.059 + 'px',
        bottom:  '20px'
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
