<template>
  <div class="full-page" id="prize">
    <div class="square">
      <img src="public/rules/star3.png" class="star3" style="width: 40%" />
      <img src="public/rules/title.png" class="title" style="width: 100%" />

      <img src="public/rules/square.png" alt="" style="width: 100%" />
      <img
        src="public/rules/btn-back.png"
        alt=""
        class="btn-back"
        @click="toHome"
      />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
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
</style>
