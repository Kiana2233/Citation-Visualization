<template>
  <div class="tree-container">
    <h2>并列树图</h2>
    <div class="tree-content">
      <div ref="treeContainer" class="d3-tree-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as d3 from "d3"

const treeContainer = ref(null)

// 模拟四层树状数据
const treeData = {
  name: "并列",
  children: [
    {
      name: "分支A",
      children: [
        {
          name: "A1",
          children: [
            { name: "A1-1" },
            { name: "A1-2" },
            { name: "A1-3" }
          ]
        },
        {
          name: "A2",
          children: [
            { name: "A2-1" },
            { name: "A2-2" }
          ]
        }
      ]
    },
    {
      name: "分支B",
      children: [
        {
          name: "B1",
          children: [
            { name: "B1-1" },
            { name: "B1-2" }
          ]
        },
        {
          name: "B2",
          children: [
            { name: "B2-1" },
            { name: "B2-2" },
            { name: "B2-3" }
          ]
        },
        {
          name: "B3",
          children: [
            { name: "B3-1" }
          ]
        }
      ]
    },
    {
      name: "分支C",
      children: [
        {
          name: "C1",
          children: [
            { name: "C1-1" },
            { name: "C1-2" }
          ]
        }
      ]
    }
  ]
}

const drawTree = () => {
  const container = treeContainer.value
  if (!container) return

  // 清空容器
  d3.select(container).selectAll("*").remove()

  // 设置SVG尺寸
  const width = container.clientWidth || 800
  const height = container.clientHeight || 600
  const margin = { top: 20, right: 120, bottom: 20, left: 120 }

  // 创建SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // 创建树布局
  const tree = d3.tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])

  // 处理数据
  const root = d3.hierarchy(treeData)
  const treeLayout = tree(root)

  // 绘制连线
  g.selectAll(".link")
    .data(treeLayout.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))
    .style("fill", "none")
    .style("stroke", "#999")
    .style("stroke-width", "2px")

  // 创建节点组
  const node = g.selectAll(".node")
    .data(treeLayout.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)

  // 绘制节点圆圈
  node.append("circle")
    .attr("r", 6)
    .style("fill", d => d.children ? "#4CAF50" : "#2196F3")
    .style("stroke", "#fff")
    .style("stroke-width", "2px")

  // 添加节点文本
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? -10 : 10)
    .style("text-anchor", d => d.children ? "end" : "start")
    .style("font-size", "12px")
    .style("font-family", "Arial, sans-serif")
    .style("fill", "#333")
    .text(d => d.data.name)

  // 添加鼠标悬停效果
  node.on("mouseover", function(event, d) {
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", 8)
      .style("fill", "#FF9800")
  })
  .on("mouseout", function(event, d) {
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", 6)
      .style("fill", d.children ? "#4CAF50" : "#2196F3")
  })
}

onMounted(() => {
  drawTree()
  
  // 监听窗口大小变化
  window.addEventListener('resize', drawTree)
})
</script>

<style scoped>
.tree-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tree-container h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.tree-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tree-content p {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.d3-tree-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.d3-tree-container svg {
  display: block;
}
</style>
