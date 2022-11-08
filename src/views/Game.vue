<template>
  <div ref="game"></div>
  <div class="countdown-mask" v-if="showCountdown">
    <div class="countdown-pic"></div>
    <img src="/tips/arrow.png" :style="tipsArrowStyle" />
    <img src="/tips/text.png" :style="tipsTextStyle" />
  </div>
  <div
    class="loading-mask flex align-center justify-center"
    v-if="showLoadingMask"
  >
    <div class="loading">
      <div class="loading-horse"></div>
      <p class="text-center">
        LOADING
        <span class="percent">{{ percent }}%</span>
      </p>
    </div>
  </div>
  <div class="select-team" id="teams" v-if="showTeams">
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
          v-if="selected === 0"
          src="public/team/choose-blue.png"
          alt="蓝队"
          class="team-role"
          @click="selected = 0"
        />
        <img
          v-else
          src="public/team/blue.png"
          alt="蓝队"
          class="team-role"
          @click="selected = 0"
        />
        <img
          v-if="selected === 1"
          src="public/team/choose-white.png"
          alt="白队"
          class="team-role"
          @click="selected = 1"
        />
        <img
          v-else
          src="public/team/white.png"
          alt="白队"
          class="team-role"
          @click="selected = 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import * as PIXI from "pixi.js-legacy";
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";

import { Howl } from "howler";
import { randomInt } from "@/utils";

// import preBg from '@/assets/index/bg.png';
import bgUrl from "@/assets/img/bg.jpg";
import infoUrl from "@/assets/img/info.png";
import coinUrl from "@/assets/img/coin.png";
import stoneUrl from "@/assets/img/stone.png";
import prizeUrl from "@/assets/img/prize.png";
import heart from "@/assets/img/heart.png";
// audio
import btnBgm from "@/assets/audios/play.mp3";
const sound = new Howl({
  src: btnBgm,
});

import ready from "@/assets/audios/ready.mp3";
import end from "@/assets/audios/end.mp3";
import score from "@/assets/audios/score.mp3";
import hp from "@/assets/audios/hp.mp3";
import getScore from "@/assets/audios/get-score.mp3";
const router = useRouter();
const percent = ref(0);
const readyBgm = new Howl({
  src: ready,
});
const endBgm = new Howl({
  src: end,
});
const scoreBgm = new Howl({
  src: score,
});
const hpBgm = new Howl({
  src: hp,
});
const getScoreBm = new Howl({
  src: getScore,
});
const game = ref("");

const showLoadingMask = ref(true);
const showCountdown = ref(false);
const showTeams = ref(true);
const selected = ref(2);
let loaded = ref(false);
let app, canvasWidth, canvasHeight;
const enemyCount = 10;
const horseCourt = 20;
const blobCount = ref(0);
const timerId = ref(0);
const cuScore = 900;
const silverScore = 1800;
const goldScore = 3600;
timerId.value = setInterval(() => {
  percent.value += 4;
  if (percent.value >= 96) {
    percent.value = 96;
  }
  if (loaded.value) {
    percent.value = 100;
    clearInterval(timerId.value);
    timerId.value = setTimeout(() => {
      showLoadingMask.value = false;
    }, 100);
  }
}, 100);
onBeforeUnmount(() => {
  if (timerId.value) {
    clearInterval(timerId.value);
    clearTimeout(timerId.value);
  }
  if (app) {
    app.destroy(true);
  }
});

let Application = PIXI.Application,
  Container = PIXI.Container,
  resources,
  AnimatedSprite = PIXI.AnimatedSprite,
  Graphics = PIXI.Graphics,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  TilingSprite = PIXI.TilingSprite,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle;

let goldAnimation,
  silverAnimation,
  cuAnimation,
  badgeAnimationSize,
  scoreAnimation,
  bigScore,
  scoreRate = 0;
const tipsArrowStyle = ref({});
const tipsTextStyle = ref({});
function toGame() {
  // router.replace({ name: 'Game' });
  app.loader
    .add(`badgeBg`, "badge/组 40.png")
    .add(`prizeBtn`, "badge/组 41.png")

    .add(`badge1st`, "badge/金徽章.png")
    .add(`badge2st`, "badge/银徽章.png")
    .add(`badge3st`, "badge/铜徽章.png")
    .add(`noget`, "badge/no-get.png")
    .load(() => {
      render(app, resources);
      sound.play();
      showTeams.value = false;
    });
}

