# 高亮功能修复说明

## 修复时间
2026年1月13日

## 问题描述
之前的高亮功能在点击连线时,PaperHTML 组件中的文字显示为空白。

## 根本原因
之前的实现使用复杂的正则表达式来操作 HTML 字符串,在替换过程中破坏了原有的 HTML 结构,导致内容丢失或显示异常。

## 新的解决方案

### 核心思路
采用**纯 CSS 类**的方式来实现高亮,而不是操作 HTML 字符串:

1. 通过 DOM API 直接查找匹配的 `<sup>` 标签
2. 给匹配的 `<sup>` 标签添加 `.highlight-ref` CSS 类
3. 给包含该引用的段落添加 `.has-highlight` CSS 类
4. 通过 CSS 样式实现视觉高亮效果

### 实现细节

#### 1. highlightReferences 函数
```javascript
const highlightReferences = ({ ids }) => {
  clearHighlight();  // 清除之前的高亮
  
  // 遍历所有段落
  const paragraphs = document.querySelectorAll('.research-paper p');
  
  paragraphs.forEach((paragraph) => {
    const supTags = paragraph.querySelectorAll('sup');
    
    supTags.forEach(sup => {
      const text = sup.textContent.trim();
      
      // 检查是否匹配目标引用ID
      if (匹配逻辑(text, ids)) {
        highlightSentenceContaining(sup);
      }
    });
  });
  
  // 滚动到第一个高亮位置
  scrollToFirstHighlight();
}
```

#### 2. highlightSentenceContaining 函数
```javascript
const highlightSentenceContaining = (element) => {
  const paragraph = element.closest('p');
  
  // 简单地添加 CSS 类
  element.classList.add('highlight-ref');
  paragraph.classList.add('has-highlight');
}
```

#### 3. clearHighlight 函数
```javascript
const clearHighlight = () => {
  // 移除所有高亮类
  document.querySelectorAll('.highlight-ref').forEach(ref => {
    ref.classList.remove('highlight-ref');
  });
  
  document.querySelectorAll('.has-highlight').forEach(p => {
    p.classList.remove('has-highlight');
  });
}
```

### CSS 样式

#### 引用标记高亮
```css
.highlight-ref {
  background: linear-gradient(120deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 2px 10px rgba(238, 90, 111, 0.5);
  animation: highlight-pulse 0.6s ease-in-out;
}
```

#### 段落背景高亮
```css
.research-paper p.has-highlight {
  background: linear-gradient(120deg, rgba(255, 234, 167, 0.3) 0%, rgba(253, 203, 110, 0.3) 100%);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #fdcb6e;
  margin: 15px 0;
  box-shadow: 0 2px 12px rgba(253, 203, 110, 0.3);
  animation: paragraph-highlight 0.6s ease-in-out;
}
```

## 优势

1. **稳定性强**: 不操作 HTML 字符串,避免破坏 DOM 结构
2. **性能好**: 直接使用 DOM API 和 CSS,浏览器原生优化
3. **可维护性高**: 代码简洁清晰,易于理解和修改
4. **动画流畅**: 使用 CSS 动画,比 JavaScript 操作更流畅
5. **不丢失内容**: 只添加/移除 CSS 类,不修改 HTML 内容

## 测试方法

1. 启动开发服务器: `npm run dev`
2. 打开浏览器访问: http://localhost:5174/
3. 切换到 "引用关系可视化" 视图
4. 点击任意连接线
5. 观察左侧 PaperHTML 组件:
   - 引用标记 `[数字]` 应该显示为红色高亮
   - 包含该引用的段落应该有黄色背景高亮
   - 页面应该自动滚动到高亮位置

## 支持的引用格式

- 单个引用: `[1]`, `[24]`, `[53]`
- 范围引用: `[1-2]`, `[4-5]`
- 多个引用: `[1,2,14]`, `[28-30]`

## 调试日志

代码中包含 `console.log` 语句用于调试:
- `'高亮引用:'` - 显示要高亮的引用ID
- `'找到匹配的引用:'` - 显示找到的匹配文本
- `'已添加高亮类'` - 确认高亮类已添加
- `'滚动到高亮位置'` - 确认开始滚动
- `'清除所有高亮'` - 确认清除操作

打开浏览器控制台可以查看这些日志,帮助排查问题。
