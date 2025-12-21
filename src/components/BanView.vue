<template>
  <div class="ban-container">
    <div class="ban-card">
      <div class="summary-card banned">
        <h2 class="banned-title">您的账户已被封禁</h2>
        <div v-if="banInfo" class="ban-info-content">
          <div class="ban-details" v-if="banInfo.banned_time || banInfo.banned_reason || banInfo.reason">
            <span class="label-time">封禁时间：</span><span class="value-time">{{ banInfo.banned_time || '未知' }}</span>
            <p ></p>
            <span class="label-reason">封禁理由：</span><span class="value-reason">{{ banInfo.banned_reason || banInfo.reason || '未知' }}</span>
          </div>
          <p >&emsp;</p>
          <p class="banned-text">这有可能是由于我们检测到您进行了不正当的操作，产生了不符合常理的数据。出于活动公平原则考虑，我们对您的账户进行了封禁。</p>
          <p class="banned-text">请注意：该账户的所有答题信息将不被认可。</p>
          <p class="banned-text">如有疑问请咨询活动工作人员。</p>
          <p >&emsp;</p>
        </div>
        <div v-else class="loading-content">
          <p class="banned-text">正在加载封禁信息...</p>
        </div>
      </div>
      
      <button 
        class="btn-logout" 
        @click="handleLogout"
        :disabled="isLoading"
      >
        <MDIcon name="logout" size="small" />
        <span>{{ isLoading ? '处理中...' : '退出登录' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { state, actions } from '../stores/appStore'
import { authService } from '../services/auth'
import { userAPI } from '../services/api'
import MDIcon from './MDIcon.vue'

// 使用computed确保响应式更新
const banInfo = computed(() => state.banInfo)
const isLoading = computed(() => state.isLoading)

// 获取封禁信息
const fetchBanInfo = async () => {
  const token = state.token
  if (!token) return

  actions.setLoading(true)
  console.log('Starting fetchBanInfo, token:', token)
  
  try {
    console.log('Fetching ban info with token:', token)
    const response = await userAPI.getBanInfo(token)
    console.log('Ban info response:', response)
    
    // 检查响应是否有效
    if (response && (response.banned_reason || response.reason || response.banned_time)) {
      console.log('Setting banInfo with response:', response)
      actions.setBanInfo(response)
    } else {
      // 响应为空或无效，设置默认信息
      console.log('Response invalid, setting default info')
      actions.setBanInfo({
        banned_time: '未知',
        banned_reason: '未知'
      })
    }
  } catch (error) {
    console.error('获取封禁信息失败:', error)
    
    // 根据错误类型处理
    if (error.status === 404 || (error.message && error.message.includes('404'))) {
      // 404错误：没有找到封禁信息，使用默认值
      console.log('404 error, setting default info')
      actions.setBanInfo({
        banned_time: '未知',
        banned_reason: '未知'
      })
    } else if (error.detail) {
      // 有错误详情，使用错误详情作为理由
      console.log('Other error with detail:', error.detail)
      actions.setBanInfo({
        banned_time: '未知',
        banned_reason: error.detail
      })
    } else {
      // 其他错误：使用通用默认信息
      console.log('Unknown error, setting default info')
      actions.setBanInfo({
        banned_time: '未知',
        banned_reason: '未知'
      })
    }
  } finally {
    actions.setLoading(false)
    console.log('Fetch completed, banInfo:', banInfo.value)
  }
}

const handleLogout = () => {
  actions.setLoading(true)
  
  // 清除认证信息
  authService.removeToken()
  
  // 重置所有状态
  actions.resetState()
  
  // 返回登录页面
  actions.setView('login')
  
  // 显示退出成功提示
  actions.showSideToast('已安全退出登录', 'info')
  
  actions.setLoading(false)
}

// 组件挂载时获取封禁信息
onMounted(() => {
  fetchBanInfo()
})
</script>

<style scoped>
.ban-container {
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

.ban-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid #dc3545;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(220, 53, 69, 0.3);
  animation: fadeIn 0.5s ease-out;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background: rgba(220, 53, 69, 0.08);
}

.summary-card {
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 0;
  animation: fadeIn 0.6s ease-out;
}

.banned-title {
  font-size: 2rem;
  font-weight: 700;
  color: #dc3545;
  margin: 0 0 16px 0;
  text-align: center;
  text-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

.ban-details {
  font-size: 1.3rem;
  font-weight: 500;
  text-align: center;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.label-time,
.label-reason {
  color: #a71d31; /* 暗红色 - 比标题颜色稍暗 */
  font-weight: 600;
}

.value-time,
.value-reason {
  color: #ffffff; /* 白色 */
  font-weight: 600;
}

.separator {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 8px;
}

.banned-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
  text-align: center;
}

.banned-text:last-child {
  margin-bottom: 0;
}

.btn-logout {
  padding: 12px 24px;
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
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: #fff;
  width: 100%;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .ban-card {
    padding: 25px;
  }
  
  .banned-title {
    font-size: 1.3rem;
  }
  
  .banned-text {
    font-size: 0.9rem;
  }
}
</style>
