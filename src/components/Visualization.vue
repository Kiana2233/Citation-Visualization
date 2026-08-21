<template>  
<div class="container" ref="containerRef">  <div class="header">
    <span class="header-title">引用关系可视化</span>
    <!-- 右上角按钮组 -->    <div class="header-right">
      <!-- 图例 -->
      <div class="legend" v-if="currentPage === 'home'">
        <span class="legend-item">
          <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#4A90D9" stroke-width="2.5"/></svg>
          <span>并列</span>
        </span>
        <span class="legend-item">
          <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#E8734A" stroke-width="2.5"/></svg>
          <span>转折</span>
        </span>
        <span class="legend-item">
          <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#67C23A" stroke-width="2.5"/></svg>
          <span>递进</span>
        </span>
      </div>
      <!-- 按钮组 -->
      <div class="top-right-buttons">
        <button @click="currentPage = 'home'" class="nav-btn home-btn" :class="{ active: currentPage === 'home' }">主页</button>
        <button @click="currentPage = 'tree'" class="nav-btn tree-btn" :class="{ active: currentPage === 'tree' }">树图</button>
        <button @click="currentPage = 'full'" class="nav-btn full-btn" :class="{ active: currentPage === 'full' }">全文展示图</button>
        <button v-if="currentPage === 'home'" @click="clearHighlight" class="nav-btn clear-btn" title="清除高亮">清除高亮</button>
      </div>
    </div>
  </div>
    <!-- 根据当前页面显示不同内容 -->
  <div v-if="currentPage === 'home'" class="home-page">
    <!-- <div class="usage-tip" v-if="!tipDismissed">
      <span class="tip-icon">💡</span>
      <span class="tip-text">点击连线可以高亮文章中对应的引用文献</span>
      <button class="dismiss-btn" @click="tipDismissed = true">×</button>
    </div> -->    <div ref="d3Container" class="d3-container"></div>
  </div>
  
  <!-- 合并的树图视图 -->
  <div v-else-if="currentPage === 'tree'" class="combined-tree-page">
    <div class="tree-section">
      <div class="section-header">并列树图</div>
      <TreeDiagram class="tree-component" />
    </div>
    <div class="tree-section">
      <div class="section-header">转折递进树图</div>
      <TransitionTree class="tree-component" />
    </div>
  </div>
  
  <FullTreeDiagram v-else-if="currentPage === 'full'" class="page-container" />
</div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick, watch, inject } from 'vue';
import * as d3 from 'd3';
import TreeDiagram from './TreeDiagram.vue';
import TransitionTree from './TransitionTree.vue';
import FullTreeDiagram from './FullTreeDiagram.vue';

// 注入事件总线
const emitter = inject('emitter');

// 当前页面状态
const currentPage = ref('home');

const containerRef = ref(null);
const d3Container = ref(null);

// 提示信息状态
const tipDismissed = ref(false);

// 清除高亮的函数
const clearHighlight = () => {
  // 重置所有连线样式
  d3.selectAll('path').style('stroke-width', 2).style('opacity', 1)
  
  // 发送清除高亮事件
  if (emitter) {
    emitter.emit('clear-highlight')
  }
}