onMounted(() => {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  badgeAnimationSize = {
    width: 0.96 * canvasWidth,
    height: ((0.96 * canvasWidth) / 600) * 340,
    x: (canvasWidth - 0.96 * canvasWidth) / 2,
    y: (85 / 667) * canvasHeight,
  };

  //创建一个pixi应用
  app = new Application({
    width: canvasWidth,
    height: canvasHeight,
    // antialiasing: true,
    antialias: true,
    // transparent: false,
    resolution: 2, // 接近锯齿问题
    forceCanvas: true,
    autoResize: true,
  });
  app.renderer.autoDensity = true;
  app.renderer.resize(canvasWidth, canvasHeight);

  game.value.appendChild(app.view);

  //加载素材图片
  app.loader
    .add(`bg`, bgUrl)
    .add(`coin`, coinUrl)
    .add(`stone`, stoneUrl)
    .add(`prize`, prizeUrl)
    .add(`outerBg`, "game/k.png")
    .add(`star`, "game/x.png")

    .add("backBtn", "rules/btn-back.png")
    .add(`tipArrow`, "tips/arrow.png")
    .add(`tipText`, "tips/text.png")
    .add("heart", heart)
    .add(`info`, infoUrl);

  for (let i = 1; i <= horseCourt; i++) {
    app.loader.add(`blueHorse${i}`, `/blueHorse/horse/ld${i}.png`);
  }
  for (let i = 1; i <= horseCourt; i++) {
    app.loader.add(`whiteHorse${i}`, `/whiteHorse/horse/ld${i}.png`);
  }

  for (let i = 1; i <= enemyCount; i++) {
    app.loader.add(`whiteEnemy${i}`, `/blueHorse/enemy/db${i}.png`);
  }

  for (let i = 1; i <= enemyCount; i++) {
    app.loader.add(`blueEnemy${i}`, `/whiteHorse/enemy/db${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`coin${i}`, `/coin/animation/bc${i}.png`);
  }
  for (let i = 4; i <= 12; i++) {
    app.loader.add(`prize${i}`, `/coin/animation/bc${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`gold${i}`, `/game/gold/${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`silver${i}`, `/game/silver/${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`cu${i}`, `/game/cu/${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`score${i}`, `/game/score/${i}.png`);
  }

  app.loader.load((_loader, _resources) => {
    resources = _resources;
    loaded.value = true;
    // setup(app, _resources);
  });
});

function render(app, resources) {
  let dragFlag = false;
  let startPoint = {};
  let hitRecords = [];
  let lastHit = {};
  let initalSpeed = 3;
  let speed = initalSpeed;

  const gap = 50;

  //设置要用到的变量
  let state,
    gameScene,
    gameOverScene,
    gameOverBg,
    message,
    bg,
    scoreText,
    blobs = [],
    numberOfBlobs = 4, //初始化最大敌车数量
    score = 0,
    hp = 3,
    runningHorse;

  let shouldAddScore = true;
  let scoreInfo, heart1, heart2, heart3;

  const contentX = 10;
  const contentY = 50;
  let goldBadge, silverBadge, cuBadge, noget;
  let blobWidth = (70 / 375) * canvasWidth;

  setup(app, resources);

  function setup(app, resources) {
    //设置游戏场景容器
    gameScene = new Container();
    // gameScene.visible = false;
    gameScene.sortableChildren = true;
    app.stage.addChild(gameScene);
    //设置背景
    let outerBgSprite = new Sprite(resources.outerBg.texture);
    outerBgSprite.width = canvasWidth;
    outerBgSprite.height = canvasHeight;
    outerBgSprite.zIndex = 9;
    gameScene.addChild(outerBgSprite);

    let starSprite = new Sprite(resources.star.texture);
    const starWidth = canvasWidth * 0.25;
    starSprite.width = starWidth;
    starSprite.height = (starWidth * 127) / 318;
    starSprite.x = (canvasWidth - starWidth) / 2;
    starSprite.y = (5 / 667) * canvasHeight;
    starSprite.zIndex = 9;
    gameScene.addChild(starSprite);

    bg = new TilingSprite(resources.bg.texture);

    bg.x = (contentX / 375) * canvasWidth;
    bg.y = (contentY / 667) * canvasHeight;
    console.log("contentY/667*canvasHeight", (contentY / 667) * canvasHeight);
    // bg.width = canvasWidth - gap;
    const bgWidth = canvasWidth - (contentX / 375) * canvasWidth * 2;
    const bgHeight = (bgWidth / 750) * 2415;
    bg.width = bgWidth;

    // bg.height = canvasHeight - 160;
    bg.height = bgHeight;

    bg.tileScale.set(
      (0.683 * (canvasWidth - (contentX / 375) * canvasWidth * 2)) / 355,
      (0.683 * (canvasWidth - (contentX / 375) * canvasWidth * 2)) / 355

      // (0.6 * (bgHeight / bgWidth)) / (597 / 355)
    ); // 355 为 375 宽度下的计算数值
    // bg.tileScale.set(0.55*(canvasWidth - contentX/375*canvasWidth * 2)/355, 0.65  );  // 355 为 375 宽度下的计算数值

    bg.tilePosition.y = (-1000 / 667) * canvasHeight;
    gameScene.addChild(bg);

    // // 分数
    let infoBar = new Sprite(resources.info.texture);
    infoBar.width = canvasWidth - contentX * 2;
    // infoBar.height = (100 / 667) * canvasHeight;
    infoBar.height = (303 / 1133) * (canvasWidth - contentX * 2);

    infoBar.x = (contentX / 375) * canvasWidth;
    infoBar.y = ((contentY - 38) / 667) * canvasHeight; // 38 为相对 height  的相对数值

    infoBar.zIndex = 99;

    gameScene.addChild(infoBar);

    scoreAnimation = new AnimatedSprite(
      new Array(11).fill(0).map((_item, i) => {
        return resources[`score${i + 1}`].texture;
      })
    );
    scoreAnimation.width = badgeAnimationSize.width;
    scoreAnimation.height = badgeAnimationSize.height;
    scoreAnimation.x = badgeAnimationSize.x;
    scoreAnimation.y = badgeAnimationSize.y;
    scoreAnimation.loop = true;
    scoreAnimation.visible = false;
    scoreAnimation.gotoAndPlay(0);
    scoreAnimation.zIndex = 99;
    gameScene.addChildAt(scoreAnimation, 1);

    bigScore = new Text(``, {
      fontSize: "45px",
      fill: "#fff",
      align: "center",
      fontWeight: 600,
    });
    bigScore.x =
      badgeAnimationSize.x +
      badgeAnimationSize.width / 2 +
      (10 / 375) * canvasWidth;
    bigScore.y =
      badgeAnimationSize.y +
      badgeAnimationSize.height / 2 -
      (2 / 667) * canvasHeight;
    bigScore.anchor.set(0.5, 0.5);
    bigScore.zIndex = 100;
    bigScore.visible = false;
    gameScene.addChild(bigScore);

    const heartSize = {
      width: (22 / 375) * canvasWidth,
      height: ((22 / 375) * canvasWidth * 82) / 85,
    };

    heart1 = new Sprite(resources.heart.texture);
    heart1.width = heartSize.width;
    heart1.height = heartSize.height;
    // heart1.x = canvasWidth - (155 / 375) * canvasWidth;
    // heart1.y = ((contentY + 18) / 667) * canvasHeight;
    heart1.x = 0.62 * infoBar.width;
    // heart1.y = ((contentY + 18) / 667) * canvasHeight;
    heart1.y = infoBar.y + infoBar.height * 0.6;

    heart1.zIndex = 100;
    gameScene.addChild(heart1);

    heart2 = new Sprite(resources.heart.texture);
    heart2.width = heartSize.width;
    heart2.height = heartSize.height;
    // heart2.x = canvasWidth - (128 / 375) * canvasWidth;
    // heart2.y = ((contentY + 15) / 667) * canvasHeight;
    heart2.x = 0.62 * infoBar.width + heartSize.width + (5 / 375) * canvasWidth;
    heart2.y = infoBar.y + infoBar.height * 0.58;

    heart2.zIndex = 100;
    gameScene.addChild(heart2);

    heart3 = new Sprite(resources.heart.texture);
    heart3.width = heartSize.width;
    heart3.height = heartSize.height;

    heart3.x =
      0.62 * infoBar.width + 2 * (heartSize.width + (5 / 375) * canvasWidth);
    heart3.y = infoBar.y + infoBar.height * 0.54;

    heart3.zIndex = 100;
    gameScene.addChild(heart3);

    // score info
    scoreInfo = new Text(`${score}`, { fontSize: "24px", fill: "#d6ac5a" });
    // scoreInfo.x = 350;
    scoreInfo.x = 0.39 * infoBar.width;
    // scoreInfo.x = (140 / 375) * canvasWidth;

    // scoreInfo.y = 65;
    // scoreInfo.y = (contentY / 667) * canvasHeight + 15;
    scoreInfo.y = infoBar.y + infoBar.height * 0.56;

    scoreInfo.zIndex = 100;
    gameScene.addChild(scoreInfo);

    let tipArrow = new Sprite(resources.tipArrow.texture);
    tipArrow.width = canvasWidth - contentX * 4;
    tipArrow.height = (281 / 891) * (canvasWidth - contentX * 4);
    // tipArrow.position.set(
    //   (canvasWidth - tipArrow.width) / 2,
    //   canvasHeight - tipArrow.height - 1.5 * gap
    // );
    // tipArrow.zIndex = 99;

    // gameScene.addChild(tipArrow);

    tipsArrowStyle.value = {
      width: `${canvasWidth - contentX * 4}px`,
      left: `${(canvasWidth - tipArrow.width) / 2}px`,
      top: `${canvasHeight - tipArrow.height - 1.5 * gap}px`,
      position: "absolute",
    };

    let tipText = new Sprite(resources.tipText.texture);
    tipText.width = canvasWidth - (100 / 375) * canvasWidth;
    tipText.height = (82 / 675) * (canvasWidth - (100 / 375) * canvasWidth);
    // tipText.position.set(
    //   (canvasWidth - tipText.width) / 2,
    //   canvasHeight - tipText.height - (30 / 667) * canvasHeight
    // );
    // tipText.zIndex = 99;

    // gameScene.addChild(tipText);
    tipsTextStyle.value = {
      width: `${canvasWidth - (100 / 375) * canvasWidth}px`,
      left: `${(canvasWidth - tipText.width) / 2}px`,
      top: `${canvasHeight - tipText.height - (30 / 667) * canvasHeight}px`,
      position: "absolute",
    };

    const name = selected.value === 0 ? `blueHorse` : `whiteHorse`;
    runningHorse = new AnimatedSprite(
      new Array(horseCourt).fill(0).map((_item, i) => {
        return resources[`${name}${i + 1}`].texture;
      })
    );
    runningHorse.width = (85 / 375) * canvasWidth;
    runningHorse.height = (((362 / 133) * 85) / 375) * canvasWidth;
    runningHorse.vy = 0; //y轴加速度
    runningHorse.vx = 0; //x轴加速度
    runningHorse.invl = 0; //初始化无敌时间

    runningHorse.position.set(
      (canvasWidth - runningHorse.width) / 2 + 0.02 * canvasWidth,
      canvasHeight - runningHorse.height - gap / 2
    ); //自己的车的初始位置

    runningHorse.animationSpeed = 0.3;

    runningHorse.on("touchstart", (event) => {
      dragFlag = true;
      startPoint = { x: event.data.global.x, y: event.data.global.y };
    });

    runningHorse.on("touchmove", (event) => {
      if (dragFlag) {
        const dx = event.data.global.x - startPoint.x;
        // const dy = event.data.global.y - startPoint.y;
        runningHorse.x += dx;
        // mycarSprite.y += dy;
        startPoint = { x: event.data.global.x, y: event.data.global.y };
      }
    });

    runningHorse.on("touchend", (event) => {
      dragFlag = false;
    });

    // runningHorse.on("tap", (event) => {
    //   play()
    // });

    gameScene.addChild(runningHorse);
    showCountdown.value = true;
    readyBgm.play();

    // //创建一个游戏结束的场景
    gameOverScene = new Container();
    app.stage.addChild(gameOverScene);

    gameOverScene.x = canvasWidth * 0.13;
    // 这是他所在的y + 他的高度 就是 -
    gameOverScene.y = canvasHeight * 0.18;
    gameOverScene.width = canvasWidth - canvasWidth * 0.13 * 2;
    // gameOverScene.width = canvasWidth;

    // gameOverScene.height = canvasHeight - 300;
    gameOverScene.height =
      (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2);

    gameOverBg = new Sprite(resources.badgeBg.texture);
    gameOverBg.width = canvasWidth - canvasWidth * 0.13 * 2;
    gameOverBg.height = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2);
    gameOverScene.addChild(gameOverBg);

    // //先让游戏结束场景隐藏
    gameOverScene.visible = false;

    // //设置一个默认字体
    let style = new TextStyle({
      wordWrap: true,
      align: "center",
      fill: "#d6ac5a",
      fontSize: 30,
    });
    message = new Text(`得分`, style);
    message.width = 60;
    message.height = 35;

    message.y = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.65;
    message.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2;
    //字体中心点用于居中
    message.anchor.set(0.5, 0.5);
    gameOverScene.addChild(message);

    scoreText = new Text(
      ``,
      new TextStyle({
        wordWrap: true,
        align: "center",
        fill: "#d6ac5a",
        fontSize: 50,
      })
    );

    scoreText.y =
      (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.65 + 40;

    scoreText.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2;

    //字体中心点用于居中
    scoreText.anchor.set(0.5, 0.5);
    gameOverScene.addChild(scoreText);

    const badgeY = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.08;
    const badgeX = (canvasWidth - canvasWidth * 0.13 * 2) / 2 - 100;
    const badgeWidth = 200;
    const badgeHeight = 250;

    goldBadge = new Sprite(resources.badge1st.texture);

    goldBadge.y = badgeY;
    goldBadge.width = badgeWidth;
    goldBadge.height = badgeHeight;

    goldBadge.x = badgeX;
    goldBadge.visible = false;

    gameOverScene.addChild(goldBadge);

    silverBadge = new Sprite(resources.badge2st.texture);

    silverBadge.y = badgeY;
    silverBadge.width = badgeWidth;
    silverBadge.height = badgeHeight;

    silverBadge.x = badgeX;
    silverBadge.visible = false;

    gameOverScene.addChild(silverBadge);

    cuBadge = new Sprite(resources.badge3st.texture);

    cuBadge.y = badgeY;
    cuBadge.width = badgeWidth;
    cuBadge.height = badgeHeight;

    cuBadge.x = badgeX;
    cuBadge.visible = false;

    gameOverScene.addChild(cuBadge);
    // noget
    noget = new Sprite(resources.noget.texture);
    noget.y = canvasHeight * 0.1675;
    noget.width = canvasWidth * 0.5333;
    noget.height = canvasHeight * 0.1547;

    noget.x = badgeX;
    noget.visible = false;
    gameOverScene.addChild(noget);
    setTimeout(() => {
      tipArrow.visible = false;
      tipText.visible = false;
      showCountdown.value = false;
      runningHorse.loop = true;
      runningHorse.gotoAndPlay(0);

      runningHorse.interactive = true;

      state = play;
      app.ticker.maxFPS = 60;

      app.ticker.add((delta) => gameLoop(delta));
    }, 3000);
  }
  function creatEMCar(resources) {
    //设置敌人
    //根据最大 blob 数生成：理论上 1 人 2 石 3 奖 4 金币
    const blobsArr = [
      "coin",

      "coin",
      "stone",
      "coin",
      "prize",
      "coin",
      "prize",
      "coin",
      "prize",
      "coin",
      "enemy",
      "coin",
      "prize",
    ];
    for (let i = 0; i < numberOfBlobs - blobs.length; i++) {
      const randomBlob =
        blobCount.value > 8 ? blobsArr[randomInt(0, 12)] : `coin`;
      //创建道具
      let blob;
      //  =
      //   randomBlob === `enemy`
      //     ? new AnimatedSprite(
      //         new Array(enemyCount).fill(0).map((_item, i) => {
      //           return resources[`whiteEnemy${i + 1}`].texture;
      //         })
      //       )
      //     : new Sprite(resources[randomBlob].texture);
      if (randomBlob === `enemy`) {
        const name = selected.value === 0 ? `whiteEnemy` : `blueEnemy`;
        blob = new AnimatedSprite(
          new Array(enemyCount).fill(0).map((_item, i) => {
            return resources[`${name}${i + 1}`].texture;
          })
        );
      } else if (randomBlob === "coin") {
        blob = new AnimatedSprite(
          new Array(11).fill(0).map((_item, i) => {
            return resources[`coin${i + 1}`].texture;
          })
        );
        blob.animationSpeed = 1.25;
        blob.loop = false;
      } else if (randomBlob === "prize") {
        blob = new AnimatedSprite([
          resources[`prize`].texture,
          ...new Array(9).fill(0).map((_item, i) => {
            return resources[`prize${i + 4}`].texture;
          }),
        ]);
        blob.animationSpeed = 1.25;
        blob.loop = false;
        blob.height = (blobWidth / 300) * 400;
      } else {
        blob = new Sprite(resources[randomBlob].texture);
      }

      blob.width = blobWidth;
      if (randomBlob === "stone") {
        blob.height = (blobWidth / 238) * 120;
      }
      if (randomBlob === "coin") {
        blob.height = (blobWidth / 230) * 231;
      }

      if (randomBlob === "enemy") {
        blob.width = blobWidth;

        blob.height = (592 / 228) * blobWidth;
        blob.animationSpeed = 0.2;
        blob.loop = true;
        blob.gotoAndPlay(0);
      }
      blob.ts = new Date().getTime();
      let EMCarIsHit = true;
      while (EMCarIsHit) {
        //随机车子x坐标在画布外
        // let x = randomInt(250, 500);
        let y = randomInt(-speed, -1.5 * canvasHeight);

        //随机y坐标在画布范围内
        const minX = 70;
        let xAreas = [
          // minX / 2 + 10,
          (contentX / 375) * canvasWidth * 1.5,
          // (canvasWidth - minX) / 2,
          (canvasWidth - blobWidth) / 2,

          // canvasWidth - minX - 10,
          canvasWidth - blobWidth - (contentX / 375) * canvasWidth, // 图片普遍右边有阴影，适当调整
        ];
        // let x = randomInt(10 + gap, app.stage.width - blob.width - gap);
        let x = xAreas[randomInt(0, 2)];

        //设置车辆位置
        blob.x = x;
        blob.y = y;

        //检测车辆位置是否有重叠
        EMCarIsHit = checkEMCarPositionHit(blob);
      }
      blobCount.value += 1;
      //将车子加入数组
      blobs.push(blob);

      //渲染
      gameScene.addChild(blob);
    }
  }
  //检查生成的地方车辆是否有重叠
  function checkEMCarPositionHit(blob) {
    for (var i = 0; i < blobs.length; i++) {
      if (
        hitTestRectangle(blob, blobs[i], { x: 0, y: 200, updateLast: false })
      ) {
        return true;
      }
    }
  }
  function gameLoop(delta) {
    //更新游戏场景:
    state(delta);
  }
  let bgSpeed = 1;
  function play(delta) {
    //背景移动
    bg.tilePosition.y += bgSpeed;
    bgSpeed += 0.05;
    if (bgSpeed >= 12) bgSpeed = 12;

    speed += 0.02;
    if (speed >= 8) speed = 8;

    if (runningHorse.invl > 0) {
      runningHorse.invl--;
    }
    //判断车辆是否超出画布
    keepInScreen(runningHorse, {
      x: 0,
      y: 2,
      width: canvasWidth,
      height: canvasHeight,
    });
    //设置敌人
    creatEMCar(resources);
    let explorerHit = false;
    //移动敌人
    blobs.forEach(function (blob) {
      blob.y += speed;
      //如果和我方车辆发生碰撞
      if (hitTestRectangle(runningHorse, blob)) {
        explorerHit = true;
      }
    });
    //去除已经行驶到画布外的敌军车辆
    removeEmCar();
    //加分
    //如果分数大于30则每1000分场景车辆+1，最多6辆
    if (score > 30) {
      numberOfBlobs = 4 + Math.floor(score / 50);
      // speed = initalSpeed + Math.floor(score / 45);
      // if (speed >= 15) speed = 15;
      if (numberOfBlobs >= 7) {
        numberOfBlobs = 7;
      }
    }
    //如果发生碰撞且在无敌时间之外
    // 碰撞后道具消失，本来 explorerHit 也应该由 true 变成 false，但实际上如果一直没改变位置，仍然会被判定为碰撞且为 true
    // console.log(explorerHit, runningHorse.invl, lastHit, shouldAddScore)
    // 出现过碰撞一次石头，但 shouldAddScore 连续打印出为 true
    if (explorerHit && runningHorse.invl === 0) {
      if (["coin"].includes(lastHit.url) && shouldAddScore) {
        lastHit.blob.onComplete = () => {
          lastHit.blob.visible = false;
        };

        lastHit.blob.gotoAndPlay(0);
        scoreBgm.play();
        score += 5;
      } else if (["prize"].includes(lastHit.url) && shouldAddScore) {
        lastHit.blob.onComplete = () => {
          lastHit.blob.visible = false;
        };

        lastHit.blob.gotoAndPlay(0);

        scoreBgm.play();
        score += 20;
      } else if (["stone", `enemy`].includes(lastHit.url) && shouldAddScore) {
        lastHit.blob.visible = false;

        // mycarSprite.texture = resources["img/boom.png"].texture;
        runningHorse.alpha = 0.3;

        //减血
        hpBgm.play();
        hp--;
        speed = initalSpeed;
        bgSpeed = 1;
      }
      if (hp === 2) {
        heart3.visible = false;
      }
      if (hp === 1) {
        heart2.visible = false;
      }
      if (hp === 0) {
        heart1.visible = false;
      }
      scoreInfo.text = `${score}`;
      setTimeout(() => {
        runningHorse.alpha = 1;
      }, 500);

      hitRecords.push(lastHit);
      // runningHorse.invl = 3; //设置无敌时间
      shouldAddScore = false;

      //判断是否血量归零
      if (hp < 1) {
        //抛出游戏结束
        state = endGame;
        endBgm.play();
        scoreText.text = score;
        runningHorse.interactive = false;
      }
    }

    if (score >= scoreRate + 300) {
      const shouldNotShow =
        (score >= cuScore && score <= cuScore + 20) ||
        (score >= silverScore && score <= silverScore + 20) ||
        (score >= goldScore && score <= goldScore + 20);
      if (!shouldNotShow) {
        getScoreBm.play();
        scoreAnimation.visible = true;
        bigScore.visible = true;
        bigScore.text = Math.floor(score / 100) * 100;
        setTimeout(() => {
          scoreAnimation.visible = false;
          bigScore.visible = false;
        }, 1200);
      }
      scoreRate += 300;
    }

    if (score >= goldScore && !goldAnimation) {
      goldAnimation = new AnimatedSprite(
        new Array(11).fill(0).map((_item, i) => {
          return resources[`gold${i + 1}`].texture;
        })
      );
      goldAnimation.width = badgeAnimationSize.width;
      goldAnimation.height = badgeAnimationSize.height;
      goldAnimation.x = badgeAnimationSize.x;
      goldAnimation.y = badgeAnimationSize.y;
      goldAnimation.loop = true;
      goldAnimation.gotoAndPlay(0);
      gameScene.addChildAt(goldAnimation, 1);
      getScoreBm.play();

      setTimeout(() => {
        goldAnimation.visible = false;
        // gameScene.removeChildAt(1)
      }, 1200);
    }
    if (score >= silverScore && !silverAnimation) {
      silverAnimation = new AnimatedSprite(
        new Array(11).fill(0).map((_item, i) => {
          return resources[`silver${i + 1}`].texture;
        })
      );
      silverAnimation.width = badgeAnimationSize.width;
      silverAnimation.height = badgeAnimationSize.height;
      silverAnimation.x = badgeAnimationSize.x;
      silverAnimation.y = badgeAnimationSize.y;
      silverAnimation.loop = true;
      silverAnimation.gotoAndPlay(0);
      gameScene.addChildAt(silverAnimation, 1);
      getScoreBm.play();

      setTimeout(() => {
        silverAnimation.visible = false;
      }, 1200);
    }

    if (score >= cuScore && !cuAnimation) {
      cuAnimation = new AnimatedSprite(
        new Array(11).fill(0).map((_item, i) => {
          return resources[`cu${i + 1}`].texture;
        })
      );
      cuAnimation.width = badgeAnimationSize.width;
      cuAnimation.height = badgeAnimationSize.height;
      cuAnimation.x = badgeAnimationSize.x;
      cuAnimation.y = badgeAnimationSize.y;
      cuAnimation.loop = true;
      cuAnimation.gotoAndPlay(0);
      gameScene.addChildAt(cuAnimation, 1);
      getScoreBm.play();
      setTimeout(() => {
        cuAnimation.visible = false;
        // gameScene.removeChildAt(1)
      }, 1200);
    }
  }

  //移除已经行驶到画布外围的敌方车辆
  function removeEmCar() {
    for (var i = 0; i < blobs.length; i++) {
      // if (blobs[i].x < -50) {
      if (blobs[i].y > canvasHeight - 100) {
        //从数组删除
        blobs.splice(i, 1);
        //从场景删除: gameScene 调用 addChild 后记得更改这里的值
        let badgeAnimationCount = [
          goldAnimation,
          silverAnimation,
          cuAnimation,
        ].filter((item) => item);
        gameScene.removeChildAt(i + 2 + badgeAnimationCount.length);
        // console.log('children', gameScene.children)
      }
    }
  }
  //判断是否超出画布
  function keepInScreen(sprite, container) {
    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      // collision = 'left';
    }

    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      // collision = 'top';
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      // collision = 'right';
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      // collision = 'bottom';
    }

    return collision;
  }
  //碰撞检测
  function hitTestRectangle(r1, r2, option = { x: 0, y: 0, updateLast: true }) {
    const { x = 0, y = 0, updateLast } = option;

    //设置需要的变量
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //初始化是否碰撞
    hit = false;

    //寻找精灵中心点
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //计算精灵一半的宽度和高度
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //计算相互之间的距离
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //计算xy重叠的数值
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if(!r2.visible) return false;

    //检查x轴
    if (Math.abs(vx) < combinedHalfWidths + x) {
      //再检查y轴
      if (Math.abs(vy) < combinedHalfHeights + y) {
        //如果是则判断为碰撞
        hit = true;
      } 
      // else {
      //   //否则为没碰撞
      //   hit = false;
      // }
    } else {
      //x轴没有碰撞
      hit = false;
    }
    if (hit && r2.texture.textureCacheIds.length) {
      let id;
      if (
        r2.texture.textureCacheIds[0].includes(`whiteEnemy`) ||
        r2.texture.textureCacheIds[0].includes(`blueEnemy`)
      ) {
        id = `enemy`;
      } else if (r2.texture.textureCacheIds[0].includes(`coin`)) {
        id = `coin`;
      } else if (r2.texture.textureCacheIds[0].includes(`prize`)) {
        id = `prize`;
      } else {
        id = r2.texture.textureCacheIds[0];
      }

      if (updateLast) {
        // console.log(`r2`, r2)
        // console.log(`lastHit`, lastHit)
        // console.log(`id`, id)
        shouldAddScore = !(r2.ts === lastHit.ts && lastHit.url === id);

        lastHit = {
          url: id,
          ts: r2.ts,
          blob: r2,
        };
      }
    }

    //是否碰撞
    return hit;
  }
  //游戏结束显示游戏结束场景，隐藏游戏场景
  function endGame() {
    const keyValue = localStorage.getItem("keyValue");

    if (score > 3600) {
      goldBadge.visible = true;
      if (keyValue !== "gold") {
        localStorage.setItem("keyValue", "gold");
      }
      genEndGame(false);
    } else if (score >= 1800 && score < 3600) {
      if (keyValue !== "gold") {
        localStorage.setItem("keyValue", "silver");
      }
      genEndGame(false);
      silverBadge.visible = true;
    } else if (score >= 900 && score < 1800) {
      if (!["gold", "silver"].includes(keyValue)) {
        localStorage.setItem("keyValue", "cu");
      }
      genEndGame(false);

      cuBadge.visible = true;
    } else {
      noget.visible = true;
      genEndGame(true);
    }

    nextTick(() => {
      state = () => {};
    });
  }
  function genEndGame(isAlready = false) {
    // console.log('触发对应的规则', isAlready)
    if (isAlready) {
      // 已经获取到对应的勋章了
      let backBtn = new Sprite(resources.backBtn.texture);
      backBtn.width = (150 / 375) * canvasWidth;
      backBtn.height = (backBtn.width / 375) * 143;
      backBtn.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2 - 80;
      // backBtn.y = gameOverBg.height - 1.1*backBtn.height;
      backBtn.y = gameOverBg.height * 0.85;

      backBtn.on("touchend", () => {
        sound.play();
        router.replace({
          name: "Home",
          query: {
            score,
          },
        });
      });
      backBtn.interactive = true;

      //  let style = new TextStyle({
      //   wordWrap: true,
      //   align: "center",
      //   fill: "white",
      //   fontSize: 12,
      // });
      // let tip = new Text(`你已领取或获得了更高的奖牌`, style);
      // tip.width = 158;

      // tip.y = gameOverBg.height  * 0.8;
      // tip.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2;
      // //字体中心点用于居中
      // tip.anchor.set(0.5, 0.5);
      // gameOverScene.addChild(tip)
      gameOverScene.addChild(backBtn);
    } else {
      // 未获取直接渲染跳转逻辑
      let prizeBtn = new Sprite(resources.prizeBtn.texture);
      prizeBtn.y = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.78;
      prizeBtn.width = 150;
      prizeBtn.height = 60;

      prizeBtn.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2 - 80;
      prizeBtn.interactive = true;
      prizeBtn.on("touchend", () => {
        sound.play();

        router.replace({
          name: "Poster",
          query: {
            score,
          },
        });
      });
      gameOverScene.addChild(prizeBtn);
    }

    gameOverScene.visible = true;
  }
}
</script>
<style scoped>
.countdown-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.loading-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #022044;
}

.countdown-pic {
  width: 20%;
  height: 20%;
  background-size: contain;

  background-repeat: no-repeat;
  animation-name: countdown;
  animation-duration: 3s;
  position: absolute;
  top: 40%;
  left: 40%;
  transform-origin: top center;
}

@keyframes countdown {
  0% {
    transform: scale(1);
    background-image: url("public/game/3.png");
  }

  16% {
    transform: scale(1.2);
    background-image: url("public/game/3.png");
  }

  32% {
    transform: scale(1);
    background-image: url("public/game/2.png");
  }
  48% {
    transform: scale(1.2);
    background-image: url("public/game/2.png");
  }
  64% {
    transform: scale(0.7);
    background-image: url("public/game/1.png");
  }
  80% {
    background-image: url("public/game/1.png");
    transform: scale(0.9);
  }

  90% {
    transform: scale(2.2);
    background-image: url("public/game/go.png");
  }
  100% {
    transform: scale(2.5);
    background-image: url("public/game/go.png");
  }
}

.select-team {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  background-image: url("public/rules/bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
.gray {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);

  filter: grayscale(100%);

  filter: gray;
}

.percent {
  margin-left: 16px;
}
.loading {
  position: absolute;
  top: 25%;
  width: 50%;
  left: 25%;
  height: 40%;
  color: #d7ae5a;
  font-size: 20px;
}
.loading-horse {
  width: 100%;
  height: 60%;
  background-size: contain;

  background-repeat: no-repeat;
  animation-name: runninghorse;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes runninghorse {
  0% {
    background-image: url("/loading/mp1.png");
  }
  /* 
  5% {
    background-image: url('/loading/mp2.png');
  } */

  10% {
    background-image: url("/loading/mp3.png");
  }

  /* 15% {
    background-image: url('/loading/mp4.png');
  } */
  20% {
    background-image: url("/loading/mp5.png");
  }

  /* 25% {
    background-image: url('/loading/mp6.png');
  } */

  30% {
    background-image: url("/loading/mp7.png");
  }

  /* 35% {
    background-image: url('/loading/mp8.png');
  } */
  40% {
    background-image: url("/loading/mp9.png");
  }
  /* 
  45% {
    background-image: url('/loading/mp10.png');
  } */
  50% {
    background-image: url("/loading/mp11.png");
  }
  60% {
    background-image: url("/loading/mp12.png");
  }

  70% {
    background-image: url("/loading/mp14.png");
  }

  80% {
    background-image: url("/loading/mp16.png");
  }

  90% {
    background-image: url("/loading/mp18.png");
  }

  100% {
    background-image: url("/loading/mp20.png");
  }
}
</style>
