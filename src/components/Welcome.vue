<script setup>
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import {getMeApi} from "@/api/authApi.js";

const user = ref(null)

// 退出登录
const logout =()=>
{
  localStorage.removeItem('token')
  user.value = null
  router.push('/login')
}

// 检查登录状态
async function fetchMe()
{
  try
  {
    // 通过本机token尝试访问
    const res = await getMeApi()
    // 访问成功
    if (res.code === 0)
    {
      user.value = res.data
    } else // 用户未登录/用户登录信息过期
    {
      logout()
    }
  } catch
  {
    logout()
  }
}

onMounted(() =>
{
  fetchMe()
})

</script>

<template>
  <div>
    <h2 v-if="user !== null">欢迎你，{{ user.username }}</h2>
    <el-button @click="logout">退出登录</el-button>
  </div>
</template>

<style scoped>

</style>