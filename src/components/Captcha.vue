<script setup>
import {ref, onMounted} from 'vue'
import {API_BASE_URL} from '../config'

// 明确接收父组件的值
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// 明确告诉父组件怎么更新
const emit = defineEmits(['update:modelValue'])

const captchaSvg = ref('')

// 获取验证码
async function loadCaptcha()
{
  // ⭐ 刷新验证码时，清空父组件的 captcha
  emit('update:modelValue', '')

  const res = await fetch(`${API_BASE_URL}/api/auth/captcha`, {
    credentials: 'include'
  })
  captchaSvg.value = await res.text()
}

const captchaTest = ref('')

// 输入框变化时，同步给父组件
function onInput(e)
{
  console.log(captchaTest.value)
  emit('update:modelValue', captchaTest.value)
}

defineExpose({
  loadCaptcha
})

onMounted(() =>
{
  loadCaptcha()
})
</script>

<template>
  <div style="display: flex; gap: 8px; align-items: center;">
    <el-input
        id="captcha"
        v-model="captchaTest"
        :value="modelValue"
        @input="onInput"
        placeholder="验证码"
        style="width: 100px;"
    />
    <span
        v-html="captchaSvg"
        style="cursor: pointer;"
        @click="loadCaptcha"
    ></span>
  </div>
</template>