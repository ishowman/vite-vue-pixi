<template>
  <div ref="game"></div>
</template>

<script lang="ts" setup>
import * as PIXI from 'pixi.js-legacy';
import { ref, onMounted } from 'vue';
// import preBg from '@/assets/index/bg.png';
// import bgUrl from '@/assets/img/bg.png';
import outerBg from '@/assets/img/outer-bg.png';
import infoUrl from '@/assets/img/info.png';
import coinUrl from '@/assets/img/coin.png';
import stoneUrl from '@/assets/img/stone.png';
import prizeUrl from '@/assets/img/prize.png';

import { useRouter } from 'vue-router';
const router = useRouter();

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
  let initalSpeed = 12;
  let speed = initalSpeed;

  const gap = 50;

  //设置要用到的变量
  let state,
    gameScene,
    gameOverScene,
    message,
    bg,
    mycarSprite,
    blobs = [],
    numberOfBlobs,
    score,
    hp,
    runningHorse;
  numberOfBlobs = 2; //初始化最大敌车数量

  score = 0; //初始化分数
  hp = 3; //初始化HP
  let shouldAddScore = true;
  let scoreInfo, hpInfo;
  const horseCourt = 20;

  const contentX = 10;
  const contentY = 50;

  //加载素材图片
  app.loader
    .add(`bg`, `/bg_caodi.webp`)
    .add(`coin`, coinUrl)
    .add(`stone`, stoneUrl)
    .add(`prize`, prizeUrl)
    // .add(`myHorse`, 'img/myHorse.png')
    .add(`outerBg`, outerBg)
    // .add(`preBg`, preBg)
    // .add(`playBtn`, preBg)
    .add(`info`, infoUrl);

  for (let i = 1; i <= horseCourt; i++) {
    app.loader.add(`horse${i}`, `/blueHorse/ld${i}.png`);
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

    bg.x = contentX;
    bg.y = contentY;
    // bg.width = canvasWidth - gap;
    bg.width = canvasWidth - contentX * 2;

    // bg.height = canvasHeight - 160;
    bg.height = canvasHeight;

    bg.tileScale.set(0.55, 0.65);
    // bg.tileScale.set( (canvasWidth- contentX*2)*2/1170, canvasHeight*2/2340);

    gameScene.addChild(bg);

    // // 分数
    let infoBar = new Sprite(resources.info.texture);
    infoBar.x = contentX;
    infoBar.y = 10;

    infoBar.width = canvasWidth - contentX * 2;
    infoBar.height = 100;
    infoBar.zIndex = 99;

    gameScene.addChild(infoBar);

    // hp info
    hpInfo = new Text(`HP:${hp}`, { fontSize: '24px', fill: '#d6ac5a' });
    hpInfo.x = canvasWidth - 150;
    hpInfo.y = 65;
    hpInfo.zIndex = 100;

    gameScene.addChild(hpInfo);
    // score info
    scoreInfo = new Text(`${score}`, { fontSize: '24px', fill: '#d6ac5a' });
    // scoreInfo.x = 350;
    scoreInfo.x = 150;

    scoreInfo.y = 65;
    scoreInfo.zIndex = 100;
    gameScene.addChild(scoreInfo);

    runningHorse = new AnimatedSprite(
      new Array(horseCourt).fill(0).map((_item, i) => {
        return resources[`horse${i + 1}`].texture;
      })
    );
    runningHorse.animationSpeed = 0.3;
    // runningHorse.width = 250; //自己的车宽度
    // runningHorse.height = 500; //高度
    runningHorse.width = 120; //自己的车宽度
    runningHorse.height = 260; //高度
    runningHorse.vy = 0; //y轴加速度
    runningHorse.vx = 0; //x轴加速度
    runningHorse.invl = 0; //初始化无敌时间

    runningHorse.position.set(
      (canvasWidth - runningHorse.width) / 2,
      canvasHeight - runningHorse.height - gap / 2
    ); //自己的车的初始位置

    runningHorse.loop = true;
    runningHorse.gotoAndPlay(0);

    runningHorse.interactive = true;

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

    // //创建一个游戏结束的场景
    gameOverScene = new Container();
    app.stage.addChild(gameOverScene);

    // gameOverScene.x = 100;
    // gameOverScene.y = 400;
    // gameOverScene.width = canvasWidth - 200;
    gameOverScene.width = canvasWidth;

    // gameOverScene.height = canvasHeight - 500;
    gameOverScene.height = canvasHeight;

    // const gameOverBg = new Sprite(resources.preBg.texture);
    // gameOverBg.width = canvasWidth - 200;
    // gameOverBg.height = canvasHeight - 500;
    // gameOverScene.addChild(gameOverBg);

    // //先让游戏结束场景隐藏
    // gameOverScene.visible = false;

    // //设置一个默认字体
    let style = new TextStyle({
      wordWrap: true,
      align: 'center',
      fill: '#d6ac5a',
      fontSize: 30,
    });
    message = new Text('', style);
    message.y = canvasHeight / 2 - 50;
    message.x = canvasWidth / 2;
    //字体中心点用于居中
    message.anchor.set(0.5, 0.5);
    gameOverScene.addChild(message);

    //一个存地方车辆的数组
    // blobs = [];

    state = play;
    app.ticker.add((delta) => gameLoop(delta));
  }
  function creatEMCar(resources) {
    //设置敌人
    //根据最大 blob 数生成：理论上石头概率接近 1/5
    const blobsArr = ['stone', 'coin', 'prize', 'coin', 'prize'];
    for (let i = 0; i < numberOfBlobs - blobs.length; i++) {
      //创建敌车
      let blob = new Sprite(resources[blobsArr[randomInt(0, 4)]].texture);
      blob.width = 70;
      blob.height = 70;
      blob.ts = new Date().getTime();
      let EMCarIsHit = true;
      while (EMCarIsHit) {
        //随机车子x坐标在画布外
        // let x = randomInt(250, 500);
        let y = randomInt(-(canvasHeight + speed), -1.5 * canvasHeight);

        //随机y坐标在画布范围内
        const minX = 80;
        let xAreas = [
          minX / 2 + 10,
          (canvasWidth - minX) / 2,
          canvasWidth - minX - 10,
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
      if (hitTestRectangle(blob, blobs[i])) {
        return true;
        break;
      }
    }
  }
  function gameLoop(delta) {
    //更新游戏场景:
    state(delta);
  }
  function play(delta) {
    //背景移动
    bg.tilePosition.y += 10;
    //移动赛车
    // runningHorse.x += runningHorse.vx;
    // runningHorse.y += runningHorse.vy;
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
      numberOfBlobs = 2 + Math.floor(score / 50);
      speed = initalSpeed + Math.floor(score / 50);
      if (numberOfBlobs > 6) {
        numberOfBlobs = 6;
      }
    }
    //如果发生碰撞且在无敌时间之外
    if (explorerHit && runningHorse.invl === 0) {
      if (['coin', 'prize'].includes(lastHit.url) && shouldAddScore) {
        score += 10;
        scoreInfo.text = `${score}`;
      } else if (['stone'].includes(lastHit.url) && shouldAddScore) {
        //车子图片变更为爆炸
        // mycarSprite.texture = resources["img/boom.png"].texture;
        //减血
        if (score > 0) score -= 1;
        hp--;
        speed = initalSpeed;
        // document.getElementById('hp').innerHTML = String(hp);
        hpInfo.text = `HP:${hp}`;
        scoreInfo.text = `${score}`;
      }
      hitRecords.push(lastHit);
      //判断是否血量归零
      if (hp < 1) {
        //抛出游戏结束
        state = end;
        message.text = `
       获得分数： ${score}
      `;
        runningHorse.interactive = false;
      }
      runningHorse.invl = 20; //设置无敌时间
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
  function hitTestRectangle(r1, r2) {
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

    //检查x轴是否充电
    if (Math.abs(vx) < combinedHalfWidths) {
      //再检查y轴
      if (Math.abs(vy) < combinedHalfHeights) {
        //如果是则判断为碰撞
        hit = true;
        r2.visible = false;
      } else {
        //否则为没碰撞
        hit = false;
      }
    } else {
      //x轴没有碰撞
      hit = false;
    }

    if (hit && r2.texture.textureCacheIds.length) {
      shouldAddScore = !(
        r2.ts === lastHit.ts && lastHit.url === r2.texture.textureCacheIds[0]
      );

      lastHit = {
        url: r2.texture.textureCacheIds[0],
        ts: r2.ts,
      };
    }

    //传是否碰撞
    return hit;
  }
  //游戏结束显示游戏结束场景，隐藏游戏场景
  function end() {
    // gameScene.visible = false;
    gameOverScene.visible = true;
  }
});
</script>
<style></style>
