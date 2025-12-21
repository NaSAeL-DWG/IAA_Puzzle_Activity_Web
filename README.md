# 湖北大学互联网应用协会社团 解密挑战网站 前端

提供：Dynamic Creative Center(Studio) 动力创意中心(工作室)<p>
友情链接：[湖北大学互联网应用协会社团官方网站](https://iaahomepage.netlify.app/)<p>
后端API仓库：[[Github]](https://github.com/NaSAeL-DWG/IAA_Puzzle_Activity_WebAPI)  [[Gitee]](https://gitee.com/nasael/IAA_Puzzle_Activity_WebAPI)

---


## 🚀 项目特点

- **模块化架构**: 组件化开发，代码结构更清晰
- **Vue3 + Vite构建** 支持代码热更新
- 前后端分离

## 🏗️ 项目架构

### 组件结构
```
src/
├── App.vue                    # 主应用组件（路由和全局状态）
├── main.js                    # 入口文件
├── stores/
│   └── appStore.js           # 全局状态管理（Vue reactive）
├── services/
│   ├── api.js                # API服务（封装所有后端调用）
│   └── auth.js               # 认证服务（Token管理）
├── utils/
│   └── helpers.js            # 工具函数
└── components/
    ├── LoginView.vue         # 登录/注册页面
    ├── PuzzleSummary.vue     # 关卡选择页面
    ├── PuzzleGame.vue        # 解密游戏页面
    ├── EndView.vue           # 结束页面
    ├── BanView.vue           # 封禁页面（新增）
    ├── CosmicBackground.vue  # 宇宙背景组件
    ├── MessageWindow.vue     # 消息窗口组件
    ├── SideToast.vue         # 侧边Toast组件
    ├── ConfettiEffect.vue    # 彩纸特效组件
    ├── Fireworks.vue         # 烟花特效组件
    └── MDIcon.vue            # 图标组件
```

## 🔧 API配置

### API基础配置
在 `src/services/api.js` 中配置：

```javascript
const API_BASE = '' // 空字符串，使用相对路径（通过Vite代理）
```

### Vite代理配置
在 `vite.config.js` 中配置代理：

```javascript
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://your-api-base-url',
                changeOrigin: true,
                rewrite: (path) => path
            }
        }
    }
})
```

### 支持的API接口

参见： [湖北大学互联网应用协会社团 解密挑战网站 后端](超链接地址 "超链接title")

## 📦 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 http://localhost:5174/ 查看应用

### 构建生产版本
```bash
npm run build
```

## 🎯 使用流程

### 1. 首次访问
- 如果本地没有token，自动进入登录页面
- 可以选择注册或登录

### 2. 登录/注册
- 输入学号（最多16位）
- 点击注册或登录按钮
- **封禁检测**: 如果返回 `ban: true`，自动跳转到封禁页面
- 成功后自动进入关卡选择页面

### 3. 封禁状态处理
- **登录时检测**: 登录接口返回 `ban: true` → 跳转到封禁页面
- **页面加载时检测**: 已登录用户检查进度时发现封禁 → 跳转到封禁页面
- **游戏过程中检测**: 获取题目或提交答案时发现封禁 → 跳转到封禁页面


### 4. 关卡选择
- 显示6个关卡的网格
- 已完成的关卡显示绿色
- 当前可玩的关卡显示蓝色
- 未解锁的关卡显示灰色

### 5. 解密过程
- 点击关卡获取题目内容
- 题目以HTML格式显示
- 查看提示（如果有）
- 输入答案并提交
- **封禁检测**: 提交答案时检查封禁状态
- 正确：显示成功消息，提供下一步选择
- 错误：显示错误消息

### 6. 下一步选择
- 回到主界面：返回关卡选择
- 进入下一题：自动跳转到下一关

### 7. 完成所有关卡
- 显示结束页面
- 恭贺信息和二维码
- 烟花特效

## 🔍 状态管理

### 全局状态（appStore.js）
```javascript
state = {
    currentView: 'login',      // login, puzzle, summary, end, ban
    token: '',                 // 用户令牌
    stuId: '',                 // 学号
    currentPuzzleId: 1,        // 当前关卡ID
    puzzleData: null,          // 题目数据
    userProgress: null,        // 用户进度
    isLoading: false,          // 加载状态
    isBanned: false,           // 封禁状态
    banInfo: null,             // 封禁信息
    messageWindow: { ... },    // 消息窗口
    sideToast: { ... },        // 侧边提示
    answerInput: ''            // 答案输入
}
```

### 封禁状态流程
1. **检测时机**: 登录、页面加载、获取题目、提交答案
2. **状态更新**: `actions.setBanned(true)` 和 `actions.setBanInfo(data)`
3. **页面跳转**: `actions.setView('ban')`
4. **信息显示**: BanView组件自动调用API获取详细信息

## ⚠️ 注意事项

1. **API地址**: 必须在 `vite.config.js` 中配置正确的代理地址
2. **Token管理**: Token存储在localStorage中，清除浏览器数据会退出登录
3. **浏览器兼容性**: 需要支持现代JavaScript特性和CSS Grid
4. **网络依赖**: 需要网络连接来访问后端API
5. **封禁处理**: 封禁状态会阻止用户继续游戏，需联系管理员解封

## 🛠️ 开发说明

### 添加新功能
- 在 `src/stores/appStore.js` 中添加状态
- 在 `src/services/api.js` 中添加API调用
- 在 `src/components/` 中添加新组件
- 在 `src/App.vue` 中更新路由逻辑

### 调试技巧
- 查看浏览器控制台的网络请求
- 检查Vue DevTools中的状态变化
- 使用 `console.log` 跟踪执行流程
- 查看 `src/services/api.js` 中的调试日志

### 测试建议
- 测试正常用户流程
- 测试封禁用户的各种场景
- 测试网络错误处理
- 测试移动端显示

## 📄 许可证
MIT License

## 🤝 贡献指南
欢迎提交Issue和Pull Request来改进这个项目！
