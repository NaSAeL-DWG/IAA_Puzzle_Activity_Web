// 认证服务 - Token管理
const TOKEN_KEY = 'x-token'

export const authService = {
  // 获取Token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // 保存Token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  // 清除Token
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
  },

  // 检查是否已登录
  isLoggedIn: () => {
    return !!authService.getToken()
  },

  // 验证Token有效性（简单检查）
  validateToken: (token) => {
    return token && token.length > 0 && token.length <= 35
  }
}