const references = reactive([
  {
    id: 1,
    authors: "李树",
  },
  {
    id: 2,
    authors: "种聪",
  },  {
    id: 3,
    authors: "尹振涛",
  },
  {
    id: 4,
    authors: "Hegerty",
  },
  {
    id: 5,
    authors: "Akkoc U",
  },
  {
    id: 6,
    authors: "Kang J",
  },
  {
    id: 7,
    authors: "Cheung F",
  },
  {
    id: 8,
    authors: "Bairoliya N",
  },
  {
    id: 9,
    authors: "刘倩倩",
  },
  {
    id: 10,
    authors: "Tian X C",
  },
  {
    id: 11,
    authors: "Arechavala N S",
  },
  {
    id: 12,
    authors: "张彤进",
  },
  {
    id: 13,
    authors: "Fang L",
  },
  {
    id: 14,
    authors: "Clark A E",
  },
  {
    id: 15,
    authors: "邓小惠",
  },
  {
    id: 16,
    authors: "鲁强",
  },
  {
    id: 17,
    authors: "胡宏兵",
  },
  {
    id: 18,
    authors: "黄玖立",
  },
  {
    id: 19,
    authors: "王鹏",
  },
  {
    id: 20,
    authors: "李其容",
  },
  {
    id: 21,
    authors: "Easterlin R A",
  },
  {
    id: 22,
    authors: "苏钟萍",
  },
  {
    id: 23,
    authors: "孙计领",
  },
  {
    id: 24,
    authors: "Becker D J",
  },
  {
    id: 25,
    authors: "Andreoni J",
  },
  {
    id: 26,
    authors: "Andreoni J",
  },
  {
    id: 27,
    authors: "Roseman I J",
  },
  {
    id: 28,
    authors: "Harbaugh W T",
  },
  {
    id: 29,
    authors: "Tankersley D",
  },
  {
    id: 30,
    authors: "Park S Q",
  },
  {
    id: 31,
    authors: "Huang Y",
  },
  {
    id: 32,
    authors: "Schwart C",
  },
  {
    id: 33,
    authors: "Miller M J",
  },
  {
    id: 34,
    authors: "刘一伟",
  },
  {
    id: 35,
    authors: "Weinstein N",
  },
  {
    id: 36,
    authors: "Mair C A",
  },
  {
    id: 37,
    authors: "Caprara G V",
  },
  {
    id: 38,
    authors: "Tong H",
  },
  {
    id: 39,
    authors: "Zahavi A",
  },
  {
    id: 40,
    authors: "Fehrler S",
  },
  {
    id: 41,
    authors: "谢晓非",
  },
  {
    id: 42,
    authors: "Hardy C L",
  },
  {
    id: 43,
    authors: "Bereczkei T",
  },
  {
    id: 44,
    authors: "崔巍",
  },
  {
    id: 45,
    authors: "赵玉芳",
  },
  {
    id: 46,
    authors: "罗明忠",
  },
  {
    id: 47,
    authors: "Fredrickson J B L",
  },
  {
    id: 48,
    authors: "Raposa E B",
  },
  {
    id: 49,
    authors: "Williamson G M",
  },
  {
    id: 50,
    authors: "Grant A M",
  },
  {
    id: 51,
    authors: "Case A",
  },
  {
    id: 52,
    authors: "郭小艳",
  },
  {
    id: 53,
    authors: "温忠麟",
  },
  {
    id: 54,
    authors: "Diener E",
  },
  {
    id: 55,
    authors: "凌珑",
  },
  {
    id: 56,
    authors: "谢伟丽",
  },
  {
    id: 57,
    authors: "Carstensen L L",
  },
  {
    id: 58,
    authors: "Gabriel Z",
  },
  {
    id: 59,
    authors: "Van de Vliert E",  }
])

