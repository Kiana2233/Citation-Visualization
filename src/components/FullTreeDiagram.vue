<template>
  <div class="tree-container">
    <!-- <h2>全文树状图</h2> -->
    <div class="controls">
      <div class="zoom-controls">
        <button @click="zoomIn" class="control-btn">放大</button>
        <button @click="zoomOut" class="control-btn">缩小</button>
        <button @click="resetZoom" class="control-btn">重置</button>
      </div>
      <!-- <div class="help-text">
        💡 提示：可以用鼠标拖拽和滚轮缩放来浏览完整的树状图
      </div> -->
    </div>
    <div class="tree-content">
      <div ref="treeContainer" class="d3-tree-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as d3 from "d3"

const treeContainer = ref(null)
let zoomBehavior = null
let svgElement = null

// 缩放控制方法
const zoomIn = () => {
  if (zoomBehavior && svgElement) {
    svgElement.transition().duration(300).call(
      zoomBehavior.scaleBy, 1.5
    )
  }
}

const zoomOut = () => {
  if (zoomBehavior && svgElement) {
    svgElement.transition().duration(300).call(
      zoomBehavior.scaleBy, 1 / 1.5
    )
  }
}

const resetZoom = () => {
  if (zoomBehavior && svgElement) {
    svgElement.transition().duration(500).call(
      zoomBehavior.transform,
      d3.zoomIdentity
    )
  }
}

