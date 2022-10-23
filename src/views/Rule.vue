<template>
  <div class="full-page" id="rule">
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

      <ul class="rule-text scroll-view" style="padding-left: 20px">
        <li>
          手指按住球员左右滑屏，操纵球 员奔跑在球场中，一边避开各种
          障碍，一边收集金币。
        </li>
        <li>每次游戏有三次生命</li>

        <li>
          收集到：
          <p>+5 分</p>
          <p>+20 分</p>
        </li>
        <li>
          撞击到：
          <p>减一次生命</p>
          <p>减一次生命</p>
        </li>

        <li>600分以上可获得“金牌”奖品</li>
        <li>300~600分可获得“银牌”奖品</li>
        <li>300以下可获得“铜牌”奖品</li>

        <li>本次活动由比华利保罗举办，活动最终解释权归比华利保罗所有。</li>
      </ul>
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
#rule {
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
.rule-text {
  position: absolute;
  top: 60px;
  bottom: 64px;
  left: 16px;
  right: 16px;
  color: #fff;
  line-height: 1.2;
  word-wrap: break-word;
  font-size: 18px;
  overflow: auto;

  padding: 0 4px;
}
.rule-text li {
  margin-bottom: 12px;
  list-style: circle;
}
</style>
