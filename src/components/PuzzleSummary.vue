<template>
  <div class="summary-container">
    <div class="summary-card">
      <div class="header">
        <h1 class="title">关卡选择</h1>
      </div>
      <p class="subtitle">选择你要挑战的关卡</p>
      
      <div class="puzzle-grid">
        <div 
          v-for="i in 6" 
          :key="i"
          class="puzzle-item"
          :class="getLevelClass(i)"
          @click="handleLevelClick(i)"
        >
          <MDIcon 
            :name="getLevelIcon(i)" 
            size="medium" 
            class="puzzle-icon" 
          />
          <div class="puzzle-number">{{ i }}</div>
          <div class="puzzle-status">
            <span v-if="isCompleted(i)">已完成</span>
            <span v-else-if="isCurrent(i)">当前</span>
            <span v-else>待解锁</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="btn-secondary" @click="handleLogout">
          <MDIcon name="logout" size="small" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { state, actions } from '../stores/appStore'
import { userAPI, puzzleAPI } from '../services/api'
import { formatErrorMessage } from '../utils/helpers'
import MDIcon from './MDIcon.vue'

const userProgress = computed(() => state.userProgress)

const getLevelIcon = (level) => {
  if (isCompleted(level)) return 'check'
  if (isLocked(level)) return 'lock'
  if (isCurrent(level)) return 'play_arrow'
  return 'play_arrow'
}

const isCompleted = (level) => {
  return userProgress.value && level <= userProgress.value.last_level
}

const isCurrent = (level) => {
  return userProgress.value && level === userProgress.value.last_level + 1
}

const isLocked = (level) => {
  if (!userProgress.value) return level > 1
  return level > userProgress.value.last_level + 1
}

const getLevelClass = (level) => {
  if (isCompleted(level)) return 'completed'
  if (isLocked(level)) return 'locked'
  return ''
}

const handleLevelClick = async (level) => {
  if (isLocked(level)) return

  actions.setLoading(true)
  actions.setCurrentPuzzleId(level)

  try {
    const response = await puzzleAPI.getPuzzle(level, state.token)
    
    // 检查封禁状态
    if (response.ban === true) {
      actions.setBanned(true)
      actions.setView('ban')
      actions.showSideToast('您的账户已被封禁', 'error')
      return
    }
    
    actions.setPuzzleData(response)
    actions.setView('puzzle')
  } catch (error) {
    const message = formatErrorMessage(error)
    actions.showMessage(message, 'error')
  } finally {
    actions.setLoading(false)
  }
}

const handleLogout = () => {
  actions.clearToken()
  actions.resetState()
  // 使用侧边提示显示退出登录
  actions.showSideToast('已退出登录', 'info')
}
</script>

<style scoped>
.summary-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-out;
  margin: 0 auto; /* 确保居中 */
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
}

.subtitle {
  font-size: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
  line-height: 1.5;
}

.puzzle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 30px 0;
}

.puzzle-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.puzzle-icon {
  margin-bottom: 5px;
}

.puzzle-item.completed .puzzle-icon {
  color: #2ed573;
}

.puzzle-item.locked .puzzle-icon {
  color: rgba(255, 255, 255, 0.3);
}

.puzzle-item:not(.locked):not(.completed) .puzzle-icon {
  color: #667eea;
}

.puzzle-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.puzzle-item:hover::before {
  left: 100%;
}

.puzzle-item:hover:not(.locked):not(.completed) {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.puzzle-item.completed {
  background: rgba(46, 213, 115, 0.2);
  border-color: #2ed573;
  opacity: 0.8;
}

.puzzle-item.locked {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.5;
}

.puzzle-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.puzzle-status {
  font-size: 0.8rem;
  opacity: 0.7;
}

.action-buttons {
  margin-top: 20px;
}

.btn-secondary {
  width: 100%;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .summary-card {
    padding: 25px;
  }
  
  .puzzle-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
