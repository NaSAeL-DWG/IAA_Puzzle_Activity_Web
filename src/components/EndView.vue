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
          你已经成功解开了所有6个神秘关卡，展现了卓越的智慧和毅力。在这段解密之旅中，你突破了重重困难，成功抵达了终点，恭喜你！
        </p>
        
        <p class="end-text">
          感谢你的参与！希望这次解密体验能激发你对未知世界的好奇心。扫描下方二维码或直接点击卡片，访问IAA官网或本项目仓库链接，获取更多精彩内容。
        </p>

        <div class="links-section">
          <!-- 左侧：湖北大学互联网应用协会二维码 -->
          <div class="link-column">
            <div class="link-card" @click="openLink('https://itverse.cn')">
              <canvas ref="qrcodeCanvas" class="qrcode-canvas"></canvas>
              <div class="link-info">
                <div class="link-title">湖北大学互联网应用协会</div>
                <div class="link-description">点击访问官网</div>
              </div>
            </div>
            <div class="small-text">扫描二维码访问协会官网</div>
          </div>

          <!-- 右侧：GitHub和Gitee项目卡片 -->
          <div class="link-column">
            <div class="repo-cards-wrapper">
              <div class="github-card" @click="openLink('https://github.com/NaSAeL-DWG/IAA_Puzzle_Activity_Web')">
                <div class="github-icon">
                  <MDIcon name="github" size="medium" />
                </div>
                <div class="repo-info">
                  <div class="repo-title">GitHub Repository</div>
                  <div class="repo-description">本项目仓库</div>
                </div>
              </div>

              <div class="gitee-card" @click="openLink('https://gitee.com/nasael/IAA_Puzzle_Activity_Web')">
                <div class="gitee-icon">
                  <MDIcon name="gitee" size="medium" />
                </div>
                <div class="repo-info">
                  <div class="repo-title">Gitee Repository</div>
                  <div class="repo-description">Gitee镜像仓库</div>
                </div>
              </div>
            </div>
            
            <div class="small-text">点击跳转项目仓库</div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 15px;">
        <button class="btn-primary" @click="handleRestart" style="flex: 1;">
          <MDIcon name="logout" size="small" />
          <span>退出登录</span>
        </button>
        <button class="btn-test" @click="testFireworks" style="flex: 1;">
          <MDIcon name="celebration" size="small" />
          <span>来点烟花</span>
        </button>
      </div>
    </div>

    <!-- 彩纸效果 -->
    <ConfettiEffect :active="true" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import { actions } from '../stores/appStore'
import ConfettiEffect from './ConfettiEffect.vue'
import MDIcon from './MDIcon.vue'

const qrcodeCanvas = ref(null)

// 生成二维码
const generateQRCode = async () => {
  if (qrcodeCanvas.value) {
    try {
      await QRCode.toCanvas(qrcodeCanvas.value, 'https://itverse.cn', {
        width: 100,
        margin: 1,
        color: {
          dark: '#667eea',
          light: '#ffffff'
        }
      })
    } catch (error) {
      console.error('生成二维码失败:', error)
    }
  }
}

// 打开链接
const openLink = (url) => {
  window.open(url, '_blank')
}

const handleRestart = () => {
  actions.clearToken()
  actions.resetState()
  // 使用侧边提示显示退出登录
  actions.showSideToast('已退出登录', 'info')
}

const testFireworks = () => {
  actions.generateFireworks()
}

onMounted(() => {
  generateQRCode()
})
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
  max-width: 800px; /* 增加宽度 */
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-out;
  position: relative;
  z-index: 10; /* 降低z-index，让烟花在上方显示 */
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

.btn-test {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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

.btn-test:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(250, 112, 154, 0.4);
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

/* 新增样式 */
.links-section {
  display: flex;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
  justify-content: center;
}

.link-column {
  flex: 1;
  min-width: 250px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 左侧链接卡片样式 */
.link-card {
  flex-direction: column;
  text-align: center;
  padding: 30px;
  height: 224px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.link-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.qrcode-canvas {
  width: 100px !important;
  height: 100px !important;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.qrcode-canvas:hover {
  transform: scale(1.05);
}

.link-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.link-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
}

.link-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
}

/* 右侧仓库卡片容器 */
.repo-cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-height: 224px;
  justify-content: space-between;
}

/* GitHub卡片样式 - 黑色风格 */
.github-card {
  flex-direction: row;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  height: 106px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.github-card:hover {
  background: rgba(0, 0, 0, 0.5);
  border-color: #fff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  transform: translateY(-3px);
}

.github-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

/* Gitee卡片样式 - 红色偏黑风格 */
.gitee-card {
  flex-direction: row;
  background: rgba(139, 0, 0, 0.3);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 12px;
  padding: 12px;
  height: 106px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.gitee-card:hover {
  background: rgba(139, 0, 0, 0.5);
  border-color: #ff6666;
  box-shadow: 0 8px 25px rgba(139, 0, 0, 0.4);
  transform: translateY(-3px);
}

.gitee-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 100, 100, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6666;
  flex-shrink: 0;
}

/* 仓库信息样式 */
.repo-info {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.repo-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.repo-description {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.3;
}

/* 底部链接区域 */
.repo-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
  text-align: center;
}

.repo-link {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s ease;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
}

.repo-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

/* 调整小文字大小 */
.small-text {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6px;
  text-align: center;
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .end-card {
    padding: 25px;
  }
  
  .links-section {
    flex-direction: column;
    gap: 15px;
  }
  
  .link-column {
    min-width: 100%;
    max-width: 100%;
  }
  
  .github-card {
    flex-direction: row;
  }
}

@media (max-width: 480px) {
  .end-card {
    padding: 20px;
  }
  
  .title {
    font-size: 1.6rem;
  }
  
  .end-text {
    font-size: 0.9rem;
  }
}
</style>
