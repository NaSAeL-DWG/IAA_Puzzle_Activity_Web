<template>
  <div class="login-container">
    <div class="login-card">
      <div class="title-container">
        <MDIcon name="star" size="large" class="star-icon" />
        <h1 class="title">解密挑战</h1>
        <MDIcon name="star" size="large" class="star-icon" />
      </div>
      <p class="subtitle">探索宇宙的奥秘，解开6个神秘关卡</p>
      
      <div class="auth-form">
        <div class="input-group">
          <MDIcon name="person" class="input-icon" />
          <input 
            v-model="stuId" 
            type="text" 
            placeholder="请输入学号" 
            class="input-field"
            maxlength="16"
            @keyup.enter="handleLogin"
          />
        </div>
        
        <div class="button-group">
          <button 
            class="btn-primary" 
            @click="handleRegister"
            :disabled="isLoading"
          >
            <MDIcon name="person" size="small" />
            <span>{{ isLoading ? '处理中...' : '注册' }}</span>
          </button>
          <button 
            class="btn-secondary" 
            @click="handleLogin"
            :disabled="isLoading"
          >
            <MDIcon name="lock" size="small" />
            <span>{{ isLoading ? '处理中...' : '登录' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userAPI } from '../services/api'
import { authService } from '../services/auth'
import { actions } from '../stores/appStore'
import { validateStuId, formatErrorMessage } from '../utils/helpers'
import MDIcon from './MDIcon.vue'

const stuId = ref('')
const isLoading = ref(false)

const handleAuth = async (isLogin) => {
  const validation = validateStuId(stuId.value)
  if (!validation.valid) {
    // 使用侧边提示显示验证错误
    actions.showSideToast(validation.message, 'error')
    return
  }

  isLoading.value = true

  try {
    const response = isLogin 
      ? await userAPI.login(stuId.value)
      : await userAPI.createUser(stuId.value)

    // 检查封禁状态
    if (response.ban === true) {
      actions.setBanned(true)
      actions.setToken(response.token)
      actions.setStuId(stuId.value)
      actions.setView('ban')
      actions.showSideToast('您的账户已被封禁', 'error')
      return
    }

    actions.setToken(response.token)
    actions.setStuId(stuId.value)
    actions.setUserProgress(response)
    actions.setView('summary')
    // 使用侧边提示显示登录成功
    actions.showSideToast(isLogin ? '登录成功！' : '注册成功！', 'success')
  } catch (error) {
    const message = formatErrorMessage(error)
    // 使用侧边提示显示错误信息
    actions.showSideToast(message, 'error')
  } finally {
    isLoading.value = false
  }
}

const handleLogin = () => handleAuth(true)
const handleRegister = () => handleAuth(false)
</script>

<style scoped>
.login-container {
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

.login-card {
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

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.star-icon {
  color: #667eea;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0;
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

.input-group {
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

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .login-card {
    padding: 25px;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>