// 示例树状数据
const treeData = {
  name: "全文",
  children: [
    {
      name: "绪论",
      children: [
        { name: "1" },
        { name: "2" },
        { name: "3" },
        { name: "4" },
        { name: "5" },
        { name: "6" },
        { name: "7" },
        { name: "8" },
        { name: "8" },
        { name: "9" },
        { name: "10" },
        { name: "11" },
        { name: "12" },
        { name: "13" },
        { name: "14" },
        { name: "15" },
        { name: "16" },
        { name: "17" },
        { name: "18" },
        { name: "19" },
        { name: "20" },
        { name: "21" },
        { name: "23" },
        { name: "24" },
        { name: "25" },
        { name: "26" },
        { name: "27" },
      ]
    },
    {
      name: "研究假说",
      children: [
          {
            name: '(一)"温情效应"理论模型',
            children: [
              { name: "24" },
              { name: "25" },
              { name: "26" },
              { name: "28" },
              { name: "30" },
              { name: "31" },
              { name: "32" },
              { name: "33" },
              { name: "34" },
            ]
          },
            {
            name: '(二)社会关联方面',
            children: [
              { name: "35" },
              { name: "36" },
              { name: "37" },
              { name: "10" },
              { name: "38" },
            ]
            },
          {
            name: '(三)社会地位方面',
            children: [
              { name: "39" },
              { name: "40" },
              { name: "41" },
              { name: "42" },
              { name: "43" },
              { name: "44" },
              { name: "45" },
              { name: "46" },
            ]
          },
          {
          name: '(四)积极情绪方面',
          children: [
            {name: "47"},
            {name: "48"},
            {name: "49"},
            {name: "50"},
            {name: "51"},
            {name: "52"},
          ]
          },
      ]
    },
    {
      name: "研究设计",
      children: [
        {
          name: "（二）基准模型与中介模型",
          children: [
            { name: "53" },
          ]
        },
        {
          name: "（三）变量的选取与描述性统计",
          children: [
            { name:"54" },            
            { name:"55" },            
          ]
        }
      ]
    },
    {
      name: "实证结果回归与分析",
      children: [
        {
          name: "（二）稳健性检验",
          children: [
            { name: "56" },
          ]
        },
        {
          name: "（三）异质性分析",
          children: [
            { name: "57"},            
            { name: "58"},            
            { name: "59"},            
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

  // 动态计算所需尺寸
  const root = d3.hierarchy(treeData)
  const nodeCount = root.descendants().length
  
  // 根据节点数量动态调整尺寸
  const minWidth = 1200
  const minHeight = Math.max(800, nodeCount * 20)
  
  const containerWidth = container.clientWidth || 800
  const containerHeight = container.clientHeight || 600
  
  const width = Math.max(minWidth, containerWidth)
  const height = Math.max(minHeight, containerHeight)
  
  const margin = { top: 50, right: 200, bottom: 50, left: 200 }

  // 创建可缩放的SVG容器
  const svg = d3.select(container)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("border", "1px solid #ddd")
    .style("background", "#fafafa")

  // 添加缩放功能
  const zoom = d3.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
      g.attr("transform", event.transform)
    })

  svg.call(zoom)
  
  // 保存缩放行为和SVG元素的引用
  zoomBehavior = zoom
  svgElement = svg

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // 创建树布局
  const tree = d3.tree()
    .size([height - margin.top - margin.bottom, width - margin.left - margin.right])

  // 处理数据
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
    .style("stroke", "#666")
    .style("stroke-width", "2px")
    .style("stroke-opacity", 0.8)

  // 创建节点组
  const node = g.selectAll(".node")
    .data(treeLayout.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)

  // 绘制节点圆圈
  node.append("circle")
    .attr("r", d => d.depth === 0 ? 10 : (d.children ? 8 : 6))
    .style("fill", d => {
      if (d.depth === 0) return "#FF5722"  // 根节点 - 红色
      if (d.children) return "#4CAF50"     // 有子节点 - 绿色
      return "#2196F3"                     // 叶节点 - 蓝色
    })
    .style("stroke", "#fff")
    .style("stroke-width", "3px")
    .style("filter", "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))")

  // 添加节点文本
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? -15 : 15)
    .style("text-anchor", d => d.children ? "end" : "start")
    .style("font-size", d => d.depth === 0 ? "16px" : "14px")
    .style("font-family", "Arial, sans-serif")
    .style("fill", "#333")
    .style("font-weight", d => d.depth < 2 ? "bold" : "normal")
    .text(d => d.data.name)

  // 添加鼠标悬停效果
  node.on("mouseover", function(event, d) {
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", d => (d.depth === 0 ? 12 : (d.children ? 10 : 8)))
      .style("fill", "#FF9800")
      .style("stroke-width", "4px")
    
    // 高亮相关路径
    const pathToRoot = d.ancestors().slice(1)
    pathToRoot.forEach(ancestor => {
      d3.selectAll(".link")
        .filter(link => link.target === d || pathToRoot.includes(link.target))
        .style("stroke", "#FF9800")
        .style("stroke-width", "3px")
    })
  })
  .on("mouseout", function(event, d) {
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .attr("r", d => d.depth === 0 ? 10 : (d.children ? 8 : 6))
      .style("fill", d => {
        if (d.depth === 0) return "#FF5722"
        if (d.children) return "#4CAF50"
        return "#2196F3"
      })
      .style("stroke-width", "3px")
    
    // 恢复路径样式
    d3.selectAll(".link")
      .style("stroke", "#666")
      .style("stroke-width", "2px")
  })

  // 添加点击事件
  node.on("click", function(event, d) {
    console.log("点击节点:", d.data.name)
    // 可以在这里添加节点点击的逻辑
  })
}

onMounted(() => {
  drawTree()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(drawTree, 100) // 添加延迟以确保容器尺寸更新
  })
})
</script>

<style scoped>
.tree-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tree-container h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 26px;
  text-align: center;
  font-weight: 600;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px 20px;
}

.zoom-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background: #45a049;
}

.help-text {
  color: #666;
  font-size: 14px;
  font-style: italic;
  background: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
}

.tree-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.d3-tree-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fafafa, #f0f0f0);
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  overflow: hidden;
  position: relative;
  cursor: grab;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.d3-tree-container:active {
  cursor: grabbing;
}

.d3-tree-container svg {
  display: block;
}

/* 节点样式 */
.node {
  cursor: pointer;
}

.node circle {
  transition: all 0.3s ease;
}

.node text {
  pointer-events: none;
  user-select: none;
}

/* 连线样式 */
.link {
  transition: all 0.3s ease;
}
</style>
