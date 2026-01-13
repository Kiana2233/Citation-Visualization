<template>
  <div class="wordcloud-wrapper">
    <div class="header">关键词云</div>
    <div ref="containerRef" id="wordcloud"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

// 容器引用
const containerRef = ref(null)

const keywords = [
  // 核心变量（最大字号）
  { text: "慈善捐赠", size: 40 },
  { text: "主观幸福感", size: 36 },
  
  // 关键机制（较大字号）
  { text: "温情效应", size: 28 },
  { text: "社会关联能力", size: 26 },
  { text: "社会地位", size: 24 },
  { text: "积极情绪", size: 22 },
  { text: "非纯利他动机", size: 20 },
  
  // 重要发现（中等字号）
  { text: "CFPS数据", size: 19 },
  { text: "城镇人群", size: 18 },
  { text: "低学历群体", size: 18 },
  { text: "收入门槛效应", size: 17 },
  { text: "高收入满意度", size: 16 },
  { text: "集体主义文化", size: 15 },
  
  // 分析方法（中等偏小）
  { text: "倾向得分匹配", size: 14 },
  { text: "中介效应", size: 14 },
  { text: "异质性分析", size: 13 },
  { text: "稳健性检验", size: 12 },
  
  // 次级变量（较小字号）
  { text: "社会资本", size: 11 },
  { text: "社会网络", size: 11 },
  { text: "下行比较", size: 10 },
  { text: "利他主义", size: 10 },
  { text: "中年效应", size: 9 },
  
  // 政策相关（最小字号）
  { text: "共同富裕", size: 8 },
  { text: "慈善组织", size: 8 },
  { text: "监管引导", size: 7 },
  { text: "微观经济效应", size: 7 }
];

// 随机颜色生成函数
function getRandomColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FFB6C1', '#87CEEB', '#F0E68C', '#FFE4B5',
    '#FFA07A', '#20B2AA', '#87CEFA', '#F4A460', '#98FB98',
    '#F5DEB3', '#FF69B4', '#00CED1', '#FFD700', '#FF7F50'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 词云图绘制函数
function drawWordCloud() {
  // 清空容器
  d3.select('#wordcloud').selectAll('*').remove()
  
  // 获取容器尺寸 - 根据App.vue中Words组件的实际位置计算
  const container = containerRef.value
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight
  
  // 如果容器太小，不绘制
  if (width < 100 || height < 100) return
  
  // 根据容器大小动态调整字体大小
  const scaleFactor = Math.min(width / 400, height / 300)
  
  // 创建SVG
  const svg = d3.select('#wordcloud')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  
  // 创建词云布局 - 螺旋式紧凑排列
  const layout = cloud()
    .size([width, height])
    .words(keywords.map(d => ({
      text: d.text,
      size: Math.max(8, d.size * scaleFactor), // 动态缩放字体大小，最小8px
      color: getRandomColor()
    })))
    .padding(1) // 最小间距确保不重叠
    .rotate(() => ~~(Math.random() * 2) * 90) // 水平或垂直
    .font('Microsoft YaHei, sans-serif')
    .fontSize(d => d.size)
    .spiral('archimedean') // 阿基米德螺旋
    .on('end', draw)
  
  layout.start()
  
  function draw(words) {
    const g = svg.append('g')
      .attr('transform', `translate(${width/2},${height/2})`)
    
    // 绘制词云
    const text = g.selectAll('text')
      .data(words)
      .enter().append('text')
      .style('font-size', d => `${d.size}px`)
      .style('font-family', 'Microsoft YaHei, sans-serif')
      .style('font-weight', 'bold')
      .style('fill', d => d.color)
      .style('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
      .text(d => d.text)
      .style('opacity', 0)
    
    // 添加动画效果
    text.transition()
      .duration(1000)
      .delay((d, i) => i * 30)
      .style('opacity', 1)
  }
}

// 组件挂载后绘制词云
onMounted(() => {
  nextTick(() => {
    // 延迟绘制，确保容器已经完全渲染
    setTimeout(drawWordCloud, 100)
  })
  
  // 监听窗口大小变化，重新绘制
  window.addEventListener('resize', () => {
    setTimeout(drawWordCloud, 200)
  })
})
</script>

<style scoped>
.header {
  border-bottom: 1px solid #ccc;
  padding: 4px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
}

.wordcloud-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#wordcloud {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
</style>