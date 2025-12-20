<script setup>
import {ref} from 'vue'
import Captcha from './Captcha.vue'
import {loginApi} from '../api/authApi'
import router from "@/router/index.js";

// test
const username = ref('')
const password = ref('')
const captcha = ref('')

// const message = ref('')
const loading = ref(false)

const captchaRef = ref(null)

// 登录
async function login()
{
  // message.value = ''
  loading.value = true
  // 校验输入
  console.log('提交时 captcha =', captcha.value)
  if (!username.value || !password.value || !captcha.value)
  {
    ElMessage.error('请填写完整信息')
    loading.value = false;
    return
  }

  try
  {
    // 校验登录信息
    const data = await loginApi({
      username: username.value,
      password: password.value,
      captcha: captcha.value
    })

    // 登录成功，跳转到欢迎界面
    if (data.code === 0)
    {
      // 保存token
      localStorage.setItem('token', data.data.token)
      await router.push('/welcome')
    } else
    {
      // message.value = data.message
      ElMessage.error(data.message)
      await captchaRef.value?.loadCaptcha()
    }
  } catch (err)
  {
    // message.value = err.message || '网络错误'
    ElMessage.error(err.message || '网络错误')
  } finally
  {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 24px; border-radius: 10px; border: 1px solid var(--el-border-color); width: 280px;">
    <h2>登录</h2>

    <el-input
        v-model="username"
        placeholder="用户名"
        style="width: 100%;"
    />

    <el-input
        type="password"
        v-model="password"
        placeholder="密码"
        style="padding-top: 15px; width: 100%;"
    />

    <Captcha v-model="captcha" ref="captchaRef"/>

    <el-button
        @click="login"
        :disabled="loading"
        style="margin-top: 12px; width: 100%;"
    >
      {{ loading ? '登录中...' : '登录' }}
    </el-button>

<!--    <p v-if="message" style="color: red; margin-top: 8px;">-->
<!--      {{ message }}-->
<!--    </p>-->

    <p>
      还没有账号？
      <router-link to="/register">去注册</router-link>
    </p>
  </div>

</template>
