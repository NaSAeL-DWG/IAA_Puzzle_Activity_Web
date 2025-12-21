// 工具函数

// 延迟函数
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 验证学号格式
export const validateStuId = (stuId) => {
  if (!stuId || stuId.length === 0) {
    return { valid: false, message: '请输入学号' }
  }
  if (stuId.length > 16) {
    return { valid: false, message: '学号最多16位' }
  }
  return { valid: true }
}

// 验证答案格式
export const validateAnswer = (answer) => {
  if (!answer || answer.trim().length === 0) {
    return { valid: false, message: '请输入答案' }
  }
  return { valid: true }
}

// 格式化错误消息
export const formatErrorMessage = (error) => {
  // 如果错误对象包含后端返回的detail信息
  if (error.detail) {
    return `网络错误：${error.detail}`
  }
  
  // 如果错误消息包含HTTP状态码
  if (error.message.includes('HTTP')) {
    // 尝试提取JSON错误信息
    try {
      // 从错误消息中提取JSON部分
      const jsonMatch = error.message.match(/\{.*\}/)
      if (jsonMatch) {
        const errorData = JSON.parse(jsonMatch[0])
        if (errorData.detail) {
          return `网络错误：${errorData.detail}`
        }
      }
    } catch (e) {
      // JSON解析失败，使用原始消息
    }
    return `网络错误：${error.message}`
  }
  
  // 其他错误
  return `网络错误：${error.message || '请稍后重试'}`
}

// 检查关卡是否可玩
export const canPlayLevel = (userProgress, level) => {
  if (!userProgress) return level === 1
  return level <= userProgress.last_level + 1
}

// 检查关卡是否已完成
export const isLevelCompleted = (userProgress, level) => {
  if (!userProgress) return false
  return level <= userProgress.last_level
}

// 获取关卡状态
export const getLevelStatus = (userProgress, level) => {
  if (isLevelCompleted(userProgress, level)) {
    return 'completed'
  }
  if (canPlayLevel(userProgress, level)) {
    return 'current'
  }
  return 'locked'
}

// 生成烟花配置
export const generateFireworkConfig = (count = 30) => {
  const fireworks = []
  for (let i = 0; i < count; i++) {
    fireworks.push({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 60 + 10,
      delay: Math.random() * 2
    })
  }
  return fireworks
}
