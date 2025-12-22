<template>
  <div class="puzzle-container">
    <div class="puzzle-card">
      <div class="puzzle-header">
        <div class="header-left">
          <MDIcon name="help_center" size="large" class="header-icon" />
          <h2 class="puzzle-title">第 {{ currentPuzzleId }} 关</h2>
        </div>
        <button class="btn-small" @click="handleBack">
          <MDIcon name="arrow_back" size="small" />
          <span>返回</span>
        </button>
      </div>

      <div class="puzzle-content" v-html="puzzleData?.content || '加载中...'"></div>

      <div class="tips-section" v-if="puzzleData && hasTips">
        <button class="tips-toggle" @click="toggleTips">
          <MDIcon :name="showTips ? 'expand_less' : 'expand_more'" size="small" />
          <MDIcon name="lightbulb" size="small" />
          <span>{{ showTips ? '隐藏提示' : '查看提示' }}</span>
        </button>
        
        <div v-if="showTips" class="puzzle-tips">
          <div v-if="puzzleData.tip1" class="tip">
            <MDIcon name="info" size="small" class="tip-icon" />
            <span>提示1: {{ puzzleData.tip1 }}</span>
          </div>
          <div v-if="puzzleData.tip2" class="tip">
            <MDIcon name="info" size="small" class="tip-icon" />
            <span>提示2: {{ puzzleData.tip2 }}</span>
          </div>
          <div v-if="puzzleData.tip3" class="tip">
            <MDIcon name="info" size="small" class="tip-icon" />
            <span>提示3: {{ puzzleData.tip3 }}</span>
          </div>
        </div>
      </div>

      <div class="answer-section">
        <div class="input-wrapper">
          <MDIcon name="edit" class="input-icon" />
          <input 
            v-model="answerInput"
            type="text" 
            :placeholder="answerFormatPlaceholder" 
            class="input-field"
            @keyup.enter="handleSubmit"
          />
        </div>
        <button 
          class="btn-primary" 
          @click="handleSubmit"
          :disabled="isLoading || !answerInput"
        >
          <MDIcon name="check" size="small" />
          <span>{{ isLoading ? '验证中...' : '提交答案' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { state, actions } from '../stores/appStore'
import { puzzleAPI, userAPI } from '../services/api'
import { validateAnswer, formatErrorMessage } from '../utils/helpers'
import MDIcon from './MDIcon.vue'

const answerInput = computed({
  get: () => state.answerInput,
  set: (value) => actions.setAnswerInput(value)
})

const currentPuzzleId = computed(() => state.currentPuzzleId)
const puzzleData = computed(() => state.puzzleData)
const isLoading = computed(() => state.isLoading)
const token = computed(() => state.token)

// 答案格式占位符 - 从API返回的answer_format字段获取
const answerFormatPlaceholder = computed(() => {
  return puzzleData.value?.answer_format || '请输入答案'
})

// 提示显示状态
const showTips = ref(false)

// 检查是否有提示
const hasTips = computed(() => {
  return puzzleData.value && (
    puzzleData.value.tip1 || 
    puzzleData.value.tip2 || 
    puzzleData.value.tip3
  )
})

// 切换提示显示
const toggleTips = () => {
  showTips.value = !showTips.value
}

const handleBack = async () => {
  actions.setLoading(true)
  
  try {
    // 重新获取用户进度
    const progressResponse = await userAPI.getUserProgress(token.value)
    
    // 检查封禁状态
    if (progressResponse.ban === true) {
      actions.setBanned(true)
      actions.setView('ban')
      actions.showSideToast('您的账户已被封禁', 'error')
      return
    }
    
    // 更新用户进度
    actions.setUserProgress(progressResponse)
    
    // 返回到关卡选择界面
    actions.setView('summary')
    actions.setAnswerInput('')
    
    // 显示成功提示
    actions.showSideToast('已刷新答题情况', 'success')
  } catch (error) {
    const message = formatErrorMessage(error)
    actions.showMessage(message, 'error')
  } finally {
    actions.setLoading(false)
  }
}

const handleSubmit = async () => {
  const validation = validateAnswer(answerInput.value)
  if (!validation.valid) {
    actions.showMessage(validation.message, 'error')
    return
  }

  actions.setLoading(true)

  try {
    const response = await puzzleAPI.checkAnswer(
      currentPuzzleId.value,
      token.value,
      answerInput.value
    )

    // 检查封禁状态
    if (response.ban === true) {
      actions.setBanned(true)
      actions.setView('ban')
      actions.showSideToast('您的账户已被封禁', 'error')
      return
    }

    if (response.result) {
      // 答案正确 - 直接显示下一步选项，不自动关闭
      if (currentPuzzleId.value >= 6) {
        // 最后一关，显示完成消息并跳转
        actions.showMessage('恭喜！你已完成所有关卡！', 'success')
        setTimeout(() => {
          actions.setView('end')
          // 触发烟花效果
          setTimeout(() => {
            actions.generateFireworks()
            // 持续生成烟花
            const interval = setInterval(() => {
              if (state.currentView === 'end') {
                actions.generateFireworks()
              } else {
                clearInterval(interval)
              }
            }, 5000)
          }, 500)
        }, 1500)
      } else {
        // 非最后一关，显示下一步选项
        actions.showNextOptions()
      }
    } else {
      // 答案错误 - 显示错误消息，不自动关闭
      actions.showMessage('答案错误，请重试', 'error')
      actions.setAnswerInput('')
    }
  } catch (error) {
    const message = formatErrorMessage(error)
    actions.showMessage(message, 'error')
  } finally {
    actions.setLoading(false)
  }
}
</script>

<style scoped>
.puzzle-container {
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

.puzzle-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-out;
}

.puzzle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #667eea;
  font-size: 32px;
  width: 32px;
  height: 32px;
}

.puzzle-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  line-height: 1;
}

.puzzle-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  line-height: 1.6;
  min-height: 100px;
}

.puzzle-content :deep(h1),
.puzzle-content :deep(h2),
.puzzle-content :deep(h3) {
  margin: 10px 0;
  color: #667eea;
}

.puzzle-content :deep(p) {
  margin: 10px 0;
  color: rgba(255, 255, 255, 0.9);
}

.tips-section {
  margin-bottom: 20px;
}

.tips-toggle {
  width: 100%;
  padding: 10px 15px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  color: #ffc107;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tips-toggle:hover {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.5);
  transform: translateY(-1px);
}

.puzzle-tips {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: slideDown 0.3s ease-out;
}

.tip {
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-icon {
  color: #ffc107;
  flex-shrink: 0;
}

.answer-section {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: rgba(255, 255, 255, 0.6);
  z-index: 1;
}

.input-field {
  width: 100%;
  padding: 15px 20px 15px 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.btn-primary {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-small:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .puzzle-card {
    padding: 25px;
  }
  
  .puzzle-title {
    font-size: 1.5rem;
  }
  
  .answer-section {
    flex-direction: column;
  }
}
</style>
