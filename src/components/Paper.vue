<template>
  <div class="edge-pdf-viewer">
    <!-- 主内容区域 -->
    <div class="pdf-main">
         <!-- PDF内容区域 -->
      <div class="pdf-content">
        <!-- 原生PDF查看器 -->
        <iframe 
          src="/慈善捐赠行为对居民主观幸福感的影响研究_张冰涛.pdf"
          class="pdf-iframe"
          title="PDF查看器"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.edge-pdf-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

/* 主内容区域 */
.pdf-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* PDF内容区域 */
.pdf-content {
  flex: 1;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
