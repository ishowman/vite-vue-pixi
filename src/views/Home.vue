<template>
  <button @click="play()">play</button>
</template>

<script lang="ts" setup>
import {  useRouter } from 'vue-router';
const router = useRouter();

function play() {
  router.push({ name: 'Game' });
}
</script>
