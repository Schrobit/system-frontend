<script setup>
import { ref, onMounted } from 'vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import { getMeApi } from './api/authApi'

const isLogin = ref(false)
const user = ref(null)

// login / register
const mode = ref('login')

async function fetchMe() {
  try {
    const res = await getMeApi()
    if (res.code === 0) {
      user.value = res.data
      isLogin.value = true
    } else {
      logout()
    }
  } catch {
    logout()
  }
}

function logout() {
  localStorage.removeItem('token')
  user.value = null
  isLogin.value = false
  mode.value = 'login'
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    fetchMe()
  }
})

function onLoginSuccess() {
  fetchMe()
}
</script>

<template>
  <div style="padding: 40px;">
    <!-- 未登录 -->
    <div v-if="!isLogin">
      <LoginForm
        v-if="mode === 'login'"
        @success="onLoginSuccess"
        @toRegister="mode = 'register'"
      />

      <RegisterForm
        v-else
        @toLogin="mode = 'login'"
      />
    </div>

    <!-- 已登录 -->
    <div v-else>
      <h2>欢迎你，{{ user.username }}</h2>
      <button @click="logout">退出登录</button>
    </div>
  </div>
</template>
