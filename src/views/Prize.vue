<template>
  <div class="full-page" id="prize">
    <div class="square">
      <img src="public/rules/star3.png" class="star3" style="width: 40%" />
      <img src="public/myAward/title.png" class="title" style="width: 100%" />

      <img src="public/rules/square.png" alt="" style="width: 100%" />
      <img
        src="public/rules/btn-back.png"
        alt=""
        class="btn-back"
        @click="toHome"
      />

      <div class="scroll-view prize-list">
        <game-prize class="mb-8" />
        <game-prize class="mb-8">
          <p class="text-ellipsis">4092384023840240923840238402</p>
        </game-prize>
      </div>
      <p class="text-sm">
        注：“兑换”按钮请交由线下门店营业员进行点击兑换，
        具体请前往比华利保罗线下门店进行咨询
      </p>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import GamePrize from '@/components/GamePrize.vue';

const router = useRouter();

function toHome() {
  router.replace({ name: 'Home' });
}
</script>
<style scoped>
#prize {
  background-image: url('public/rules/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.square {
  position: absolute;
  top: 19%;
  left: 7%;
  right: 7%;
  width: 86%;
}
.btn-back {
  position: absolute;
  top: 90.5%;
  left: 30%;
  width: 40%;
}
.star3 {
  position: absolute;
  top: -14%;
  left: 30%;
}
.title {
  position: absolute;
  top: -8%;
  left: 0%;
}

.prize-list {
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 20px;
  right: 20px;
  overflow: auto;
}
</style>
