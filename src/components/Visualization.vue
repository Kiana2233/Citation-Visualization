<template>  
<div class="container" ref="containerRef">
  <!-- 右上角按钮组 -->
  <div class="top-right-buttons">
    <button @click="$emit('switchToTree')" class="nav-btn tree-btn">并列树图</button>
    <button @click="$emit('switchToTransition')" class="nav-btn transition-btn">转折递进树图</button>
    <button @click="$emit('switchToFull')" class="nav-btn full-btn">全文展示图</button>
  </div>
  <!-- D3 可视化容器 -->
  <div ref="d3Container" class="d3-container"></div>
</div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import * as d3 from 'd3';

// 定义 emit 事件
const emit = defineEmits(['switchToTree', 'switchToTransition', 'switchToFull']);

const containerRef = ref(null);
const d3Container = ref(null);

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
    .attr('r', 3)
    .style('fill', 'black')
    .attr('id', d => `dot-${d.id}`)  // 添加半圆线连接指定的ID
  const connections = [
    { from: 1, to: 3, color: 'red' },
    { from: 2, to: 3, color: 'red' },
    // 1,4,5,6,7,8之间的绿色两两连线
    { from: 1, to: 4, color: 'green' },
    { from: 1, to: 5, color: 'green' },
    { from: 1, to: 6, color: 'green' },
    { from: 1, to: 7, color: 'green' },
    { from: 1, to: 8, color: 'green' },
    { from: 4, to: 5, color: 'green' },
    { from: 4, to: 6, color: 'green' },
    { from: 4, to: 7, color: 'green' },
    { from: 4, to: 8, color: 'green' },
    { from: 5, to: 6, color: 'green' },
    { from: 5, to: 7, color: 'green' },
    { from: 5, to: 8, color: 'green' },
    { from: 6, to: 7, color: 'green' },
    { from: 6, to: 8, color: 'green' },
    { from: 7, to: 8, color: 'green' },
    // 9,10,11,12,13,3之间的绿色两两连线
    { from: 9, to: 10, color: 'green' },
    { from: 9, to: 11, color: 'green' },
    { from: 9, to: 12, color: 'green' },
    { from: 9, to: 13, color: 'green' },
    { from: 9, to: 3, color: 'green' },
    { from: 10, to: 11, color: 'green' },
    { from: 10, to: 12, color: 'green' },
    { from: 10, to: 13, color: 'green' },
    { from: 10, to: 3, color: 'green' },
    { from: 11, to: 12, color: 'green' },
    { from: 11, to: 13, color: 'green' },
    { from: 11, to: 3, color: 'green' },
    { from: 12, to: 13, color: 'green' },
    { from: 12, to: 3, color: 'green' },
    { from: 13, to: 3, color: 'green' },
    // 14,15,16,17,18,19,20,21,23之间的绿色两两连线
    { from: 14, to: 15, color: 'green' },
    { from: 14, to: 16, color: 'green' },
    { from: 14, to: 17, color: 'green' },
    { from: 14, to: 18, color: 'green' },
    { from: 14, to: 19, color: 'green' },
    { from: 14, to: 20, color: 'green' },
    { from: 14, to: 21, color: 'green' },
    { from: 14, to: 23, color: 'green' },
    { from: 15, to: 16, color: 'green' },
    { from: 15, to: 17, color: 'green' },
    { from: 15, to: 18, color: 'green' },
    { from: 15, to: 19, color: 'green' },
    { from: 15, to: 20, color: 'green' },
    { from: 15, to: 21, color: 'green' },
    { from: 15, to: 23, color: 'green' },
    { from: 16, to: 17, color: 'green' },
    { from: 16, to: 18, color: 'green' },
    { from: 16, to: 19, color: 'green' },
    { from: 16, to: 20, color: 'green' },
    { from: 16, to: 21, color: 'green' },
    { from: 16, to: 23, color: 'green' },
    { from: 17, to: 18, color: 'green' },
    { from: 17, to: 19, color: 'green' },
    { from: 17, to: 20, color: 'green' },
    { from: 17, to: 21, color: 'green' },
    { from: 17, to: 23, color: 'green' },
    { from: 18, to: 19, color: 'green' },
    { from: 18, to: 20, color: 'green' },
    { from: 18, to: 21, color: 'green' },
    { from: 18, to: 23, color: 'green' },
    { from: 19, to: 20, color: 'green' },
    { from: 19, to: 21, color: 'green' },
    { from: 19, to: 23, color: 'green' },
    { from: 20, to: 21, color: 'green' },
    { from: 20, to: 23, color: 'green' },
    { from: 21, to: 23, color: 'green' },
    // 24,25,26,27之间的绿色两两连线
    { from: 24, to: 25, color: 'green' },
    { from: 24, to: 26, color: 'green' },
    { from: 24, to: 27, color: 'green' },
    { from: 25, to: 26, color: 'green' },
    { from: 25, to: 27, color: 'green' },
    { from: 26, to: 27, color: 'green' },
    // 24,25,26的红两两连线
    { from: 24, to: 25, color: 'red' },
    { from: 24, to: 26, color: 'red' },
    // 28,30,31,32,33,34之间的绿两两连线
    { from: 28, to: 30, color: 'green' },
    { from: 28, to: 31, color: 'green' },
    { from: 28, to: 32, color: 'green' },
    { from: 28, to: 33, color: 'green' },
    { from: 28, to: 34, color: 'green' },
    { from: 30, to: 31, color: 'green' },
    { from: 30, to: 32, color: 'green' },
    { from: 30, to: 33, color: 'green' },
    { from: 30, to: 34, color: 'green' },
    { from: 31, to: 32, color: 'green' },
    { from: 31, to: 33, color: 'green' },
    { from: 31, to: 34, color: 'green' },
    { from: 32, to: 33, color: 'green' },
    { from: 32, to: 34, color: 'green' },
    { from: 33, to: 34, color: 'green' },
    // 35,36,37之间用绿线两两连接
    { from: 35, to: 36, color: 'green' },
    { from: 35, to: 37, color: 'green' },
    { from: 36, to: 37, color: 'green' },
    // 10，38之间黄线连接
    { from: 37, to: 10, color: 'orange' },
    { from: 37, to: 38, color: 'orange' },
    // 39，40，42之间绿线两两连接
    { from: 39, to: 40, color: 'green' },
    { from: 39, to: 42, color: 'green' },
    { from: 40, to: 42, color: 'green' },
    // 39，41，43两两用橙线连接
    { from: 40, to: 39, color: 'orange' },
    { from: 40, to: 41, color: 'orange' },
    { from: 42, to: 43, color: 'orange' },
    // 44，45，46之间用绿线两两连接
    { from: 44, to: 45, color: 'green' },
    { from: 44, to: 46, color: 'green' },
    { from: 45, to: 46, color: 'green' },
    // 49，47，48之间用绿线两两连接
    { from: 49, to: 47, color: 'green' },
    { from: 49, to: 48, color: 'green' },
    { from: 47, to: 48, color: 'green' },
    // 1，51之间用绿线连接
    { from: 1, to: 51, color: 'green' },
    // 50，52之间用橙线连接
    { from: 48, to: 50, color: 'orange' },
    { from: 49, to: 50, color: 'orange' },
    { from: 51, to: 52, color: 'orange' },
    { from: 1, to: 52, color: 'orange' },
    // 57，58，59之间用橙线连接
    { from: 57, to: 58, color: 'orange' },
    { from: 57, to: 59, color: 'orange' },
    { from: 58, to: 59, color: 'orange' },
    // 53，55，1，56，57之间用绿线连接
    { from: 53, to: 55, color: 'green' },
    { from: 53, to: 1, color: 'green' },
    { from: 53, to: 56, color: 'green' },
    { from: 53, to: 57, color: 'green' },
    { from: 55, to: 1, color: 'green' },
    { from: 55, to: 56, color: 'green' },
    { from: 55, to: 57, color: 'green' },
    { from: 1, to: 56, color: 'green' },
    { from: 1, to: 57, color: 'green' },
    { from: 56, to: 57, color: 'green' },
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
  })
}

// 组件挂载后绘制
onMounted(() => {
  nextTick(() => {
    setTimeout(drawVisualization, 100)
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(drawVisualization, 200)
  })
})

</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* D3 可视化容器 */
.d3-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
}

/* 右上角按钮组样式 */
.top-right-buttons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 1000; /* 确保按钮在最上层 */
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

/* 不同按钮的颜色 */
.tree-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.tree-btn:hover {
  background: linear-gradient(135deg, #45a049, #3d8b40);
}

.transition-btn {
  background: linear-gradient(135deg, #FF6B6B, #E55353);
}

.transition-btn:hover {
  background: linear-gradient(135deg, #E55353, #D44545);
}

.full-btn {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
}

.full-btn:hover {
  background: linear-gradient(135deg, #45B7AF, #3DA199);
}
</style>
