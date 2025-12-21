<template>
  <div class="end-container">
    <div class="end-card">
      <div class="title-container">
        <MDIcon name="star" size="large" class="star-icon" />
        <h1 class="title">&nbsp&nbsp恭喜完成！</h1>
        <MDIcon name="star" size="large" class="star-icon" />
      </div>
      
      <div class="end-content">
        <p class="end-text">
          你已经成功解开了所有6个神秘关卡，展现了卓越的智慧和毅力。在这段宇宙探索之旅中，你突破了重重困难，解开了一个个谜题。
        </p>
        
        <p class="end-text">
          感谢你的参与！希望这次解密体验能激发你对未知世界的好奇心。扫描下方二维码关注我们，获取更多精彩内容。
        </p>

        <div class="qr-section">
          <div class="qr-placeholder">
            <MDIcon name="qr_code" size="large" class="qr-icon" />
            <div class="qr-text">扫码关注</div>
          </div>
        </div>
      </div>

      <button class="btn-primary" @click="handleRestart">
        <MDIcon name="logout" size="small" />
        <span>退出登录</span>
      </button>
    </div>

    <!-- 彩纸效果 -->
    <ConfettiEffect :active="true" />
  </div>
</template>

<script setup>
import { actions } from '../stores/appStore'
import ConfettiEffect from './ConfettiEffect.vue'
import MDIcon from './MDIcon.vue'

const handleRestart = () => {
  actions.clearToken()
  actions.resetState()
  // 使用侧边提示显示退出登录
  actions.showSideToast('已退出登录', 'info')
}
</script>

<style scoped>
.end-container {
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

.end-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-out;
  position: relative;
  z-index: 2;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
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

.end-content {
  margin: 30px 0;
}

.end-text {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: center;
}

.qr-section {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.qr-placeholder:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #667eea;
  transform: scale(1.05);
}

.qr-icon {
  color: #667eea;
  margin-bottom: 10px;
}

.qr-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-primary {
  width: 100%;
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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fireworks-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0; /* 最低层级，在内容下方 */
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .end-card {
    padding: 25px;
  }
}
</style>
