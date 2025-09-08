<template>  
<div class="container" ref="containerRef">
</div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import * as d3 from 'd3';

const containerRef = ref(null);

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
  // 清空容器
  d3.select(containerRef.value).selectAll('*').remove()
  
  // 获取容器尺寸
  const container = containerRef.value
  if (!container) return
  
  const margin = { top: 10, right: 20, bottom: 10, left: 10 }
  const width = container.clientWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom
  
  if (width < 100 || height < 100) return
  
  // 创建SVG
  const svg = d3.select(containerRef.value)
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
    .attr('id', d => `dot-${d.id}`)
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
  overflow-y: auto;
}
</style>
