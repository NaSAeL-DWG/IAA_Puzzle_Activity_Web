<template>
  <div class="cosmic-container">
    <div class="cosmic-background"></div>
    <div class="stars-container">
      <div 
        v-for="star in stars" 
        :key="star.id"
        class="star"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></div>
    </div>
    <div class="nebula"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 生成星星数据
const stars = ref([])

onMounted(() => {
  // 生成250个随机星星
  for (let i = 0; i < 250; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5, // 0.5-2.5px
      delay: Math.random() * 5, // 0-5s延迟
      duration: Math.random() * 3 + 2 // 2-5s闪烁周期
    })
  }
})
</script>

<style scoped>
.cosmic-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -3;
  pointer-events: none;
  overflow: hidden;
}

.cosmic-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f0c29 100%);
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: 0.3;
  box-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
  animation: twinkleAndDrift 4s infinite ease-in-out;
}

/* 为不同星星添加不同的动画变体 */
.star:nth-child(3n) {
  animation-name: twinkleAndDriftSlow;
}

.star:nth-child(5n) {
  animation-name: twinkleAndDriftFast;
}

.star:nth-child(7n) {
  animation-name: twinkleAndDriftVertical;
}

.nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0, 191, 255, 0.1) 0%, transparent 50%);
  animation: nebulaPulse 10s infinite alternate;
}

/* 基础闪烁+微动动画 */
@keyframes twinkleAndDrift {
  0%, 100% { 
    opacity: 0.2;
    transform: translate(0, 0) scale(1);
  }
  25% { 
    opacity: 0.8;
    transform: translate(1px, -1px) scale(1.1);
  }
  50% { 
    opacity: 0.4;
    transform: translate(0.5px, 1px) scale(0.9);
  }
  75% { 
    opacity: 0.9;
    transform: translate(-1px, 0.5px) scale(1.05);
  }
}

/* 慢速变体 */
@keyframes twinkleAndDriftSlow {
  0%, 100% { 
    opacity: 0.1;
    transform: translate(0, 0) scale(1);
  }
  30% { 
    opacity: 0.7;
    transform: translate(2px, -2px) scale(1.15);
  }
  60% { 
    opacity: 0.3;
    transform: translate(-1px, 2px) scale(0.95);
  }
}

/* 快速变体 */
@keyframes twinkleAndDriftFast {
  0%, 100% { 
    opacity: 0.3;
    transform: translate(0, 0) scale(1);
  }
  20% { 
    opacity: 0.9;
    transform: translate(1.5px, -1.5px) scale(1.2);
  }
  40% { 
    opacity: 0.5;
    transform: translate(-1px, 1px) scale(0.8);
  }
  60% { 
    opacity: 0.8;
    transform: translate(2px, 0) scale(1.1);
  }
  80% { 
    opacity: 0.4;
    transform: translate(0, -1px) scale(0.95);
  }
}

/* 垂直方向变体 */
@keyframes twinkleAndDriftVertical {
  0%, 100% { 
    opacity: 0.2;
    transform: translateY(0) scale(1);
  }
  33% { 
    opacity: 0.7;
    transform: translateY(-3px) scale(1.1);
  }
  66% { 
    opacity: 0.5;
    transform: translateY(2px) scale(0.9);
  }
}

/* 星云脉动 */
@keyframes nebulaPulse {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 0.6; transform: scale(1.05); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .star {
    opacity: 0.2;
  }
}
</style>
