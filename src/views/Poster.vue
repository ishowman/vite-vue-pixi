<template>
  <!-- 点击分享-->
  <div
    :style="{
      position: 'absolute',
      overflowX: 'hidden',
      width: sc.w + 'px',
      height: sc.h + 'px',
    }"
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
        src="/poster/jin.png"
        :style="{
          position: 'absolute',
          left: sc.w * 0.1145 + 'px',
          top: sc.h * 0.16 + 'px',
          width: sc.w * 0.2521 + 'px',
          height: sc.h * 0.1688 + 'px',
          zIndex: 8,
        }"
      />
      <img
        src="/poster/bg.png"
        :style="{
          position: 'absolute',
          left: 0,
          right: 0,
          width: sc.w + 'px',
          height: sc.h + 'px',
        }"
      />
      <img
        src="/poster/poster.png"
        :style="{
          width: parseInt(sc.w) * 0.8871 + 'px',
          height: sc.h * 0.7876 + 'px',
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          top: sc.h * 0.1483+ 'px',
        }"
      />
      <img
        src="/poster/get-poster-text.png"
        :style="{
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          bottom: sc.h * 0.2564 + 'px',
          width: sc.w * 0.32 + 'px',
          height: sc.h * 0.038 + 'px',
          zIndex: 9
        }"
      />
    
      <div :style="{
          bottom: sc.h * 0.1417+ 'px',
          position: 'absolute',
          width: sc.w * 0.6385 + 'px',
          height: sc.h * 0.0889 + 'px',
          left: 0,
          right: 0,
          margin: 'auto',
          background:'url(/poster/squre.png) no-repeat',
          backgroundSize: `${sc.w * 0.6385 + 'px'} ${sc.h * 0.0889 + 'px'}`,
          display: 'flex',
          alignItems: 'center'
      }">
        <img
        src="/poster/jin.png"
        :style="{
          width: sc.w * 0.1486 + 'px',
          height: sc.h * 0.0745 + 'px',
          marginLeft: '16px'

        }"
      />
      <!-- todo 这里也是 -->
      <div
        :style="{
          fontWeight: 500,
          fontSize: '30.34px',
          color: '#FFFFFF',
          marginLeft: '24px'
        }"
      >
        金牌奖品
      </div>
      </div>
      <!-- todo 图标 金银铜 此处需要变量改变显示的金银 -->
      
        <img
        src="/poster/btn-award.png"
        :style="{
          position: 'absolute',
          bottom: (parseInt(sc.w) / 869) * 1543 * 0.06 + 'px',
          width: sc.w * 0.3829 + 'px',
          height: sc.h * 0.0731 + 'px',
          left: sc.w * 0.11 + 'px',
        }"
      />
      <img
        src="/poster/btn-share.png"
        :style="{
          position: 'absolute',
          bottom: '5.43%',
          right: sc.w * 0.1248 + 'px',
          width: sc.w * 0.3829 + 'px',
          height: sc.h * 0.0731 + 'px',
        }"
        @click="modalShare = true"
      />
    </div>
  </div>
   <div
      v-if="modalShare"
      @click="modalShare = false"
      :style="{
        width: sc.w + 'px',
        height: sc.h + 'px',
        background: 'rgba(0,0,0, 0.77)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 9,
      }"
    >
      <img
        src="/poster/share-bg.png"
        :style="{
          width: sc.w * 0.67 + 'px',
          height: sc.h * 0.3333 + 'px',
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
          top: sc.h * 0.0756 + 'px',
          zIndex: 10,
        }"
      />
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
      zIndex: 9,
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
      <img
        src="/poster/poaster.png"
        :style="{
          width: sc.w * 0.5811 + 'px',
          height: sc.h * 0.5805 + 'px',
          zIndex: 10,
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
        }"
      />
      <!-- 这里是变量 金 银 铜 -->
      <img
        src="/poster/金.jpg"
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
          height: sc.h * 0.0508 + 'px'
      }">
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const poster = ref("");
const router = useRouter();
const modalStatus = ref(true);
const modalShare = ref(false);
const sc = ref({
  w: window.innerWidth,
  h: window.innerHeight,
});
// console.log(sc.value.w, sc.value.h)

onMounted(() => {
  modalStatus.value = true;
});
</script>
