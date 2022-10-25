<template>
  <!-- {{sc.w}} {{sc.h}} -->
  <!-- 这里应该隐藏起来  -->
  <div :style="{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sc.w + 'px',
    height: sc.h + 'px',
    background: 'rgba(0,0,0, 0.2)'
  }">
    <div :style="{
    width: sc.w* 0.8 + 'px',
    height: sc.h * 0.4 + 'px',
    position: 'relative',
    overflowY: 'scroll'
  }">
    <img
    :src="testUrl"
    v-if="testUrl"
    :style="{
        position: 'absolute',
        left:0,
        right:0,
        width: sc.w* 0.8 + 'px',
        height: sc.h* 0.8 + 'px',
        zIndex: 100,
    }"
  />
  </div>
  </div>
  
  <!-- 这里其实就是实现一个zIndex 最大 同-->
  <div :style="{
    position: 'absolute',
    overflowX: 'hidden',
    width: sc.w + 'px',
    height: sc.h +'px'
  }">
  <div :style="{
    position: 'absolute',
    left: -sc.w + 'px', 
    right:0,
    width: sc.w + 'px',
    height: sc.h+ 'px',
  }" id="html2canvas">
     <img src="poster/jin.png" :style="{
      position: 'absolute',
      left: sc.w * 0.1411 + 'px',
      top: sc.h * 0.09 + 'px',
      width: sc.w * 0.2521 + 'px',
      height: sc.h * 0.1688 + 'px',
      zIndex: 8
     }">
     <img src="poster/bg.png" :style="{
      position: 'absolute',
      left: 0,
      right: 0,
      width: sc.w+ 'px',
      height: sc.h+ 'px',
     }">
     <img src="poster/poster.png" :style="{
        width: parseInt(sc.w) * 0.82  + 'px',
        height: (parseInt(sc.w) / 869) * 1543 + 'px',
        position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        top: (parseInt(sc.w) / 869) * 1543 * 0.08 + 'px'
     }">
    <img src="poster/get-poster-text.png" :style="{
      position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.32 + 'px',
        width: sc.w * 0.32 + 'px',
        height: sc.h * 0.038 + 'px'
    }">
    <img src="poster/squre.png" :style="{
        width: sc.w * 0.58 + 'px',
        height: sc.h * 0.089 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 'px',
        position:'absolute',
        left: 0,
        right: 0,
        margin: 'auto',
    }"/>
    <img src="poster/footer-logo.png" :style="{
        position:'absolute',
        left: sc.w * 0.0538 + 'px',
        bottom: '10px',
        margin: 'auto',
        width:  '82.5px',
        height: '104px',
      }">
      <img src="poster/scan.png" :style="{
        position: 'absolute',
        margin: 'auto',
        left: 0,
        right: 0,
        bottom:  '20px',
        width: sc.w * 0.35 + 'px',
        height: sc.h * 0.0316 + 'px'
      }">
      <!-- 图标 金银铜 -->
      <img src="poster/jin.png" :style="{
        width: sc.w * 0.1486 + 'px',
        height: sc.w * 0.1486 + 'px',
        backgroundSize: '100%',
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 4+ 'px',
        position:'absolute',
        left: sc.w * 0.25 + 'px',
        margin: 'auto',
      }">
      <div :style="{
        bottom: (parseInt(sc.w) / 869) * 1543 * 0.19 + 24+ 'px',
        position:'absolute',
        left: sc.w * 0.425 + 'px',
        margin: 'auto',
        fontWeight: 500,
        fontSize: '30.34px',
        color: '#FFFFFF' ,
      }">金牌奖品</div>
      <img src="poster/qrcode.png" :style="{
        width: sc.w * 0.18 + 'px',
        height: sc.w * 0.18 + 'px',
        position:'absolute',
        right: sc.w * 0.059 + 'px',
        bottom:  '20px'
      }">
  </div>
  </div>
  
</template>
<script setup>
import * as PIXI from 'pixi.js-legacy';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas'
const poster = ref('');
const testUrl = ref('')
const router = useRouter();

