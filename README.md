# 参考文献逻辑关系可视化

基于 Vue 3 + Vite + D3.js v7 构建的学术论文参考文献关系可视化系统，对论文《慈善捐赠行为对居民主观幸福感的影响研究》的 59 篇参考文献之间的引用逻辑关系进行交互式展示。

## 主页连线算法

主页采用**弧形链接图（Arc Diagram）**展示参考文献之间的三类逻辑关系：并列（蓝色）、转折（橙色）、递进（绿色）。

### 1. 布局结构

```
         [1]李树  ●──────┐
         [2]种聪  ●──┐   │
         [3]尹振涛 ●──┼─┼─┘
         [4]Hegerty ●──┘ │
                        │
    text x=0        ● x=120        arc center at x=120
```

- 59 条参考文献垂直等距排列，每行高度 = `min(容器高度 / 59, 20px)`
- 每条文献在 `x=0` 处绘制文本标签 `[id]作者名`，字号 12px
- 每条文献在 `x=120` 处绘制一个半径 3px 的黑色圆点（锚点）
- 所有连线从锚点位置（x=120）出发

### 2. 半圆弧绘制算法

连线使用 **`d3.path().arc()`** 绘制半圆弧，核心代码：

```javascript
const fromY = (conn.from - 1) * lineHeight + lineHeight / 2  // 起点引用所在行的 Y 坐标
const toY   = (conn.to - 1)   * lineHeight + lineHeight / 2  // 终点引用所在行的 Y 坐标
const midY  = (fromY + toY) / 2                                // 圆弧圆心的 Y 坐标
const radius = Math.abs(toY - fromY) / 2                       // 圆弧半径

const path = d3.path()
path.arc(120, midY, radius, -Math.PI / 2, Math.PI / 2)        // 绘制右半圆
```

#### 几何原理

`d3.path().arc(cx, cy, r, startAngle, endAngle)` 在 SVG 坐标系中绘制圆弧：

- **圆心**: `(120, midY)` — X 固定在锚点列，Y 取两引用之间的中点
- **半径**: 两引用垂直间距的一半，即 `|fromY - toY| / 2`
- **角度范围**: 从 `-π/2`（正上方）到 `+π/2`（正下方），即顺时针绘制右半圆

这意味着所有弧线向右凸出，从上方引用出发，经右侧半圆弧到达下方引用：

```
    [1] ●────────╮
                 │
    [2] ●──╮    │
           │    │
    [3] ●──┼────╯
           │
    [4] ●──╯
```

#### 为什么是右半圆

- 锚点位于文本右侧（x=120），右半圆弧保证了连线向外侧展开，不会与左侧的文本标签重叠
- 角度参数 `-π/2` 到 `+π/2` 在 SVG 坐标系中（Y 轴向下）恰好对应"从上方顺时针旋转到下方"的右半部分

### 3. 交互机制

```javascript
// 点击连线 → 高亮 + 联动右侧论文文本
path.on('click', function() {
  d3.selectAll('path').style('stroke-width', 2).style('opacity', 0.6)  // 所有连线变淡
  d3.select(this).style('stroke-width', 4).style('opacity', 1)          // 当前连线加粗高亮
  emitter.emit('highlight-references', { ids: [conn.from, conn.to] })   // 通知论文组件
})

// 悬停 → 轻微加粗
path.on('mouseenter', function() { d3.select(this).style('stroke-width', 3) })
path.on('mouseleave', function() {
  if (非高亮状态) d3.select(this).style('stroke-width', 2)
})
```

交互流程：
1. 用户点击某条弧线 → 该弧线变为 4px 粗、完全不透明，其余弧线变为 0.6 透明度
2. 通过 mitt 事件总线向 `PaperHTML` 组件发送 `highlight-references` 事件，携带被点击连线的两端引用 ID
3. `PaperHTML` 接收事件后在论文正文中高亮对应的 `<sup>` 引用标号
4. 点击"清除高亮"按钮或再次点击其他弧线时恢复默认状态

### 4. 三类逻辑关系

| 颜色   | 色值     | 含义                     | 论文中的体现                     |
|--------|----------|--------------------------|--------------------------------|
| 蓝色   | `#4A90D9` | **并列关系** (coordinate)  | 多篇文献共同支撑同一个论点        |
| 橙色   | `#E8734A` | **转折关系** (transition)  | 文献之间存在观点对立或结论反转    |
| 绿色   | `#67C23A` | **递进关系** (progressive) | 后一篇文献在前一篇基础上深入拓展  |

### 5. 数据模型

连线数据为硬编码的 `connections` 数组（约 140+ 条连线），每条记录包含：

```javascript
{ from: 1, to: 3, color: '#E8734A' }
```

其中 `from` 和 `to` 对应 `references` 数组中文献的 `id` 字段（1-59）。

### 6. 动态重绘

- 组件挂载时、页面切换回主页时、窗口大小变化时均触发 `drawVisualization()` 重绘
- 每次重绘先 `selectAll('*').remove()` 清空 SVG 容器，再重新计算布局参数
- 行高 `lineHeight` 根据容器实时高度动态计算，确保 59 条文献始终撑满可视区域

## 其他可视化视图

- **树图**：使用 `d3.tree()` + `d3.linkHorizontal()` 展示参考文献的层级归属关系
- **转折递进树图**：双树并排展示转折和递进两类关系
- **全文展示图**：论文全文结构的多层级树图
- **时间轴**：使用 `d3.line()` 展示参考文献的年代分布
- **词云**：使用 `d3-cloud` 展示研究关键词

## 技术栈

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **构建**: Vite 7
- **可视化**: D3.js 7.9.0, d3-cloud 1.2.7
- **事件通信**: mitt 3.0.1
- **PDF 渲染**: pdfjs-dist 5.3.93

## 项目结构

```
src/
  main.js                          # 应用入口，挂载事件总线
  App.vue                          # 根组件：顶栏 + 三栏布局
  components/
    Visualization.vue              # 主页弧形链接图（核心）
    TreeDiagram.vue                # 并列关系树图
    TransitionTree.vue             # 转折递进双树图
    FullTreeDiagram.vue            # 全文层级树图
    PaperHTML.vue                  # 论文正文 HTML 渲染
    Paper.vue                      # PDF 查看器
    Reference.vue                  # 参考文献列表
    TimeLine.vue                   # 引用年代分布折线图
    Words.vue                      # 关键词词云
  data/
    references.js                  # 引用 ID → 标题映射表
```

## 开发

```bash
npm install
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```
