<template>
  <div id="app-container">
    <header class="top-bar">
      <h1 class="title">参考文献逻辑关系可视化</h1>
    </header>    <main class="main-content">
      <!-- 主页视图 -->
      <div v-if="currentView === 'home'" class="home-view">
        <section class="column left-column">
          <div class="component-wrapper">
            <PaperHTML />
          </div>
        </section>        <section class="column center-column">
          <!-- Visualization 组件现在内部管理页面切换 -->
          <div class="component-wrapper">
            <Visualization />
          </div>
        </section>

        <section class="column right-column">
          <div class="component-wrapper">
            <TimeLine />
          </div>
          <div class="component-wrapper">
            <Words />
          </div>
        </section>
      </div>

      <!-- 树图视图 -->
      <div v-if="currentView === 'tree'" class="tree-view">
        <TreeDiagram />
      </div>

      <!-- 转折递进树图视图 -->
      <div v-if="currentView === 'transition'" class="tree-view">
        <TransitionTree />
      </div>

      <!-- 全文展示图视图 -->
      <div v-if="currentView === 'full'" class="tree-view">
        <FullTreeDiagram />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaperHTML from './components/PaperHTML.vue'
import Reference from './components/Reference.vue'
import Visualization from './components/Visualization.vue'
import Words from './components/Words.vue'
import TimeLine from './components/TimeLine.vue'

// 当前视图状态
const currentView = ref('home')
</script>

<style scoped>
/* 全局样式重置 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  background-color: #f0f2f5; /* 可选：设置一个背景色 */
}

/* 根容器样式 */
#app-container {
  display: flex;
  flex-direction: column; /* 垂直排列：顶部栏和主内容 */
  height: 100vh; /* 占满整个视口高度 */
}

/* 顶部栏样式 */
.top-bar {
  flex-shrink: 0; /* 防止顶部栏在空间不足时被压缩 */
  padding: 5px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.top-bar span {
  margin: 0 15px;
}

/* 按钮美化样式 */
.top-bar button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.top-bar button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.top-bar button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

/* 激活状态按钮样式 */
.top-bar button.active {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.top-bar button.active:hover {
  background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
}

/* 主内容区样式 */
.main-content {
  flex-grow: 1; /* 占据剩余的所有可用空间 */
  padding: 20px;
  overflow: hidden; /* 防止内容溢出 */
}

/* 主页视图样式 */
.home-view {
  display: flex;
  flex-direction: row; /* 水平排列三列 */
  height: 100%;
  gap: 20px; /* 设置列之间的间距 */
}

/* 树图视图样式 */
.tree-view {
  height: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

/* 通用列样式 */
.column {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 设置列内组件的间距 */
  min-height: 0; /* 关键！允许flex子项收缩 */
}

/* 各列宽度分配 */
.left-column {
  flex: 1.5; /* 增大Paper组件的宽度 */
}
.center-column {
  flex: 2; /* 增大Visualization组件的宽度 */
}
.right-column {
  flex: 1.5; /* 减小TimeLine和Words组件的宽度 */
}

/* 组件包裹容器样式 */
.component-wrapper {
  flex: 1; /* 在中间列中，让两个组件平分高度 */
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
  box-sizing: border-box; /* 让padding包含在尺寸内 */
  /* 确保组件可以填充整个包裹容器 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 防止子组件溢出 */
}

/* 让导入的组件内容填满其容器 */
.component-wrapper > * {
  width: 100%;
  flex: 1; /* 使用flex而不是height: 100% */
  min-height: 0; /* 允许flex子项缩小 */
  overflow: hidden; /* 让子组件自己控制滚动 */
  box-sizing: border-box;
}

</style>
