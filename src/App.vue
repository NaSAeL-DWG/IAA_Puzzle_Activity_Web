<template>
  <div id="app-container">
    <!-- 宇宙背景 -->
    <CosmicBackground />
    
    <!-- 消息窗口 -->
    <MessageWindow
      :visible="messageWindow.visible"
      :message="messageWindow.message"
      :type="messageWindow.type"
      :show-close="messageWindow.showClose"
      :show-options="messageWindow.showOptions"
      @close="actions.closeMessage"
      @back-to-summary="handleBackToSummary"
      @next-puzzle="handleNextPuzzle"
    />
    
    <!-- 侧边提示 -->
    <SideToast
      :visible="sideToast.visible"
      :message="sideToast.message"
      :type="sideToast.type"
      @close="actions.closeSideToast"
    />

    <!-- 页面路由 -->
    <LoginView v-if="currentView === 'login'" />
    <PuzzleSummary v-else-if="currentView === 'summary'" />
    <PuzzleGame v-else-if="currentView === 'puzzle'" />
    <EndView v-else-if="currentView === 'end'" />
    <BanView v-else-if="currentView === 'ban'" />

    <!-- 加载遮罩 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    
    <!-- Footer版权信息 -->
    <div class="footer">
      <div class="footer-left">
        <a href="https://gitee.com/nasael/IAA_Puzzle_Activity_Web" target="_blank" class="repo-icon" title="Gitee">
          <MDIcon name="gitee" size="small" />
        </a>
        <a href="https://github.com/NaSAeL-DWG/IAA_Puzzle_Activity_Web" target="_blank" class="repo-icon" title="GitHub">
          <MDIcon name="github" size="small" />
        </a>
      </div>
      <div class="footer-center">
        <span class="copyright">Copyright © 2025 <a href="https://itverse.cn" target = "_blank">HUBU_IAA_Association 湖北大学互联网应用协会.</a> All rights reserved.</span>
        <span class="version">v1.2.0</span>
      </div>
      <div class="footer-right">
        <div class="footer-creative-top">创意总监：Dynamic Creative Center(Studio)</div>
        <div class="footer-creative-bottom">动力创意中心(工作室)</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { state, actions } from './stores/appStore'
import { userAPI, puzzleAPI } from './services/api'
import { authService } from './services/auth'
import { formatErrorMessage } from './utils/helpers'

// 组件导入
import CosmicBackground from './components/CosmicBackground.vue'
import MessageWindow from './components/MessageWindow.vue'
import SideToast from './components/SideToast.vue'
import LoginView from './components/LoginView.vue'
import PuzzleSummary from './components/PuzzleSummary.vue'
import PuzzleGame from './components/PuzzleGame.vue'
import EndView from './components/EndView.vue'
import BanView from './components/BanView.vue'
import MDIcon from './components/MDIcon.vue'

// 计算属性
const currentView = computed(() => state.currentView)
const messageWindow = computed(() => state.messageWindow)
const sideToast = computed(() => state.sideToast)
const isLoading = computed(() => state.isLoading)
const token = computed(() => state.token)

// 生命周期：检查本地token
onMounted(async () => {
  if (authService.isLoggedIn()) {
    try {
      const response = await userAPI.getUserProgress(token.value)
      
      // 检查封禁状态
      if (response.ban === true) {
        actions.setBanned(true)
        // 先设置token，确保后续API调用有token
        actions.setToken(token.value)
        actions.setView('ban')
        return
      }
      
      actions.setUserProgress(response)
      
      // 如果用户已完成所有关卡（last_level >= 6），直接跳到结束页
      if (response.last_level >= 6) {
        actions.setView('end')
      } else {
        actions.setView('summary')
      }
    } catch (error) {
      // Token无效，清除并显示登录页
      actions.clearToken()
      actions.setView('login')
      actions.showMessage('登录已过期，请重新登录', 'error')
    }
  } else {
    actions.setView('login')
  }
})


// 处理下一步选择
const handleNextPuzzle = () => {
  console.log('handleNextPuzzle called')
  actions.closeMessage()
  const nextId = state.currentPuzzleId + 1
  console.log('Next ID:', nextId, 'Current ID:', state.currentPuzzleId)
  
  if (nextId <= 6) {
    console.log('Getting puzzle for ID:', nextId)
    // 获取下一题
    actions.setLoading(true)
    puzzleAPI.getPuzzle(nextId, state.token)
      .then(response => {
        console.log('Puzzle response:', response)
        actions.setPuzzleData(response)
        actions.setCurrentPuzzleId(nextId)
        actions.setView('puzzle')
        actions.setAnswerInput('')
      })
      .catch(error => {
        console.error('Error getting puzzle:', error)
        actions.showMessage(error.message || '获取题目失败', 'error')
      })
      .finally(() => {
        actions.setLoading(false)
      })
  } else {
    console.log('All puzzles completed, going to end')
    actions.setView('end')
  }
}

// 处理返回主界面
const handleBackToSummary = async () => {
  actions.closeMessage()
  actions.setLoading(true)
  
  try {
    // 重新请求用户进度
    const response = await userAPI.getUserProgress(state.token)
    actions.setUserProgress(response)
    actions.setView('summary')
  } catch (error) {
    const message = formatErrorMessage(error)
    actions.showMessage(message, 'error')
    // 如果获取进度失败，仍然返回主界面
    actions.setView('summary')
  } finally {
    actions.setLoading(false)
  }
}
</script>

<style>
/* 全局样式重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  background: #0a0e27;
}

#app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  color: #fff;
}

/* 通用动画 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 文本选择样式 */
::selection {
  background: rgba(102, 126, 234, 0.3);
  color: #fff;
}

/* Footer样式 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.repo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.repo-icon:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  border-color: rgba(102, 126, 234, 0.5);
}

.repo-icon:active {
  transform: translateY(0);
}

.footer-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.3px;
  font-weight: 500;
  white-space: nowrap;
}

.footer-right {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
  flex-shrink: 0;
}

.footer-creative-top,
.footer-creative-bottom {
  font-size: 0.6rem; /* 小一号字体 */
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.copyright {
  font-weight: 500;
}

.version {
  background: rgba(102, 126, 234, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

/* 响应式调整，确保footer不遮挡内容 */
#app-container {
  padding-bottom: 44px; /* 为footer留出空间 */
}

@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 8px 10px;
  }
  
  .footer-center {
    position: static;
    transform: none;
    font-size: 0.75rem;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-right {
    margin-left: 0;
    align-items: center;
    gap: 3px;
  }
  
  .footer-creative-top,
  .footer-creative-bottom {
    font-size: 0.7rem;
    text-align: center;
  }
}
</style>
