<template>
  <div class="transition-tree-container">
    <!-- <h2>转折递进树图</h2> -->
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

// 上方树的数据结构
const upperTreeData = {
  name: "转折",
  children: [
    {
      name: "绪论",
      children: [
        {
            name: "但",
            children: [
            { name: "1" },
            { name: "3" }
            ]
          
        },
        {
          name: "但",
          children: [
            { name: "2" },
            { name: "3" },
          ]
        }
      ]
    },
    {
      name: "研究假说",
      children: [
        {
            name: "比对",
            children: [
            { name: "24" },
            { name: "25" },
            ]
        },
        {
            name: "比对",
            children: [
            { name: "24" },
            { name: "26" },
            ]
        },
        {
            name: "然而",
            children: [
            { name: "51" },
            { name: "52" },
            ]
        },
      ]
    },
  ]
}

// 下方树的数据结构
const lowerTreeData = {
  name: "递进",
  children: [
    {
      name: "研究假说",
      children: [
        {
          name: "从而",
          children: [
            { name: "10" },
          ]
        },
        {
          name: "由此",
          children: [
            { name: "38" },
          ]
        },
        {
          name: "进而",
          children: [
            { name: "39" },
            { name: "41" },
            { name: "43" },
          ]
        },
        {
          name: "进一步",
          children: [
            { name: "50" },
          
          ]
        }
      ]
    },
    {
      name: "实证结果回归与分析",
      children:[
        {name: "进而",
          children:[
            {name: "59"},
          ]
        },
      ]
    }
       
    
  ]
}

const drawTree = () => {
  const container = treeContainer.value
  if (!container) return

  // 清空容器
  d3.select(container).selectAll("*").remove()

  const containerWidth = container.clientWidth || 800
  const containerHeight = container.clientHeight || 600
  
  const margin = { top: 50, right: 200, bottom: 50, left: 200 }
  
  // 创建可缩放的SVG容器
  const svg = d3.select(container)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("border", "1px solid #ddd")
    .style("cursor", "grab")

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

  // 添加鼠标按下时的抓取效果
  svg.on("mousedown", () => {
    svg.style("cursor", "grabbing")
  })
  svg.on("mouseup", () => {
    svg.style("cursor", "grab")
  })

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // 绘制上方的树
  drawSingleTree(g, upperTreeData, 50, "#FF6B6B", "上")
  
  // 绘制下方的树  
  drawSingleTree(g, lowerTreeData, containerHeight - 400, "#4ECDC4", "下")
}

const drawSingleTree = (parentGroup, treeData, yOffset, color, position) => {
  // 创建树布局 - 使用更大的尺寸，参考TreeDiagram.vue
  const treeWidth = 800
  const treeHeight = 300
  
  const tree = d3.tree()
    .size([treeHeight, treeWidth])

  // 处理数据
  const root = d3.hierarchy(treeData)
  const treeLayout = tree(root)
  // 创建组用于放置这棵树
  const treeGroup = parentGroup.append("g")
    .attr("transform", `translate(0, ${yOffset})`)
  // 绘制连线
  treeGroup.selectAll(".link")
    .data(treeLayout.links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))
    .style("fill", "none")
    .style("stroke", color)
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // 创建节点组
  const node = treeGroup.selectAll(".node")
    .data(treeLayout.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`)

  // 绘制节点圆圈
  node.append("circle")
    .attr("r", 6)
    .style("fill", d => d.children ? color : d3.color(color).darker(0.5))
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
    .style("font-weight", d => d.depth < 2 ? "bold" : "normal")
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
      .style("fill", d.children ? color : d3.color(color).darker(0.5))
  })
}

onMounted(() => {
  drawTree()
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(drawTree, 100)
  })
})
</script>

<style scoped>
.transition-tree-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.transition-tree-container h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 24px;
  text-align: center;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 20px;
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
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  position: relative;
  cursor: grab;
}

.d3-tree-container:active {
  cursor: grabbing;
}

.d3-tree-container svg {
  display: block;
}
</style>