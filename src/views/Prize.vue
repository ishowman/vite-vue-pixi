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

      <div class="scroll-view prize-list" v-if="!hidePrizes">
        <template v-if="hasGold || hasSilver || hasCu">
          <game-prize class="mb-12" v-if="hasGold">
          <template #pic>
            <img src="public/myAward/prize-gold.png" style="width: 100%;">
          </template>
          <p class="text-ellipsis">金牌奖品</p>
          <!-- <button @click="hidePrizes = true">兑换</button> -->
          <img src="public/myAward/btn-get.png" @click="getPrize('gold')" style="width:50px;"/>
        </game-prize>
        <game-prize class="mb-12" v-if="hasSilver">
          <template #pic>
            <img src="public/myAward/prize-silver.png" style="width: 100%;">
          </template>

          <p class="text-ellipsis">银牌奖品</p>
          <img src="public/myAward/btn-get.png" @click="getPrize('silver')"  style="width:50px;"/>
        </game-prize>

        <game-prize class="mb-12" v-if="hasCu">
          <template #pic>
            <img src="public/myAward/prize-cu.png" style="width: 100%;">
          </template>

          <p class="text-ellipsis">铜牌奖品</p>
          <img src="public/myAward/btn-get.png"  style="width:50px;" @click="getPrize('cu')" />
        </game-prize>

        </template>
        <div
        class="flex align-center "
        style=" color: #d8ae5b; margin-top: 16%"
        v-else
      >
        <p class="text-center w-full"  style="line-height: 1.25;" >
          您还未获得奖品
          <p>
            快去参与游戏获取奖品吧~
          </p>
        </p>

      </div>

      </div>
      <div
        class="prize-list flex align-center "
        style=" color: #d8ae5b; top: 16%"
        v-else
      >
        <p class="text-center w-full"  style="line-height: 1.2;font-size: 32px;">
          恭喜
          <p>
            领取成功!
          </p>
        </p>


      </div>
      <p
        class="text-sm"
        style="
          position: absolute;
          top: 80%;
          left: 30px;
          right: 30px;
          color: #fff;
          line-height: 1.25;
        "
      >
        注：“兑换”按钮请交由线下门店营业员进行点击兑换，
        具体请前往比华利保罗线下门店进行咨询
      </p>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { Howl } from 'howler';
import GamePrize from '@/components/GamePrize.vue';
import { ref } from 'vue';
import playBgm from '@/assets/audios/play.mp3';
const sound = new Howl({
  src: playBgm,
});

const router = useRouter();
const hidePrizes = ref(false);

const hasGold = ref(false);
const hasSilver = ref(false);
const hasCu = ref(false);
hasGold.value = localStorage.getItem('keyValue') === 'gold';
hasSilver.value = localStorage.getItem('silver') === 'silver';
hasCu.value = +localStorage.getItem('cu') === 'cu';

function toHome() {
  router.replace({ name: 'Home' });
  sound.play()
}

function getPrize(key) {
  sound.play()
  hidePrizes.value = true;
  if(key === 'gold') {
    hasGold.value = false;

  }
  else if(key === 'silver') {
    hasSilver.value = false;

  }

  else if(key === 'cu') {
    hasCu.value = false;

  }
  localStorage.setItem(key, 0);

}
</script>
<style scoped>
#prize {
  background-image: url('public/rules/bg.jpg');
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
  top: 20%;
  bottom: 24%;
  left: 20px;
  right: 20px;
  overflow: auto;
}
</style>