const imgUrl = ref('');
const sc = ref({
  w: window.innerWidth,
  h: window.innerHeight
})
// console.log(sc.value.w, sc.value.h)
onMounted(() => {  
  // let Application = PIXI.Application,
  //   Container = PIXI.Container,
  //   resources,
  //   TextureCache = PIXI.utils.TextureCache,
  //   Sprite = PIXI.Sprite,
  //   Text = PIXI.Text,
  //   TextStyle = PIXI.TextStyle;
  // let canvasWidth = window.innerWidth,
  //   canvasHeight = window.innerHeight;
  
  // //创建一个pixi应用
  // let app = new Application({
  //   width: canvasWidth,
  //   height: canvasHeight,
  //   antialiasing: true,
  //   forceCanvas: true,
  // });
  // poster.value.appendChild(app.view);

  // app.loader
  //   .add(`bg`, 'poster/bg.png')
  //   .add(`poster`, 'poster/poster.png')
  //   .add(`btnAward`, 'poster/btn-award.png')
  //   .add(`btnShare`, 'poster/btn-share.png');

  // app.loader.load((_loader, _resources) => {
  //   resources = _resources;
  //   setup(_resources);
  // });

  // function setup(resources) {
  //   //设置游戏场景容器
  //   let gameScene = new Container();
  //   app.stage.addChild(gameScene);
  //   //设置背景
  //   let bgSprite = new Sprite(resources.bg.texture);
  //   bgSprite.width = canvasWidth;
  //   bgSprite.height = canvasHeight;
  //   gameScene.addChild(bgSprite);

  //   let posterSprite = new Sprite(resources.poster.texture);
  //   const posterWidth = canvasWidth * 0.82;
  //   posterSprite.width = posterWidth;
  //   posterSprite.height = (posterWidth / 869) * 1543;
  //   posterSprite.x = 0.1 * canvasWidth;
  //   posterSprite.y = (canvasHeight - (posterWidth / 869) * 1543) * 0.7;

  //   gameScene.addChild(posterSprite);

  //   const fontSize = (30 / 375) * canvasWidth;
  //   let text = new Text(`恭喜获得`, {
  //     fontSize: `${fontSize}px`,
  //     fill: '#fff',
  //     align: 'center',
  //   });
  //   text.y = posterSprite.height * 0.7 + posterSprite.y;
  //   text.x = posterSprite.x + posterWidth * 0.3;

  //   gameScene.addChild(text);

  //   let btnShare = new Sprite(resources.btnShare.texture);
  //   btnShare.width = (120 / 375) * canvasWidth;
  //   btnShare.height = (btnShare.width / 375) * 143;
  //   btnShare.y =
  //     posterSprite.height * 0.97 + posterSprite.y - btnShare.height / 2;
  //   btnShare.x = posterSprite.x + posterWidth * 0.53;
  //   btnShare.interactive = true;
  //   btnShare.on('touchend', () => {
  //     takeScreenshot();
  //   });

  //   gameScene.addChild(btnShare);

  //   let btnAward = new Sprite(resources.btnAward.texture);
  //   btnAward.width = (120 / 375) * canvasWidth;
  //   btnAward.height = (btnShare.width / 375) * 143;
  //   btnAward.y =
  //     posterSprite.height * 0.97 + posterSprite.y - btnShare.height / 2;
  //   btnAward.x = posterSprite.x + posterWidth * 0.06;
  //   btnAward.interactive = true;
  //   btnAward.on('touchend', () => {
  //     router.replace({ name: 'Prize' });
  //   });

  //   gameScene.addChild(btnAward);

  //   // app.renderer.plugins.interaction.on('pointerdown', takeScreenshot);
  // }

  // function takeScreenshot() {
  //   const url = app.renderer.plugins.extract
  //     .canvas(app.stage)
  //     // .toBlob((b) => {
  //     //   // const a = document.createElement('a');
  //     //   // document.body.append(a);
  //     //   // a.download = 'screenshot';
  //     //   // a.href = URL.createObjectURL(b);
  //     //   console.log(`URL.createObjectURL(b)`, URL.createObjectURL(b));
  //     //   imgUrl.value = URL.createObjectURL(b);
  //     //   // a.click();
  //     //   // a.remove();
  //     // }, 'image/png');
  //     .toDataURL('image/png', 1);
  //   console.log('url', url);
  //   imgUrl.value = url;
  // }
  setTimeout(() => {

      // #capture 就是我们要获取截图对应的 DOM 元素选择器
          html2canvas(document.querySelector('#html2canvas'), {
            height: sc.value.h,
            width: sc.value.w,
            useCORS: true, // 【重要】开启跨域配置
            scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
            allowTaint: true, // 允许跨域图片
          }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            testUrl.value = imgData
            // resolve(imgData);
          });
        }, 300); 
});
</script>
