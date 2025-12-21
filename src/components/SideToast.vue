<template>
  <transition name="slide-fade">
    <div v-if="visible" class="side-toast" :class="type">
      <!-- 左侧彩色窄矩形 -->
      <div class="color-bar"></div>
      
      <!-- 图标 -->
      <div class="toast-icon">
        <MDIcon :name="iconName" size="medium" />
      </div>
      
      <!-- 消息内容 -->
      <div class="toast-content">
        {{ message }}
      </div>
      
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="close">
        <MDIcon name="close" size="small" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'
import MDIcon from './MDIcon.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'error'].includes(value)
  }
})

const emit = defineEmits(['close'])

const iconName = computed(() => {
  switch (props.type) {
    case 'success':
      return 'check'
    case 'error':
      return 'error'
    default:
      return 'info'
  }
})

let autoCloseTimer = null

// 监听visible变化，自动设置定时器
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 5秒后自动关闭
    autoCloseTimer = setTimeout(() => {
      close()
    }, 5000)
  } else {
    // 关闭时清除定时器
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer)
      autoCloseTimer = null
    }
  }
})

const close = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  emit('close')
}

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped>
.side-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px 20px;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 左侧彩色窄矩形 */
.color-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

/* 不同类型的彩色条 */
.side-toast.success .color-bar {
  background: #2ed573;
}

.side-toast.error .color-bar {
  background: #ff4757;
}

.side-toast.info .color-bar {
  background: #667eea;
}

/* 图标样式 */
.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-toast.success .toast-icon {
  color: #2ed573;
}

.side-toast.error .toast-icon {
  color: #ff4757;
}

.side-toast.info .toast-icon {
  color: #667eea;
}

/* 消息内容 */
.toast-content {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #fff;
  font-weight: 500;
}

/* 关闭按钮 */
.close-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* 动画过渡 */
.slide-fade-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
  animation: slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .side-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .side-toast {
    padding: 12px 16px;
    gap: 10px;
  }
  
  .toast-content {
    font-size: 0.9rem;
  }
}
</style>
