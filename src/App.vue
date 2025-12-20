<script setup>
import { useDark, usePreferredDark } from "@vueuse/core";

// 获取用户浏览器是否启用深色模式
const isDark = usePreferredDark()
const use = useDark()
// 将组件样式切换为用户浏览器样式
use.value = isDark.value;
</script>

<template>
  <div>
    <router-view/>
  </div>
</template>
