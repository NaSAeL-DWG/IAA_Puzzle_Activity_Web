<template>
  <div class="confetti-container">
    <!-- 原始烟花粒子 -->
    <div 
      v-for="firework in fireworks" 
      :key="firework.id"
      class="firework-particle"
      :class="'type' + firework.type"
      :style="{
        left: firework.x + '%',
        top: firework.y + '%',
        animationDelay: firework.delay + 's'
      }"
    >
      <div 
        v-for="particle in firework.particles" 
        :key="particle.id"
        class="particle"
        :style="{
          '--angle': particle.angle + 'deg',
          '--distance': particle.distance + 'px',
          '--delay': particle.delay + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const fireworks = ref([])
let animationTimeout = null
let isAnimating = false

const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min
}

// 原始烟花效果
const generateOriginalFireworks = () => {
  const fireworkCount = 8
  
  for (let i = 0; i < fireworkCount; i++) {
    setTimeout(() => {
      // 生成粒子（炸开效果）
      const particleCount = 12 + Math.floor(Math.random() * 8)
      const particles = []
      
      for (let j = 0; j < particleCount; j++) {
        const angle = (360 / particleCount) * j + Math.random() * 10
        const distance = 40 + Math.random() * 40
        const radians = (angle * Math.PI) / 180
        const x = Math.cos(radians) * distance
        const y = Math.sin(radians) * distance
        
        particles.push({
          id: `${i}-${j}`,
          x: x,
          y: y,
          delay: Math.random() * 0.2,
          angle: angle,
          distance: distance
        })
      }
      
      const firework = {
        id: Date.now() + i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 30 + 50,
        delay: Math.random() * 0.5,
        type: Math.floor(Math.random() * 5) + 1,
        particles: particles
      }
      
      fireworks.value.push(firework)
      
      // 自动清理
      setTimeout(() => {
        const index = fireworks.value.findIndex(f => f.id === firework.id)
        if (index !== -1) {
          fireworks.value.splice(index, 1)
        }
      }, 1500)
      
    }, i * 500)
  }
}

// Canvas Confetti效果
const startConfettiFireworks = () => {
  if (isAnimating) return
  isAnimating = true

  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 0,
    colors: ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#ffe66d']
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      isAnimating = false
      if (props.active) {
        animationTimeout = setTimeout(() => {
          if (props.active) {
            // 重新开始所有效果
            generateOriginalFireworks()
            startConfettiFireworks()
          }
        }, 5000)
      }
      return
    }

    const particleCount = 50 * (timeLeft / duration)
    
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.4) }
    })
    confetti({ 
      ...defaults, 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.4) }
    })
  }, 250)
}

onMounted(() => {
  if (props.active) {
    animationTimeout = setTimeout(() => {
      // 同时启动两种效果
      generateOriginalFireworks()
      startConfettiFireworks()
    }, 500)
  }
})

onUnmounted(() => {
  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1; /* 在内容下方 */
}

/* 原始烟花粒子样式 */
.firework-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  opacity: 0;
  animation: firework-rise 0.8s ease-out forwards;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  top: 0;
  left: 0;
  opacity: 0;
  animation: explode 0.6s ease-out 0.8s forwards;
  background: currentColor;
}

/* 烟花类型颜色 */
.firework-particle.type1 { color: #ff6b6b; }
.firework-particle.type2 { color: #4ecdc4; }
.firework-particle.type3 { color: #ffe66d; }
.firework-particle.type4 { color: #a8e6cf; }
.firework-particle.type5 { color: #ff8b94; }

/* 粒子颜色继承 */
.particle {
  background: currentColor;
  box-shadow: 0 0 4px currentColor;
}

/* 上升动画 */
@keyframes firework-rise {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  40% {
    transform: translateY(-80px) scale(1);
  }
  60% {
    transform: translateY(-120px) scale(0.8);
  }
  80% {
    transform: translateY(-160px) scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-200px) scale(0.2);
    opacity: 0;
  }
}

/* 炸开动画 */
@keyframes explode {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(var(--distance) * cos(var(--angle))), 
      calc(var(--distance) * sin(var(--angle)))
    ) scale(0);
    opacity: 0;
  }
}

/* 性能优化 */
.firework-particle, .particle {
  will-change: transform, opacity;
}

/* 遮罩保护 - 只对Canvas confetti生效 */
.confetti-container > canvas {
  mask-image: linear-gradient(to bottom, 
    transparent 0%, 
    transparent 20%, 
    black 20%, 
    black 80%, 
    transparent 80%, 
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(to bottom, 
    transparent 0%, 
    transparent 20%, 
    black 20%, 
    black 80%, 
    transparent 80%, 
    transparent 100%
  );
}

/* 响应式 */
@media (max-width: 768px) {
  .firework-particle {
    width: 2px;
    height: 2px;
  }
  
  .particle {
    width: 2px;
    height: 2px;
  }
  
  @keyframes firework-rise {
    0% { transform: translateY(0) scale(0.5); }
    40% { transform: translateY(-50px) scale(1); }
    60% { transform: translateY(-80px) scale(0.8); }
    100% { transform: translateY(-110px) scale(0.2); }
  }
}
</style>
