import { API_BASE_URL } from '../config'

/**
 * 统一请求方法
 * 设计目标：
 * 1. 永远正确发送 JSON
 * 2. 永远携带 token（如果有）
 * 3. 永远携带 cookie（session / captcha）
 * 4. 行为确定、可预测
 */
export async function request(url, options = {}) {
  const method = options.method || 'GET'
  const body = options.body

  // ⭐ 协议级 headers：由 request 层完全控制
  const headers = {
    'Content-Type': 'application/json'
  }

  // ⭐ 自动携带 token（JWT）
  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    console.log('🚀 request body =', body)
    response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers,
      credentials: 'include', // ⭐ 必须：session / captcha
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch (networkError) {
    // 网络层错误（如断网、后端未启动）
    throw new Error('网络错误，请检查后端服务是否启动')
  }

  // ⭐ 尝试解析返回数据
  let data
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  // ⭐ HTTP 层错误（非 2xx）
  if (!response.ok) {
    const message =
      data && data.message
        ? data.message
        : `请求失败（HTTP ${response.status})`

    throw new Error(message)
  }

  // ⭐ 业务层错误（code != 0）
  if (data && typeof data === 'object' && 'code' in data && data.code !== 0) {
    throw new Error(data.message || '业务处理失败')
  }

  return data
}
