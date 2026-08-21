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
/* 根容器：顶栏 + 主内容纵向排列 */
#app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 顶栏：一条发丝线分隔，不用阴影 */
.top-bar {
  flex-shrink: 0;
  padding: 14px 24px;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  text-align: center;
  z-index: 10;
}

.title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--text);
}

/* 主内容区 */
.main-content {
  flex-grow: 1;
  padding: var(--gap);
  overflow: hidden;
}

/* 主页三栏 */
.home-view {
  display: flex;
  flex-direction: row;
  height: 100%;
  gap: var(--gap);
}

/* 面板：白底 + 1px 描边，去掉阴影与大圆角 */
.tree-view,
.component-wrapper {
  border: 1px solid var(--border);
  border-radius: var(--r);
  background-color: var(--surface);
}

/* 树图整页视图 */
.tree-view {
  height: 100%;
  padding: var(--pad);
}

/* 通用列 */
.column {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  min-height: 0; /* 关键：允许 flex 子项收缩 */
}

/* 各列宽度分配 */
.left-column {
  flex: 1.5;
}

.center-column {
  flex: 2;
}

.right-column {
  flex: 1.5;
}

/* 组件包裹容器 */
.component-wrapper {
  flex: 1;
  padding: var(--pad);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 让子组件填满包裹容器 */
.component-wrapper > * {
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
