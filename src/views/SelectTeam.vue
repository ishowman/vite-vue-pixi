<template>
  <div class="full-page" id="teams">
    <div class="square">
      <img
        src="public/team/choose-team.png"
        class="title"
        style="width: 100%"
      />

      <img src="public/rules/square.png" alt="" style="width: 100%" />
      <img
        src="public/team/btn-play.png"
        alt=""
        class="btn-play"
        @click="toGame"
      />

      <div class="text-title w-full" style="color: #d7ae5a">
        <p class="text-center">请点击选择你</p>
        <p class="text-center">支持的队伍</p>
      </div>

      <div style="margin: 0 auto" class="grid team-list">
        <img
          :src="selected === 0 ? '/team/choose-blue.png': '/team/blue.png'"
          alt="蓝队"
          class="team-role"
          @click="selected = 0"
        />
        <img
          :src="selected === 1 ? '/team/choose-white.png': '/team/white.png'"
          alt="白队"
          class="team-role"
          @click="selected = 1"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const selected = ref(2);

function toGame() {
  router.replace({ name: 'Game' });
}
</script>
<style scoped>
#teams {
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
.btn-play {
  position: absolute;
  top: 90.5%;
  left: 30%;
  width: 40%;
}
.title {
  position: absolute;
  top: -14%;
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
  font-size: 20px;
  overflow: auto;

  padding: 0 4px;
}
.team-list {
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 0 10%;
  position: absolute;
  top: 40%;
}

.team-role {
  width: 100%;
}

.text-title {
  color: #fff;
  position: absolute;
  top: 18%;
  font-size: 28px;
  line-height: 1.25;
}

</style>
