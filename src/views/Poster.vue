<template>
  <div ref="poster" v-show="!imgUrl"></div>
  <img
    :src="imgUrl"
    v-if="imgUrl"
    :style="{
      width: canvasWidth,
      height: canvasHeight,
      zIndex: 99,
    }"
  />
</template>
<script setup>
import * as PIXI from 'pixi.js-legacy';
import { ref, onMounted } from 'vue';
const poster = ref('');

const imgUrl = ref('');

onMounted(() => {
  let Application = PIXI.Application,
    Container = PIXI.Container,
    resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;
  let canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;

  //创建一个pixi应用
  let app = new Application({
    width: canvasWidth,
    height: canvasHeight,
    antialiasing: true,
    forceCanvas: true,
  });
  poster.value.appendChild(app.view);

  app.loader
    .add(`bg`, 'poster/bg.png')
    .add(`poster`, 'poster/poster.png')
    .add(`btnAward`, 'poster/btn-award.png')
    .add(`btnShare`, 'poster/btn-share.png');

  app.loader.load((_loader, _resources) => {
    resources = _resources;
    setup(_resources);
  });

  function setup(resources) {
    //设置游戏场景容器
    let gameScene = new Container();
    app.stage.addChild(gameScene);
    //设置背景
    let bgSprite = new Sprite(resources.bg.texture);
    bgSprite.width = canvasWidth;
    bgSprite.height = canvasHeight;
    gameScene.addChild(bgSprite);

    let posterSprite = new Sprite(resources.poster.texture);
    const posterWidth = canvasWidth * 0.82;
    posterSprite.width = posterWidth;
    posterSprite.height = (posterWidth / 869) * 1543;
    posterSprite.x = 0.1 * canvasWidth;
    posterSprite.y = (canvasHeight - (posterWidth / 869) * 1543) * 0.7;

    gameScene.addChild(posterSprite);

    const fontSize = (30 / 375) * canvasWidth;
    let text = new Text(`恭喜获得`, {
      fontSize: `${fontSize}px`,
      fill: '#fff',
      align: 'center',
    });
    text.y = posterSprite.height * 0.7 + posterSprite.y;
    text.x = posterSprite.x + posterWidth * 0.3;

    gameScene.addChild(text);

    let btnShare = new Sprite(resources.btnShare.texture);
    btnShare.width = (120 / 375) * canvasWidth;
    btnShare.height = (btnShare.width / 375) * 143;
    btnShare.y =
      posterSprite.height * 0.97 + posterSprite.y - btnShare.height / 2;
    btnShare.x = posterSprite.x + posterWidth * 0.53;
    gameScene.addChild(btnShare);

    let btnAward = new Sprite(resources.btnAward.texture);
    btnAward.width = (120 / 375) * canvasWidth;
    btnAward.height = (btnShare.width / 375) * 143;
    btnAward.y =
      posterSprite.height * 0.97 + posterSprite.y - btnShare.height / 2;
    btnAward.x = posterSprite.x + posterWidth * 0.06;
    gameScene.addChild(btnAward);

    // app.renderer.plugins.interaction.on('pointerdown', takeScreenshot);
    takeScreenshot();
  }

  function takeScreenshot() {
    const url = app.renderer.plugins.extract
      .canvas(app.stage)
      // .toBlob((b) => {
      //   // const a = document.createElement('a');
      //   // document.body.append(a);
      //   // a.download = 'screenshot';
      //   // a.href = URL.createObjectURL(b);
      //   console.log(`URL.createObjectURL(b)`, URL.createObjectURL(b));
      //   imgUrl.value = URL.createObjectURL(b);
      //   // a.click();
      //   // a.remove();
      // }, 'image/png');
      .toDataURL('image/png', 1);
    console.log('url', url);
    imgUrl.value = url;
  }
});
</script>
