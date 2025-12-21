<template>
  <div v-if="visible" class="message-overlay">
    <div class="message-window" :class="type">
      <button v-if="showClose" class="close-btn" @click="close">
        <MDIcon name="close" size="small" />
      </button>
      
      <div class="message-icon">
        <MDIcon :name="iconName" size="large" />
      </div>
      
      <div class="message-content">{{ message }}</div>
      
      <!-- 选项按钮（用于下一步选择） -->
      <div v-if="showOptions" class="message-options">
        <button class="btn-secondary" @click="$emit('back-to-summary')">
          <MDIcon name="arrow_back" size="small" />
          <span>回到主界面</span>
        </button>
        <button class="btn-primary" @click="$emit('next-puzzle')">
          <MDIcon name="arrow_forward" size="small" />
          <span>进入下一题</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showOptions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'back-to-summary', 'next-puzzle'])

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

const close = () => {
  emit('close')
}
</script>

<style scoped>
.message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.message-window {
  background: rgba(30, 30, 50, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: slideUp 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message-icon {
  margin-bottom: 15px;
}

.message-window.success .message-icon {
  color: #2ed573;
}

.message-window.error .message-icon {
  color: #ff4757;
}

.message-window.info .message-icon {
  color: #667eea;
}

.message-window.success {
  border-color: #2ed573;
  box-shadow: 0 0 30px rgba(46, 213, 115, 0.3);
}

.message-window.error {
  border-color: #ff4757;
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.3);
}

.message-window.info {
  border-color: #667eea;
  box-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.5rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.message-content {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  text-align: center;
}

.message-options {
  display: flex;
  gap: 10px;
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
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.message-options .btn-secondary,
.message-options .btn-primary {
  flex: 1;
  padding: 10px;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .message-options {
    flex-direction: column;
  }
}
</style>
