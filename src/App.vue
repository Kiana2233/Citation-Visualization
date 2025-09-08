<template>
  <div id="app-container">
    <header class="top-bar">
      <span>方式一：<button>button</button></span>
      <span>方式二：<button>button</button></span>
      <span>方式三：<button>button</button></span>
    </header>

    <main class="main-content">
      <section class="column left-column">
        <Paper />
      </section>

      <section class="column center-column">
        <div class="component-wrapper">
          <TimeLine />
        </div>
        <div class="component-wrapper">
          <Words />
        </div>
      </section>

      <section class="column right-column">
        <Visualization />
      </section>
    </main>
  </div>
</template>

<script setup>
import Paper from './components/Paper.vue'
import Reference from './components/Reference.vue'
import Visualization from './components/Visualization.vue'
import Words from './components/Words.vue';
import TimeLine from './components/TimeLine.vue';
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
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #dcdfe6;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.top-bar span {
  margin: 0 15px;
}

/* 主内容区样式 */
.main-content {
  display: flex;
  flex-direction: row; /* 水平排列三列 */
  flex-grow: 1; /* 占据剩余的所有可用空间 */
  padding: 20px;
  gap: 20px; /* 设置列之间的间距 */
  overflow: hidden; /* 防止内容溢出 */
}

/* 通用列样式 */
.column {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 设置列内组件的间距 */
}

/* 各列宽度分配 */
.left-column {
  flex: 1.5; /* 增大Paper组件的宽度 */
}
.center-column {
  flex: 1.5; /* 减小TimeLine和Words组件的宽度 */
}
.right-column {
  flex: 2; /* 增大Visualization组件的宽度 */
}

/* 组件包裹容器样式 */
.component-wrapper {
  flex: 1; /* 在中间列中，让两个组件平分高度 */
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
  /* 确保组件可以填充整个包裹容器 */
  display: flex;
  flex-direction: column;
}

/* 让导入的组件内容填满其容器 */
.component-wrapper > * {
  width: 100%;
  height: 100%;
  overflow: auto; /* 如果组件内容过多，则显示滚动条 */
}

</style>
