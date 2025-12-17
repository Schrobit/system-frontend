<script setup>
import { ref } from 'vue'
import Captcha from './Captcha.vue'
import { loginApi } from '../api/authApi'   

// 通知父组件“登录成功”
const emit = defineEmits(['success', 'toRegister'])

// test
const username = ref('')
const password = ref('')
const captcha = ref('')

const message = ref('')
const loading = ref(false)

const captchaRef = ref(null)

async function login() {
  message.value = ''
  loading.value = true
  // 校验输入
  console.log('提交时 captcha =', captcha.value)
  if (!username.value || !password.value || !captcha.value) {
    message.value = '请填写完整信息'
    return
  }

  try {
    const data = await loginApi({
        username: username.value,
        password: password.value,
        captcha: captcha.value
    })

    if (data.code === 0) {
      localStorage.setItem('token', data.data.token)
      emit('success')
    } else {
      message.value = data.message
      captchaRef.value?.loadCaptcha()
    }
  } catch (err) {
    message.value = err.message || '网络错误'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 24px; border: 1px solid #ddd; width: 280px;">
    <h2>登录</h2>

    <input
      v-model="username"
      placeholder="用户名"
      style="display: block; margin-bottom: 8px; width: 100%;"
    />

    <input
      type="password"
      v-model="password"
      placeholder="密码"
      style="display: block; margin-bottom: 8px; width: 100%;"
    />

    <Captcha v-model="captcha" ref="captchaRef" />

    <button
      @click="login"
      :disabled="loading"
      style="margin-top: 12px; width: 100%;"
    >
      {{ loading ? '登录中...' : '登录' }}
    </button>

    <p v-if="message" style="color: red; margin-top: 8px;">
      {{ message }}
    </p>
  </div>

  <p style="margin-top: 8px;">
    还没有账号？
    <a href="#" @click.prevent="emit('toRegister')">去注册</a>
  </p>
</template>
