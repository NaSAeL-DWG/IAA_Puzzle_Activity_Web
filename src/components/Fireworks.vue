<template>
  <div class="fireworks-container">
    <div 
      v-for="firework in fireworks" 
      :key="firework.id"
      class="firework-wrapper"
      :style="{
        left: firework.x + '%',
        top: firework.y + '%',
        animationDelay: firework.delay + 's'
      }"
    >
      <!-- 上升的火箭 -->
      <div class="rocket" :class="'type' + firework.type"></div>
      
      <!-- 炸开的粒子 -->
      <div 
        class="particles-container"
        :style="{ animationDelay: firework.delay + 's' }"
      >
        <div 
          v-for="particle in firework.particles" 
          :key="particle.id"
          class="particle"
          :class="'type' + firework.type"
          :style="{
            left: particle.x + 'px',
            top: particle.y + 'px',
            animationDelay: particle.delay + 's'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  fireworks: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.firework-wrapper {
  position: absolute;
  width: 4px;
  height: 4px;
}

/* 火箭（上升部分） */
.rocket {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0;
  animation: rocket-rise 0.8s ease-out forwards;
}

/* 粒子容器 */
.particles-container {
  position: absolute;
  top: -200px; /* 与火箭上升终点对齐 */
  left: 0;
  width: 10px;
  height: 10px;
  opacity: 0;
  animation: particles-show 0.1s ease-out 0.8s forwards;
}

/* 单个粒子 */
.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  opacity: 0;
  animation: explode 0.6s ease-out 0.8s forwards;
}

/* 烟花类型颜色 */
.rocket.type1, .particle.type1 { background: #ff6b6b; box-shadow: 0 0 6px #ff6b6b; }
.rocket.type2, .particle.type2 { background: #4ecdc4; box-shadow: 0 0 6px #4ecdc4; }
.rocket.type3, .particle.type3 { background: #ffe66d; box-shadow: 0 0 6px #ffe66d; }
.rocket.type4, .particle.type4 { background: #a8e6cf; box-shadow: 0 0 6px #a8e6cf; }
.rocket.type5, .particle.type5 { background: #ff8b94; box-shadow: 0 0 6px #ff8b94; }

/* 火箭上升动画 */
@keyframes rocket-rise {
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

/* 粒子显示 */
@keyframes particles-show {
  to {
    opacity: 1;
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
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
}

/* 性能优化 */
.rocket, .particle {
  will-change: transform, opacity;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .firework-wrapper {
    width: 2px;
    height: 2px;
  }
  
  .particle {
    width: 2px;
    height: 2px;
  }
  
  @keyframes rocket-rise {
    0% { transform: translateY(0) scale(0.5); }
    40% { transform: translateY(-50px) scale(1); }
    60% { transform: translateY(-80px) scale(0.8); }
    100% { transform: translateY(-110px) scale(0.2); }
  }
}
</style>
