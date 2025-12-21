// 应用状态管理
import { ref, reactive, computed } from 'vue'
import { authService } from '../services/auth'

// 全局状态
const state = reactive({
  currentView: 'login', // login, puzzle, summary, end, ban
  token: authService.getToken(),
  stuId: '',
  currentPuzzleId: 1,
  puzzleData: null,
  userProgress: null,
  isLoading: false,
  isBanned: false, // 封禁状态
  
  // 消息窗口状态
  messageWindow: {
    visible: false,
    message: '',
    type: 'info',
    duration: 5000,
    showClose: true,
    showOptions: false
  },
  
  // 侧边提示状态
  sideToast: {
    visible: false,
    message: '',
    type: 'info'
  },
  
  // 答案输入
  answerInput: '',
  
  // 封禁信息
  banInfo: null
})

// 计算属性
export const computedProps = {
  isLoggedIn: computed(() => !!state.token),
  currentView: computed(() => state.currentView),
  isLoading: computed(() => state.isLoading),
  messageWindow: computed(() => state.messageWindow),
  puzzleData: computed(() => state.puzzleData),
  userProgress: computed(() => state.userProgress),
  currentPuzzleId: computed(() => state.currentPuzzleId),
  answerInput: computed(() => state.answerInput)
}

// Actions
export const actions = {
  // 设置视图
  setView: (view) => {
    state.currentView = view
  },

  // 设置Token
  setToken: (token) => {
    state.token = token
    authService.setToken(token)
  },

  // 清除Token
  clearToken: () => {
    state.token = ''
    authService.removeToken()
  },

  // 设置学号
  setStuId: (stuId) => {
    state.stuId = stuId
  },

  // 设置当前关卡
  setCurrentPuzzleId: (id) => {
    state.currentPuzzleId = id
  },

  // 设置题目数据
  setPuzzleData: (data) => {
    state.puzzleData = data
  },

  // 设置用户进度
  setUserProgress: (progress) => {
    state.userProgress = progress
  },

  // 设置加载状态
  setLoading: (loading) => {
    state.isLoading = loading
  },

  // 设置答案输入
  setAnswerInput: (answer) => {
    state.answerInput = answer
  },

  // 显示消息窗口
  showMessage: (message, type = 'info') => {
    state.messageWindow = {
      visible: true,
      message,
      type,
      showClose: true,
      showOptions: false
    }
  },

  // 显示下一步选项（答案正确时使用）
  showNextOptions: () => {
    state.messageWindow = {
      visible: true,
      message: '答案正确！请选择下一步操作：',
      type: 'success',
      showClose: true,  // 保持显示关闭按钮
      showOptions: true // 显示操作按钮
    }
  },

  // 关闭消息窗口
  closeMessage: () => {
    state.messageWindow.visible = false
  },

  // 显示侧边提示（5秒后自动关闭）
  showSideToast: (message, type = 'info') => {
    // 如果当前正在显示，先关闭
    if (state.sideToast.visible) {
      state.sideToast.visible = false
      // 等待动画完成后显示新的
      setTimeout(() => {
        state.sideToast = {
          visible: true,
          message,
          type
        }
      }, 100) // 短暂延迟确保关闭动画开始
    } else {
      // 直接显示
      state.sideToast = {
        visible: true,
        message,
        type
      }
    }
  },

  // 关闭侧边提示
  closeSideToast: () => {
    state.sideToast.visible = false
  },

  // 设置封禁状态
  setBanned: (banned) => {
    state.isBanned = banned
  },

  // 设置封禁信息
  setBanInfo: (banInfo) => {
    state.banInfo = banInfo
  },

  // 重置状态
  resetState: () => {
    state.currentView = 'login'
    state.stuId = ''
    state.currentPuzzleId = 1
    state.puzzleData = null
    state.userProgress = null
    state.answerInput = ''
    state.messageWindow.visible = false
    state.isBanned = false
    state.banInfo = null
  },

}

// 导出状态和操作
export { state }
