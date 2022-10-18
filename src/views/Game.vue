<template>
  <div ref="game"></div>
</template>

<script setup>
import * as PIXI from 'pixi.js-legacy';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { Howl } from 'howler';

// import preBg from '@/assets/index/bg.png';
import bgUrl from '@/assets/img/bg.jpg';
import outerBg from '@/assets/img/outer-bg.png';
import infoUrl from '@/assets/img/info.png';
import coinUrl from '@/assets/img/coin.png';
import stoneUrl from '@/assets/img/stone.png';
import prizeUrl from '@/assets/img/prize.png';
import heart from '@/assets/img/heart.png';
// audio
import ready from '@/assets/audios/ready.mp3';
import end from '@/assets/audios/end.mp3';
import score from '@/assets/audios/score.mp3';
import hp from '@/assets/audios/hp.mp3';

const router = useRouter();

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

const game = ref('');
onMounted(() => {
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
  let canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;

  let whiteHorseCount = 10;

  //创建一个pixi应用
  let app = new Application({
    width: canvasWidth,
    height: canvasHeight,
    // resizeTo: window,
    antialiasing: true,
    // transparent: false,
    // resolution: 1
    forceCanvas: true,
    // view: canvas.value,
  });
  game.value.appendChild(app.view);

  let dragFlag = false;
  let startPoint = {};
  let hitRecords = [];
  let lastHit = {};
  let initalSpeed = 5;
  let speed = initalSpeed;

  const gap = 50;

  //设置要用到的变量
  let state,
    gameScene,
    gameOverScene,
    message,
    bg,
    scoreText,
    blobs = [],
    numberOfBlobs = 4, //初始化最大敌车数量
    score = 0,
    hp = 3,
    runningHorse;

  let shouldAddScore = true;
  let scoreInfo, hpInfo, heart1, heart2, heart3;
  const horseCourt = 20;

  const contentX = 10;
  const contentY = 50;

  //加载素材图片
  app.loader
    .add(`bg`, bgUrl)
    .add(`coin`, coinUrl)
    .add(`stone`, stoneUrl)
    .add(`prize`, prizeUrl)
    // .add(`myHorse`, 'img/myHorse.png')
    .add(`outerBg`, outerBg)
    // .add(`preBg`, preBg)
    .add(`badgeBg`, 'badge/组 40.png')
    .add(`prizeBtn`, 'badge/组 41.png')
    .add(`badge1st`, 'badge/金徽章.png')
    .add(`tipArrow`, 'tips/arrow.png')
    .add(`tipText`, 'tips/text.png')
    .add('heart', heart)
    .add(`info`, infoUrl);

  for (let i = 1; i <= horseCourt; i++) {
    app.loader.add(`horse${i}`, `/blueHorse/ld${i}.png`);
  }

  for (let i = 1; i <= whiteHorseCount; i++) {
    app.loader.add(`whiteHorse${i}`, `/敌对白队/db${i}.png`);
  }

  for (let i = 1; i <= 12; i++) {
    app.loader.add(`coin${i}`, `/coin/animation/bc${i}.png`);
  }

  app.loader.load((_loader, _resources) => {
    resources = _resources;
    setup(_resources);
  });

  function setup(resources) {
    /* preScene */
    // let preScene = new Container();
    // app.stage.addChild(preScene);

    // let preBg = new Sprite(resources.preBg.texture);
    // preBg.width = canvasWidth;
    // preBg.height = canvasHeight;
    // preScene.addChild(preBg);

    // let playBtn = new Sprite(resources.playBtn.texture);
    // playBtn.width = canvasWidth - 20;
    // playBtn.height = 400;
    // playBtn.y = canvasHeight - 660;
    // playBtn.x = 20;
    // playBtn.interactive = true; //响应交互
    // playBtn.on('pointerdown', () => {
    //   preScene.visible = false;
    //   gameScene.visible = true;
    // });

    // preScene.addChild(playBtn);

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

    bg = new TilingSprite(resources.bg.texture);

    bg.x = (contentX / 375) * canvasWidth;
    bg.y = (contentY / 667) * canvasHeight;
    console.log('contentY/667*canvasHeight', (contentY / 667) * canvasHeight);
    // bg.width = canvasWidth - gap;
    const bgWidth = canvasWidth - (contentX / 375) * canvasWidth * 2;
    const bgHeight = canvasHeight - (55 / 667) * canvasHeight;
    bg.width = bgWidth;
    console.log(
      canvasHeight - (70 / 667) * canvasHeight,
      canvasWidth - (contentX / 375) * canvasWidth * 2
    );

    // bg.height = canvasHeight - 160;
    bg.height = bgHeight;

    bg.tileScale.set(
      (0.55 * (canvasWidth - (contentX / 375) * canvasWidth * 2)) / 355,
      (0.55 * (bgHeight / bgWidth)) / (597 / 355)
    ); // 355 为 375 宽度下的计算数值
    // bg.tileScale.set(0.55*(canvasWidth - contentX/375*canvasWidth * 2)/355, 0.65  );  // 355 为 375 宽度下的计算数值

    bg.tilePosition.y = (-500 / 667) * canvasHeight;
    gameScene.addChild(bg);

    // // 分数
    let infoBar = new Sprite(resources.info.texture);
    infoBar.width = canvasWidth - contentX * 2;
    infoBar.height = (100 / 667) * canvasHeight;
    infoBar.x = (contentX / 375) * canvasWidth;
    infoBar.y = (contentY / 667) * canvasHeight - (40 / 667) * canvasHeight; // 40 为相对 height 100 的相对数值

    infoBar.zIndex = 99;

    gameScene.addChild(infoBar);

    // hp info
    // hpInfo = new Text(`HP:${hp}`, { fontSize: '24px', fill: '#d6ac5a' });
    // hpInfo.x = canvasWidth - 150;
    // hpInfo.y = (contentY / 667) * canvasHeight + 10;

    // hpInfo.zIndex = 100;

    // gameScene.addChild(hpInfo);

    const heartSize = {
      width: (22 / 375) * canvasWidth,
      height: ((22 / 375) * canvasWidth * 82) / 85,
    };

    // const hearts = new Array(hp).fill(
    //   new Sprite(resources.heart.texture)
    // )

    // for(let i in hearts) {
    //   const heart = hearts[i]
    //   heart.width = heartSize.width;
    //   heart.height = heartSize.height;
    //   heart.x = canvasWidth - (155-27*i)/375*canvasWidth;
    //   heart.y = (contentY + 18-3*i )/ 667 * canvasHeight;
    //   heart.zIndex = 100;
    // gameScene.addChild(heart);
    // }

    heart1 = new Sprite(resources.heart.texture);
    heart1.width = heartSize.width;
    heart1.height = heartSize.height;
    heart1.x = canvasWidth - (155 / 375) * canvasWidth;
    heart1.y = ((contentY + 18) / 667) * canvasHeight;
    heart1.zIndex = 100;
    gameScene.addChild(heart1);

    heart2 = new Sprite(resources.heart.texture);
    heart2.width = heartSize.width;
    heart2.height = heartSize.height;
    heart2.x = canvasWidth - (128 / 375) * canvasWidth;
    heart2.y = ((contentY + 15) / 667) * canvasHeight;
    heart2.zIndex = 100;
    gameScene.addChild(heart2);

    heart3 = new Sprite(resources.heart.texture);
    heart3.width = heartSize.width;
    heart3.height = heartSize.height;
    heart3.x = canvasWidth - (101 / 375) * canvasWidth;
    heart3.y = ((contentY + 11) / 667) * canvasHeight;
    heart3.zIndex = 100;
    gameScene.addChild(heart3);

    // score info
    scoreInfo = new Text(`${score}`, { fontSize: '24px', fill: '#d6ac5a' });
    // scoreInfo.x = 350;
    // scoreInfo.x = 150;
    scoreInfo.x = (140 / 375) * canvasWidth;

    // scoreInfo.y = 65;
    scoreInfo.y = (contentY / 667) * canvasHeight + 15;

    scoreInfo.zIndex = 100;
    gameScene.addChild(scoreInfo);

    let tipArrow = new Sprite(resources.tipArrow.texture);
    tipArrow.width = canvasWidth - contentX * 4;
    tipArrow.height = (281 / 891) * (canvasWidth - contentX * 4);
    tipArrow.position.set(
      (canvasWidth - tipArrow.width) / 2,
      canvasHeight - tipArrow.height - 1.5 * gap
    );
    tipArrow.zIndex = 99;

    gameScene.addChild(tipArrow);

    let tipText = new Sprite(resources.tipText.texture);
    tipText.width = canvasWidth - (100 / 375) * canvasWidth;
    tipText.height = (82 / 675) * (canvasWidth - (100 / 375) * canvasWidth);
    tipText.position.set(
      (canvasWidth - tipText.width) / 2,
      canvasHeight - tipText.height - (30 / 667) * canvasHeight
    );
    tipText.zIndex = 99;

    gameScene.addChild(tipText);

    runningHorse = new AnimatedSprite(
      new Array(horseCourt).fill(0).map((_item, i) => {
        return resources[`horse${i + 1}`].texture;
      })
    );
    runningHorse.width = 120; //自己的车宽度
    runningHorse.height = 260; //高度
    runningHorse.vy = 0; //y轴加速度
    runningHorse.vx = 0; //x轴加速度
    runningHorse.invl = 0; //初始化无敌时间

    runningHorse.position.set(
      (canvasWidth - runningHorse.width) / 2,
      canvasHeight - runningHorse.height - gap / 2
    ); //自己的车的初始位置

    runningHorse.animationSpeed = 0.3;

    runningHorse.on('touchstart', (event) => {
      dragFlag = true;
      startPoint = { x: event.data.global.x, y: event.data.global.y };
    });

    runningHorse.on('touchmove', (event) => {
      if (dragFlag) {
        const dx = event.data.global.x - startPoint.x;
        // const dy = event.data.global.y - startPoint.y;
        runningHorse.x += dx;
        // mycarSprite.y += dy;
        startPoint = { x: event.data.global.x, y: event.data.global.y };
      }
    });

    runningHorse.on('touchend', (event) => {
      dragFlag = false;
    });

    gameScene.addChild(runningHorse);
    readyBgm.play();

    // //创建一个游戏结束的场景
    gameOverScene = new Container();
    app.stage.addChild(gameOverScene);

    gameOverScene.x = canvasWidth * 0.13;
    gameOverScene.y = canvasHeight * 0.18;
    gameOverScene.width = canvasWidth - canvasWidth * 0.13 * 2;
    // gameOverScene.width = canvasWidth;

    // gameOverScene.height = canvasHeight - 300;
    gameOverScene.height =
      (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2);

    const gameOverBg = new Sprite(resources.badgeBg.texture);
    gameOverBg.width = canvasWidth - canvasWidth * 0.13 * 2;
    gameOverBg.height = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2);
    gameOverScene.addChild(gameOverBg);

    // //先让游戏结束场景隐藏
    gameOverScene.visible = false;

    // //设置一个默认字体
    let style = new TextStyle({
      wordWrap: true,
      align: 'center',
      fill: '#d6ac5a',
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
        align: 'center',
        fill: '#d6ac5a',
        fontSize: 50,
      })
    );

    scoreText.y =
      (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.65 + 40;

    scoreText.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2;

    //字体中心点用于居中
    scoreText.anchor.set(0.5, 0.5);
    gameOverScene.addChild(scoreText);

    let prizeBtn = new Sprite(resources.prizeBtn.texture);
    prizeBtn.y = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.78;
    prizeBtn.width = 150;
    prizeBtn.height = 60;

    prizeBtn.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2 - 80;
    prizeBtn.interactive = true;
    prizeBtn.on('touchend', () => {
      router.replace({ name: 'Poster' });
    });

    gameOverScene.addChild(prizeBtn);

    let goldBadge = new Sprite(resources.badge1st.texture);

    goldBadge.y = (1569 / 811) * (canvasWidth - canvasWidth * 0.13 * 2) * 0.08;
    goldBadge.width = 200;
    goldBadge.height = 250;

    goldBadge.x = (canvasWidth - canvasWidth * 0.13 * 2) / 2 - 100;

    gameOverScene.addChild(goldBadge);

    setTimeout(() => {
      tipArrow.visible = false;
      tipText.visible = false;
      runningHorse.loop = true;
      runningHorse.gotoAndPlay(0);

      runningHorse.interactive = true;

      state = play;
      app.ticker.maxFPS = 60;

      app.ticker.add((delta) => gameLoop(delta));
    }, 3000);
  }
  let blobWidth = (70 / 375) * canvasWidth;
  function creatEMCar(resources) {
    //设置敌人
    //根据最大 blob 数生成：理论上 1 人 2 石 3 奖 4 金币
    const blobsArr = [
      'coin',
      'stone',
      'coin',
      'prize',
      'coin',
      'prize',
      'coin',
      'prize',
      'coin',
      'whiteHorse',
      'coin',
    ];
    for (let i = 0; i < numberOfBlobs - blobs.length; i++) {
      const randomBlob = blobsArr[randomInt(0, 10)];

      //创建敌车
      let blob =
        randomBlob === `whiteHorse`
          ? new AnimatedSprite(
              new Array(whiteHorseCount).fill(0).map((_item, i) => {
                return resources[`whiteHorse${i + 1}`].texture;
              })
            )
          : new Sprite(resources[randomBlob].texture);
      if (randomBlob === 'coin') {
        blob = new AnimatedSprite(
          new Array(11).fill(0).map((_item, i) => {
            return resources[`coin${i + 1}`].texture;
          })
        );
        blob.animationSpeed = 1.25;
        blob.loop = false;
      }

      blob.width = blobWidth;
      if (randomBlob === 'stone') {
        blob.height = (blobWidth / 238) * 120;
      }
      if (randomBlob === 'coin') {
        blob.height = (blobWidth / 230) * 231;
      }

      if (randomBlob === 'prize') {
        blob.height = (blobWidth / 300) * 400;
      }
      if (randomBlob === 'whiteHorse') {
        blob.width = blobWidth * 1.5;

        blob.height = blobWidth * 2.5;
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

      //将车子加入数组
      blobs.push(blob);

      //渲染
      gameScene.addChild(blob);
    }
  }
  //检查生成的地方车辆是否有重叠
  function checkEMCarPositionHit(blob) {
    for (var i = 0; i < blobs.length; i++) {
      if (hitTestRectangle(blob, blobs[i], { x: 0, y: 200 })) {
        return true;
        break;
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
    if (bgSpeed >= 15) bgSpeed = 15;

    speed += 0.1;
    if (speed >= 12) speed = 12;

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
    if (explorerHit && runningHorse.invl === 0) {
      if (['coin'].includes(lastHit.url) && shouldAddScore) {
        lastHit.blob.onComplete = () => {
          lastHit.blob.visible = false;
        };

        lastHit.blob.gotoAndPlay(0);
        scoreBgm.play();
        score += 10;
      } else if (['prize'].includes(lastHit.url) && shouldAddScore) {
        lastHit.blob.visible = false;
        scoreBgm.play();
        score += 15;
      } else if (['stone'].includes(lastHit.url) && shouldAddScore) {
        //车子图片变更为爆炸
        lastHit.blob.visible = false;

        // mycarSprite.texture = resources["img/boom.png"].texture;
        runningHorse.alpha = 0.3;

        //减血
        if (score > 20) score -= 20;
        hpBgm.play();
        hp--;
        speed = initalSpeed;
        bgSpeed = 1;
        // hpInfo.text = `HP:${hp}`;
        // scoreInfo.text = `${score}`;
      } else if (lastHit.url === `whiteHorse` && shouldAddScore) {
        lastHit.blob.visible = false;

        runningHorse.alpha = 0.3;

        if (score > 40) score -= 40;
        hpBgm.play();

        hp--;
        speed = initalSpeed;
        bgSpeed = 1;
        // hpInfo.text = `HP:${hp}`;
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
      //判断是否血量归零
      if (hp < 1) {
        //抛出游戏结束
        state = endGame;
        endBgm.play();
        scoreText.text = score;
        runningHorse.interactive = false;
      }
      runningHorse.invl = 2; //设置无敌时间
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
        gameScene.removeChildAt(i + 2);
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
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //碰撞检测
  function hitTestRectangle(r1, r2, option = { x: 0, y: 0 }) {
    const { x = 0, y = 0 } = option;

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

    //检查x轴
    if (Math.abs(vx) < combinedHalfWidths + x) {
      //再检查y轴
      if (Math.abs(vy) < combinedHalfHeights + y) {
        //如果是则判断为碰撞
        hit = true;
      } else {
        //否则为没碰撞
        hit = false;
      }
    } else {
      //x轴没有碰撞
      hit = false;
    }

    if (hit && r2.texture.textureCacheIds.length) {
      let id;
      if (r2.texture.textureCacheIds[0].includes(`whiteHorse`)) {
        id = `whiteHorse`;
      } else if (r2.texture.textureCacheIds[0].includes(`coin`)) {
        id = `coin`;
      } else {
        id = r2.texture.textureCacheIds[0];
      }

      shouldAddScore = !(r2.ts === lastHit.ts && lastHit.url === id);

      lastHit = {
        url: id,
        ts: r2.ts,
        blob: r2,
      };
    }

    //传是否碰撞
    return hit;
  }
  //游戏结束显示游戏结束场景，隐藏游戏场景
  function endGame() {
    gameOverScene.visible = true;
  }
});
</script>
<style></style>