// 使用 D3.js 绘制可视化
function drawVisualization() {
  // 清空 D3 容器而不是整个容器
  d3.select(d3Container.value).selectAll('*').remove()
  
  // 获取 D3 容器尺寸
  const container = d3Container.value
  if (!container) return
  
  const margin = { top: 10, right: 20, bottom: 10, left: 10 }
  const width = container.clientWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom
  
  if (width < 100 || height < 100) return
  
  // 创建SVG
  const svg = d3.select(d3Container.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  
  // 计算每行高度
  const lineHeight = Math.min(height / references.length, 20)
  
  // 绘制文本和点
  const items = g.selectAll('.reference-item')
    .data(references)
    .enter()
    .append('g')
    .attr('class', 'reference-item')
    .attr('transform', (d, i) => `translate(0, ${i * lineHeight})`)
    // 添加文本
  items.append('text')
    .attr('x', 0)
    .attr('y', lineHeight / 2)
    .attr('dy', '0.35em')
    .style('font-size', '12px')
    .style('fill', 'black')
    .text(d => `[${d.id}]${d.authors}`)
    
  // 添加对齐的黑点
  items.append('circle')
    .attr('cx', 120) // 减小距离，从160改为120
    .attr('cy', lineHeight / 2)
    .attr('r', 3)    .style('fill', 'black')
    .attr('id', d => `dot-${d.id}`)

  // 添加半圆线连接指定的ID
  const connections = [
    { from: 1, to: 3, color: '#E8734A' },
    { from: 2, to: 3, color: '#E8734A' },
    // 1,4,5,6,7,8之间的并列连线（蓝色）
    { from: 1, to: 4, color: '#4A90D9' },
    { from: 1, to: 5, color: '#4A90D9' },
    { from: 1, to: 6, color: '#4A90D9' },
    { from: 1, to: 7, color: '#4A90D9' },
    { from: 1, to: 8, color: '#4A90D9' },
    { from: 4, to: 5, color: '#4A90D9' },
    { from: 4, to: 6, color: '#4A90D9' },
    { from: 4, to: 7, color: '#4A90D9' },
    { from: 4, to: 8, color: '#4A90D9' },
    { from: 5, to: 6, color: '#4A90D9' },
    { from: 5, to: 7, color: '#4A90D9' },
    { from: 5, to: 8, color: '#4A90D9' },
    { from: 6, to: 7, color: '#4A90D9' },
    { from: 6, to: 8, color: '#4A90D9' },
    { from: 7, to: 8, color: '#4A90D9' },
    // 9,10,11,12,13,3之间的并列连线（蓝色）
    { from: 9, to: 10, color: '#4A90D9' },
    { from: 9, to: 11, color: '#4A90D9' },
    { from: 9, to: 12, color: '#4A90D9' },
    { from: 9, to: 13, color: '#4A90D9' },
    { from: 9, to: 3, color: '#4A90D9' },
    { from: 10, to: 11, color: '#4A90D9' },
    { from: 10, to: 12, color: '#4A90D9' },
    { from: 10, to: 13, color: '#4A90D9' },
    { from: 10, to: 3, color: '#4A90D9' },
    { from: 11, to: 12, color: '#4A90D9' },
    { from: 11, to: 13, color: '#4A90D9' },
    { from: 11, to: 3, color: '#4A90D9' },
    { from: 12, to: 13, color: '#4A90D9' },
    { from: 12, to: 3, color: '#4A90D9' },
    { from: 13, to: 3, color: '#4A90D9' },
    // 14,15,16,17,18,19,20,21,23之间的并列连线（蓝色）
    { from: 14, to: 15, color: '#4A90D9' },
    { from: 14, to: 16, color: '#4A90D9' },
    { from: 14, to: 17, color: '#4A90D9' },
    { from: 14, to: 18, color: '#4A90D9' },
    { from: 14, to: 19, color: '#4A90D9' },
    { from: 14, to: 20, color: '#4A90D9' },
    { from: 14, to: 21, color: '#4A90D9' },
    { from: 14, to: 23, color: '#4A90D9' },
    { from: 15, to: 16, color: '#4A90D9' },
    { from: 15, to: 17, color: '#4A90D9' },
    { from: 15, to: 18, color: '#4A90D9' },
    { from: 15, to: 19, color: '#4A90D9' },
    { from: 15, to: 20, color: '#4A90D9' },
    { from: 15, to: 21, color: '#4A90D9' },
    { from: 15, to: 23, color: '#4A90D9' },
    { from: 16, to: 17, color: '#4A90D9' },
    { from: 16, to: 18, color: '#4A90D9' },
    { from: 16, to: 19, color: '#4A90D9' },
    { from: 16, to: 20, color: '#4A90D9' },
    { from: 16, to: 21, color: '#4A90D9' },
    { from: 16, to: 23, color: '#4A90D9' },
    { from: 17, to: 18, color: '#4A90D9' },
    { from: 17, to: 19, color: '#4A90D9' },
    { from: 17, to: 20, color: '#4A90D9' },
    { from: 17, to: 21, color: '#4A90D9' },
    { from: 17, to: 23, color: '#4A90D9' },
    { from: 18, to: 19, color: '#4A90D9' },
    { from: 18, to: 20, color: '#4A90D9' },
    { from: 18, to: 21, color: '#4A90D9' },
    { from: 18, to: 23, color: '#4A90D9' },
    { from: 19, to: 20, color: '#4A90D9' },
    { from: 19, to: 21, color: '#4A90D9' },
    { from: 19, to: 23, color: '#4A90D9' },
    { from: 20, to: 21, color: '#4A90D9' },
    { from: 20, to: 23, color: '#4A90D9' },
    { from: 21, to: 23, color: '#4A90D9' },
    // 24,25,26,27之间的并列连线（蓝色）
    { from: 24, to: 25, color: '#4A90D9' },
    { from: 24, to: 26, color: '#4A90D9' },
    { from: 24, to: 27, color: '#4A90D9' },
    { from: 25, to: 26, color: '#4A90D9' },
    { from: 25, to: 27, color: '#4A90D9' },
    { from: 26, to: 27, color: '#4A90D9' },
    // 24,25,26的转折连线（暖橙红）
    { from: 24, to: 25, color: '#E8734A' },
    { from: 24, to: 26, color: '#E8734A' },
    // 28,30,31,32,33,34之间的并列连线（蓝色）
    { from: 28, to: 30, color: '#4A90D9' },
    { from: 28, to: 31, color: '#4A90D9' },
    { from: 28, to: 32, color: '#4A90D9' },
    { from: 28, to: 33, color: '#4A90D9' },
    { from: 28, to: 34, color: '#4A90D9' },
    { from: 30, to: 31, color: '#4A90D9' },
    { from: 30, to: 32, color: '#4A90D9' },
    { from: 30, to: 33, color: '#4A90D9' },
    { from: 30, to: 34, color: '#4A90D9' },
    { from: 31, to: 32, color: '#4A90D9' },
    { from: 31, to: 33, color: '#4A90D9' },
    { from: 31, to: 34, color: '#4A90D9' },
    { from: 32, to: 33, color: '#4A90D9' },
    { from: 32, to: 34, color: '#4A90D9' },
    { from: 33, to: 34, color: '#4A90D9' },
    // 35,36,37之间用并列连线（蓝色）
    { from: 35, to: 36, color: '#4A90D9' },
    { from: 35, to: 37, color: '#4A90D9' },
    { from: 36, to: 37, color: '#4A90D9' },
    // 递进连线（清新绿）
    { from: 37, to: 10, color: '#67C23A' },
    { from: 37, to: 38, color: '#67C23A' },
    // 39，40，42之间并列连线（蓝色）
    { from: 39, to: 40, color: '#4A90D9' },
    { from: 39, to: 42, color: '#4A90D9' },
    { from: 40, to: 42, color: '#4A90D9' },
    // 递进连线（清新绿）
    { from: 40, to: 39, color: '#67C23A' },
    { from: 40, to: 41, color: '#67C23A' },
    { from: 42, to: 43, color: '#67C23A' },
    // 44，45，46之间用并列连线（蓝色）
    { from: 44, to: 45, color: '#4A90D9' },
    { from: 44, to: 46, color: '#4A90D9' },
    { from: 45, to: 46, color: '#4A90D9' },
    // 49，47，48之间用并列连线（蓝色）
    { from: 49, to: 47, color: '#4A90D9' },
    { from: 49, to: 48, color: '#4A90D9' },
    { from: 47, to: 48, color: '#4A90D9' },
    // 1，51之间用并列连线（蓝色）
    { from: 1, to: 51, color: '#4A90D9' },
    // 递进连线（清新绿）
    { from: 48, to: 50, color: '#67C23A' },
    { from: 49, to: 50, color: '#67C23A' },
    { from: 51, to: 52, color: '#67C23A' },
    { from: 1, to: 52, color: '#67C23A' },
    // 57，58，59之间用递进连线（清新绿）
    { from: 57, to: 58, color: '#67C23A' },
    { from: 57, to: 59, color: '#67C23A' },
    { from: 58, to: 59, color: '#67C23A' },
    // 53，55，1，56，57之间用并列连线（蓝色）
    { from: 53, to: 55, color: '#4A90D9' },
    { from: 53, to: 1, color: '#4A90D9' },
    { from: 53, to: 56, color: '#4A90D9' },
    { from: 53, to: 57, color: '#4A90D9' },
    { from: 55, to: 1, color: '#4A90D9' },
    { from: 55, to: 56, color: '#4A90D9' },
    { from: 55, to: 57, color: '#4A90D9' },
    { from: 1, to: 56, color: '#4A90D9' },
    { from: 1, to: 57, color: '#4A90D9' },
    { from: 56, to: 57, color: '#4A90D9' },
  ]
    connections.forEach(conn => {
    const fromY = (conn.from - 1) * lineHeight + lineHeight / 2
    const toY = (conn.to - 1) * lineHeight + lineHeight / 2
    const midY = (fromY + toY) / 2
    const radius = Math.abs(toY - fromY) / 2
    
    // 创建半圆路径
    const path = d3.path()
    path.arc(120, midY, radius, -Math.PI / 2, Math.PI / 2)
    
    g.append('path')
      .attr('d', path.toString())
      .style('stroke', conn.color)
      .style('stroke-width', 2)
      .style('fill', 'none')
      .style('cursor', 'pointer')      .on('click', function() {
        // 高亮当前连线
        d3.selectAll('path').style('stroke-width', 2).style('opacity', 0.6)
        d3.select(this).style('stroke-width', 4).style('opacity', 1)
        
        // 发送事件到 PaperHTML 组件
        if (emitter) {
          emitter.emit('highlight-references', {
            ids: [conn.from, conn.to]
          })
        }
      })
      .on('mouseenter', function() {
        d3.select(this).style('stroke-width', 3)
      })
      .on('mouseleave', function() {
        const isActive = d3.select(this).style('opacity') === '1'
        if (!isActive) {
          d3.select(this).style('stroke-width', 2)
        }
      })
  })
}

// 组件挂载后绘制
onMounted(() => {
  nextTick(() => {
    if (currentPage.value === 'home') {
      setTimeout(drawVisualization, 100)
    }
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    if (currentPage.value === 'home') {
      setTimeout(drawVisualization, 200)
    }
  })
})

// 监听页面切换，当切换回主页时重新绘制
watch(currentPage, (newPage) => {
  if (newPage === 'home') {
    nextTick(() => {
      setTimeout(drawVisualization, 100)
    })
  }
})

</script>

<style scoped>
.header {
  border-bottom: 1px solid #ccc;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.header-title {
  flex-shrink: 0;
}

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* D3 可视化容器 */
.home-page {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.usage-tip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tip-icon {
  font-size: 20px;
}

.tip-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.dismiss-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: all 0.3s ease;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.d3-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
}

/* 其他页面容器 */
.page-container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* 合并的树图页面样式 */
.combined-tree-page {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

.tree-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  border-bottom: 1px solid #ccc;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  background-color: #f8f9fa;
}

.tree-component {
  flex: 1;
  overflow: hidden;
}

/* 右上角按钮组样式 */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.legend {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #555;
}

.top-right-buttons {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.nav-btn:active {
  transform: translateY(0);
}

/* 激活状态 */
.nav-btn.active {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
  font-weight: 600;
}

/* 不同按钮的颜色 */
.home-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.home-btn:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
}

.tree-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.tree-btn:hover {
  background: linear-gradient(135deg, #45a049, #3d8b40);
}

.full-btn {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
}

.full-btn:hover {
  background: linear-gradient(135deg, #45B7AF, #3DA199);
}

.clear-btn {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
}

.clear-btn:hover {
  background: linear-gradient(135deg, #7f8c8d, #6c7a7b);
}
</style>
