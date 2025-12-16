<script setup>
import { ref } from 'vue'
import Captcha from './Captcha.vue'
import { registerApi } from '../api/authApi'

// 通知父组件：注册完成，切回登录
const emit = defineEmits(['success', 'toLogin'])

const username = ref('')
const password = ref('')
const captcha = ref('')

const message = ref('')
const loading = ref(false)

const captchaRef = ref(null)

async function register() {
  message.value = ''
  loading.value = true

  try {
    const data = await registerApi({
      username: username.value,
      password: password.value,
      captcha: captcha.value
    })

    if (data.code === 0) {
      message.value = '注册成功，请登录'
      emit('success')
      emit('toLogin')
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
    <h2>注册</h2>

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
      @click="register"
      :disabled="loading"
      style="margin-top: 12px; width: 100%;"
    >
      {{ loading ? '注册中...' : '注册' }}
    </button>

    <p v-if="message" style="color: red; margin-top: 8px;">
      {{ message }}
    </p>

    <p style="margin-top: 8px;">
      已有账号？
      <a href="#" @click.prevent="emit('toLogin')">去登录</a>
    </p>
  </div>
</template>
