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
  poster.value.appendChild(app.view);

  app.loader.add(`bg`, 'poster/bg.png').add(`btnShare`, 'poster/btn-share.png');

  app.loader.load((_loader, _resources) => {
    resources = _resources;
    setup(_resources);
  });

  function setup(resources) {
    //设置游戏场景容器
    let gameScene = new Container();
    // gameScene.sortableChildren = true;
    app.stage.addChild(gameScene);
    // gameScene.visible
    //设置背景
    let bgSprite = new Sprite(resources.bg.texture);
    bgSprite.width = canvasWidth;
    bgSprite.height = canvasHeight;
    gameScene.addChild(bgSprite);

    let btnShare = new Sprite(resources.btnShare.texture);
    btnShare.width = 100;
    btnShare.height = 100;
    gameScene.addChild(btnShare);

    // app.renderer.plugins.interaction.on('pointerdown', takeScreenshot);
    takeScreenshot();
  }

  function takeScreenshot() {
    // wait = true;
    app.renderer.plugins.extract.canvas(app.stage).toBlob((b) => {
      // const a = document.createElement('a');
      // document.body.append(a);
      // a.download = 'screenshot';
      // a.href = URL.createObjectURL(b);
      console.log(`URL.createObjectURL(b)`, URL.createObjectURL(b));
      imgUrl.value = URL.createObjectURL(b);
      // a.click();
      // a.remove();
    }, 'image/png');
  }
});
</script>
