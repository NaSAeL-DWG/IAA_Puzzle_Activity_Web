// API服务配置和基础函数
// 使用相对路径，通过Vite代理转发到后端
const API_BASE = '' // 空字符串，使用相对路径

// 封装fetch请求
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  
  console.log('API Request:', { url, options }) // 调试日志

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'omit',
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const response = await fetch(url, mergedOptions)
    
    console.log('API Response:', { status: response.status, url }) // 调试日志
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      // 创建包含detail信息的错误对象
      const error = new Error(errorData.detail || `HTTP ${response.status}`)
      error.detail = errorData.detail
      error.status = response.status
      throw error
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// 用户相关API
export const userAPI = {
  // 创建用户
  createUser: (stuId) => 
    apiRequest('/api/user/create_user', {
      method: 'POST',
      headers: { 'stu-id': stuId }
    }),

  // 用户登录
  login: (stuId) =>
    apiRequest('/api/user/login', {
      method: 'POST',
      headers: { 'stu-id': stuId }
    }),

  // 查询用户进度
  getUserProgress: (token) =>
    apiRequest('/api/puzzle/get_user_puzzled', {
      method: 'POST',
      headers: { 'x-token': token }
    }),

  // 查询封禁信息
  getBanInfo: (token) =>
    apiRequest('/api/user/ban_info', {
      method: 'POST',
      headers: { 'x-token': token }
    })
}

// 题目相关API
export const puzzleAPI = {
  // 获取题目
  getPuzzle: (puzzleId, token) =>
    apiRequest(`/api/puzzle/get_puzzle?puzzle_id=${puzzleId}&x_token=${token}`, {
      method: 'GET'
    }),

  // 验证答案 - 使用URL编码处理中文和特殊字符
  checkAnswer: (puzzleId, token, answer) => {
    // 使用encodeURIComponent对答案进行URL编码
    // 这样可以安全传输中文、特殊字符等
    const encodedAnswer = encodeURIComponent(answer)
    
    return apiRequest(`/api/puzzle/check_answer?puzzle_id=${puzzleId}`, {
      method: 'POST',
      headers: { 
        'x-token': token,
        'answer': encodedAnswer
      }
    })
  }
}

// 导出API基础地址，供其他地方使用
export { API_BASE }
