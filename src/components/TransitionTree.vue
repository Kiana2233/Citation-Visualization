<template>
  <div class="transition-tree-container">
    <div ref="svgContainer" class="d3-tree-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as d3 from "d3"
import { refTitleMap } from "../data/references.js"

const svgContainer = ref(null)

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
  const container = svgContainer.value
  if (!container) return

  d3.select(container).selectAll("*").remove()

  const containerWidth  = container.clientWidth  || 800
  const containerHeight = container.clientHeight || 600

  const svg = d3.select(container)
    .append("svg")
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .style("cursor", "grab")

  const g = svg.append("g")

  const zoom = d3.zoom()
    .scaleExtent([0.2, 3])
    .on("zoom", (event) => g.attr("transform", event.transform))
  svg.call(zoom)
  svg.on("mousedown", () => svg.style("cursor", "grabbing"))
  svg.on("mouseup",   () => svg.style("cursor", "grab"))

  // ── 计算两棵树的布局 ──────────────────────────────────────
  const buildLayout = (treeData) => {
    const tree = d3.tree().nodeSize([26, 150])
    const root = d3.hierarchy(treeData)
    tree(root)
    let x0 = Infinity, x1 = -Infinity
    root.each(d => { if (d.x < x0) x0 = d.x; if (d.x > x1) x1 = d.x })
    return { root, x0, x1 }
  }

  const upper = buildLayout(upperTreeData)
  const lower = buildLayout(lowerTreeData)

  const GAP = 40  // 两棵树之间的间距（像素，在树坐标系中）
  const margin = { top: 40, right: 150, bottom: 40, left: 100 }

  // 上树高度
  const upperH = upper.x1 - upper.x0
  // 下树起始 y 偏移（在树坐标系中）
  const lowerOffsetY = upper.x1 + GAP - lower.x0

  // 所有节点的最大深度（取两棵树中较大者）
  const maxDepth = Math.max(upper.root.height, lower.root.height)
  const totalW = maxDepth * 150
  const totalH = upperH + GAP + (lower.x1 - lower.x0)

  // 计算初始缩放让整体适配容器
  const scaleX = (containerWidth  - margin.left - margin.right)  / totalW
  const scaleY = (containerHeight - margin.top  - margin.bottom) / totalH
  const scale  = Math.min(scaleX, scaleY, 1)

  const initX = margin.left
  const initY = margin.top - upper.x0 * scale

  svg.call(zoom.transform, d3.zoomIdentity.translate(initX, initY).scale(scale))

  // ── 分隔线（在两棵树中间） ─────────────────────────────────
  const sepY = upper.x1 + GAP / 2
  g.append("line")
    .attr("x1", -20).attr("x2", totalW + 20)
    .attr("y1", sepY).attr("y2", sepY)
    .style("stroke", "#ccc")
    .style("stroke-width", "1.5px")
    .style("stroke-dasharray", "6,4")

  // ── 绘制单棵树 ────────────────────────────────────────────
  const renderTree = (root, yOffset, color) => {
    const tg = g.append("g").attr("transform", `translate(0, ${yOffset})`)

    tg.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x))
      .style("fill", "none")
      .style("stroke", color)
      .style("stroke-width", "2px")
      .style("opacity", 0.7)

    const node = tg.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)

    node.append("circle")
      .attr("r", 6)
      .style("fill", d => d.children ? color : d3.color(color).darker(0.5))
      .style("stroke", "#fff")
      .style("stroke-width", "2px")

    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -10 : 10)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333")
      .style("font-weight", d => d.depth < 2 ? "bold" : "normal")
      .text(d => {
        const id = parseInt(d.data.name)
        if (!isNaN(id) && !d.children && refTitleMap[id]) {
          return `[${id}]${refTitleMap[id]}`
        }
        return d.data.name
      })

    node.on("mouseover", function(event, d) {
      d3.select(this).select("circle")
        .transition().duration(200).attr("r", 8).style("fill", "#FF9800")
    })
    .on("mouseout", function(event, d) {
      d3.select(this).select("circle")
        .transition().duration(200).attr("r", 6)
        .style("fill", d.children ? color : d3.color(color).darker(0.5))
    })
  }

  renderTree(upper.root, 0,             "#FF6B6B")
  renderTree(lower.root, lowerOffsetY,  "#4ECDC4")
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
  box-sizing: border-box;
}

.d3-tree-container {
  flex: 1;
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  cursor: grab;
}

.d3-tree-container:active {
  cursor: grabbing;
}
</style>