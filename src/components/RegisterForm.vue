<script setup>
import {ref} from 'vue'
import Captcha from './Captcha.vue'
import {registerApi} from '../api/authApi'

// 通知父组件：注册完成，切回登录
const emit = defineEmits(['success', 'toLogin'])

const username = ref('')
const password = ref('')
const captcha = ref('')

const message = ref('')
const loading = ref(false)

const captchaRef = ref(null)

async function register()
{
  message.value = ''
  loading.value = true

  try
  {
    const data = await registerApi({
      username: username.value,
      password: password.value,
      captcha: captcha.value
    })

    if (data.code === 0)
    {
      // message.value = '注册成功，请登录'
      ElMessage.primary('注册成功，请登录')
      emit('success')
      emit('toLogin')
    } else
    {
      // message.value = data.message
      ElMessage.error(data.message)
      captchaRef.value?.loadCaptcha()
    }
  } catch (err)
  {
    ElMessage.error(err.message || '网络错误')
  } finally
  {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 24px; border-radius: 10px; border: 1px solid var(--el-border-color); width: 280px;">
    <h2>注册</h2>

    <el-input
        v-model="username"
        placeholder="用户名"
        style="width: 100%;"
    />

    <el-input
        type="password"
        v-model="password"
        placeholder="密码"
        style="width: 100%; padding-top: 15px;"
    />

    <Captcha v-model="captcha" ref="captchaRef"/>

    <el-button
        @click="register"
        :disabled="loading"
        style="margin-top: 12px; width: 100%;"
    >
      {{ loading ? '注册中...' : '注册' }}
    </el-button>

<!--    <p v-if="message" style="color: red; margin-top: 8px;">-->
<!--      {{ message }}-->
<!--    </p>-->

    <p>
      已有账号？
      <router-link to="/login">去登录</router-link>
    </p>
  </div>
</template>
