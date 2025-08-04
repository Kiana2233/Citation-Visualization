<template>
  <div ref="timelineContainer" class="timeline-container"></div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue"
import * as d3 from 'd3'

const timelineContainer = ref(null)

// ...existing code...
    const references = reactive([
    {
        id: 1,
        authors: "李树, 严茉",
        title: "幸福经济学研究最新进展",
        source: "经济学动态",
        year: 2022,
        issue: "12",
        pages: "123-139"
    },
    {
        id: 2,
        authors: "种聪, 岳希明",
        title: "经济增长为什么没有带来幸福感提高：对主观幸福感影响因素的综述",
        source: "南开经济研究",
        year: 2020,
        issue: "4",
        pages: "24-45"
    },
    {
        id: 3,
        authors: "尹振涛, 李俊成, 杨璐",
        title: "金融科技发展能提高农村家庭幸福感吗：基于幸福经济学的研究视角",
        source: "中国农村经济",
        year: 2021,
        issue: "8",
        pages: "63-79"
    },
    {
        id: 4,
        authors: "Hegerty S W",
        title: "Macroeconomic volatility monetary union and external exposure: evidence from five Eurozone members",
        source: "Baltic Journal of Economics",
        year: 2020,
        volume: "20",
        issue: "2",
        pages: "117-138"
    },
    {
        id: 5,
        authors: "Akkoc U, Kizilirmak B",
        title: "Household level inflation rates and inflation inequality in Turkey",
        source: "Business and Economic Research Journal",
        year: 2021,
        volume: "12",
        issue: "1",
        pages: "17-32"
    },
    {
        id: 6,
        authors: "Kang J, Kim S",
        title: "Government spending news and surprise shocks: it's the timing and persistence",
        source: "Journal of Macroeconomics",
        year: 2022,
        volume: "73",
        pages: "2-7"
    },
    {
        id: 7,
        authors: "Cheung F",
        title: "Income redistribution predicts greater life satisfaction across individual, national, and cultural characteristics",
        source: "Journal of Personality & Social Psychology",
        year: 2018,
        volume: "115",
        issue: "5",
        pages: "867-882"
    },
    {
        id: 8,
        authors: "Bairoliya N, Canning D, Miller R, et al",
        title: "The macroeconomic and welfare implications of rural health insurance and pension reforms in China",
        source: "Journal of the Economics of Ageing",
        year: 2019,
        issue: "11",
        pages: "71-92"
    },
    {
        id: 9,
        authors: "刘倩倩, 党云晓, 张文忠, 等",
        title: "中国城市PM2.5污染对居民主观幸福感的影响及支付意愿研究",
        source: "地理科学",
        year: 2021,
        volume: "41",
        issue: "12",
        pages: "2096-2106"
    },
    {
        id: 10,
        authors: "Tian X C",
        title: "QWL and related factors for migrant workers survey in Guangdong province, China",
        source: "Journal of Social Service Research",
        year: 2020,
        volume: "46",
        issue: "2",
        pages: "160-169"
    },
    {
        id: 11,
        authors: "Arechavala N S, Espina P Z, Pastor A T L",
        title: "The importance of the neighbourhood environment and social capital for happiness in a vulnerable district: the case of the Pajarillos district in Spain",
        source: "Journal of Happiness Studies",
        year: 2022,
        volume: "23",
        issue: "5",
        pages: "1941-1965"
    },
    {
        id: 12,
        authors: "张彤进，万广华",
        title: "机会不均等、社会资本与农民主观幸福感：基于CGSS数据的实证分析",
        source: "上海财经大学学报",
        year: 2020,
        volume: "22",
        issue: "5",
        pages: "94-108"
    },
    {
        id: 13,
        authors: "Fang L, Sun R C F, Yuen M",
        title: "Development and preliminary validation of an acculturation scale for China's rural to urban migrant children",
        source: "International Journal of Intercultural Relations",
        year: 2017,
        volume: "58",
        pages: "1-11"
    },
    {
        id: 14,
        authors: "Clark A E",
        title: "Four decades of the economics happiness:where next",
        source: "Review of Income and Wealth",
        year: 2018,
        volume: "64",
        issue: "2",
        pages: "245-269"
    },
    {
        id: 15,
        authors: "邓小惠，向燕辉",
        title: "婚姻是幸福的坟墓吗：基于中国家庭追踪调查的双重差分倾向得分匹配法的估计",
        source: "心理科学",
        year: 2023,
        volume: "46",
        issue: "3",
        pages: "635-643"
    },
    {
        id: 16,
        authors: "鲁强",
        title: "生育行为与主观幸福感：货币路径、非货币路径与调节效应：兼论'幸福一收入'之谜",
        source: "宏观质量研究",
        year: 2018,
        volume: "7",
        issue: "2",
        pages: "51-72"
    },
    {
        id: 17,
        authors: "胡宏兵, 高娜娜",
        title: "教育程度与居民幸福感：直接效应与中介效应",
        source: "教育研究",
        year: 2019,
        volume: "40",
        issue: "11",
        pages: "111-123"
    },
    {
        id: 18,
        authors: "黄玖立, 田媛",
        title: "美貌能带来幸福感吗?",
        source: "南方经济",
        year: 2019,
        issue: "1",
        pages: "81-102"
    },
    {
        id: 19,
        authors: "王鹏, 吴愈晓",
        title: "就业状态、性别角色预期与中国城镇夫妻的主观幸福感",
        source: "南通大学学报(社会科学版)",
        year: 2023,
        volume: "39",
        issue: "3",
        pages: "92-101"
    },
    {
        id: 20,
        authors: "李其容，李春萱，杨艳宇，等",
        title: "创业对长短期幸福感的异质性影响研究",
        source: "管理学报",
        year: 2021,
        volume: "18",
        issue: "9",
        pages: "1335-1343"
    },
    {
        id: 21,
        authors: "Easterlin R A",
        title: "China's life satisfaction",
        source: "Proceedings of the National Academy of Sciences",
        year: 2012,
        volume: "109",
        issue: "25",
        pages: "9775-9780"
    },
    {
        id: 22,
        authors: "苏钟萍, 张应良",
        title: "收入水平、社会公平认知与农村居民主观幸福感",
        source: "统计与决策",
        year: 2021,
        volume: "37",
        issue: "9",
        pages: "71-74"
    },
    {
        id: 23,
        authors: "孙计领, 胡荣华",
        title: "收入水平、消费压力与幸福感",
        source: "财贸研究",
        year: 2017,
        volume: "28",
        issue: "2",
        pages: "1-8"
    },
    {
        id: 24,
        authors: "Becker D J",
        title: "A theory of social interactions",
        source: "Journal of Political Economy",
        year: 1974,
        volume: "82",
        issue: "6",
        pages: "1063-1093"
    },
    {
        id: 25,
        authors: "Andreoni J",
        title: "Giving with impure altruism: applications to charity and Ricardian equivalence",
        source: "Journal of Political Economy",
        year: 1989,
        volume: "97",
        issue: "6",
        pages: "1447-1458"
    },
    {
        id: 26,
        authors: "Andreoni J",
        title: "Impure altruism, and donations to public goods: a theory of warm-glow giving",
        source: "Economic Journal",
        year: 1990,
        volume: "100",
        issue: "401",
        pages: "464-477"
    },
    {
        id: 27,
        authors: "Roseman I J",
        title: "Appraisal determinants of discrete emotions",
        source: "Cognition & Emotion",
        year: 1991,
        volume: "5",
        issue: "3",
        pages: "161-200"
    },
    {
        id: 28,
        authors: "Harbaugh W T, Mayr U, Burghart D R",
        title: "Neural responses to taxation and voluntary giving reveal motives for charitable donations",
        source: "Science",
        year: 2007,
        volume: "316",
        issue: "5831",
        pages: "1622-1625"
    },
    {
        id: 29,
        authors: "Tankersley D, Stowe C J, Huettel S A",
        title: "Altruism is associated with an increased neural response to agency",
        source: "Nature Neuroscience",
        year: 2007,
        volume: "10",
        issue: "2",
        pages: "150-151"
    },
    {
        id: 30,
        authors: "Park S Q, Kahnt T, Dogan A, et al",
        title: "A neural link between generosity and happiness",
        source: "Nature Communications",
        year: 2017,
        volume: "8",
        issue: "1",
        pages: "1-10"
    },
    {
        id: 31,
        authors: "Huang Y",
        title: "Downward social comparison increases life-satisfaction in the giving and volunteering context",
        source: "Social Indicators Research",
        year: 2016,
        volume: "125",
        issue: "2",
        pages: "665-676"
    },
    {
        id: 32,
        authors: "Schwart C, Meisenhelder J B, Ma Y S, et al",
        title: "Altruistic social interest behaviors are associated with better mental health",
        source: "Psychosomatic Medicine",
        year: 2003,
        volume: "65",
        issue: "5",
        pages: "778-785"
    },
    {
        id: 33,
        authors: "Miller M J, Denton G O, Tobacyk J J",
        title: "Social interest and feelings of hopelessness among elderly patients",
        source: "Psychological Reports",
        year: 1986,
        issue: "58",
        pages: "410"
    },
    {
        id: 34,
        authors: "刘一伟, 和宇航",
        title: "共同富裕背景下个体禀赋如何影响慈善捐赠",
        source: "山西财经大学学报",
        year: 2023,
        volume: "45",
        issue: "6",
        pages: "60-69"
    },
    {
        id: 35,
        authors: "Weinstein N, Ryan R M",
        title: "When helping helps:autonomous motivation for prosocial behavior and its influence on well-being for the helper and recipient",
        source: "Journal of Personality and Social Psychology",
        year: 2010,
        volume: "98",
        issue: "2",
        pages: "222-244"
    },
    {
        id: 36,
        authors: "Mair C A",
        title: "Alternatives to aging alone?'Kinlessness'and the importance of friends across European context",
        source: "Journals of Gerontology Series B-Psychological Sciences and Social Sciences",
        year: 2019,
        volume: "74",
        issue: "8",
        pages: "1416-1428"
    },
    {
        id: 37,
        authors: "Caprara G V, Steca P",
        title: "Self-efficacy beliefs as determinants of prosocial behavior conducive to life satisfaction across ages",
        source: "Journal of Social and Clinical Psychology",
        year: 2005,
        volume: "24",
        issue: "2",
        pages: "191-217"
    },
    {
        id: 38,
        authors: "Tong H, Lai D W L, Walsh C A",
        title: "Formal social participation and utilization of community-based services among urban elderly Chinese living alone in Shanghai, China",
        source: "Journal of Social Service Research",
        year: 2019,
        volume: "45",
        issue: "4",
        pages: "509-520"
    },
    {
        id: 39,
        authors: "Zahavi A",
        title: "Mate selection-a selection for a handicap",
        source: "Journal of Theoretical Biology",
        year: 1975,
        volume: "53",
        pages: "205-214"
    },
    {
        id: 40,
        authors: "Fehrler S, Przepiorka W",
        title: "Charitable giving as a signal of trustworthiness: disentangling the signaling benefits of altruistic acts",
        source: "Evolution and Human Behavior",
        year: 2013,
        volume: "34",
        issue: "2",
        pages: "139-145"
    },
    {
        id: 41,
        authors: "谢晓非，王逸璐，顾思义，等",
        title: "利他仅仅利他吗？：进化视角的双路径模型",
        source: "心理科学进展",
        year: 2017,
        volume: "25",
        issue: "9",
        pages: "1441-1455"
    },
    {
        id: 42,
        authors: "Hardy C L, Van Vugt M",
        title: "Nice guys finish first: The competitive altruism hypothesis",
        source: "Personality and Social Psychology Bulletin",
        year: 2006,
        volume: "32",
        issue: "10",
        pages: "1402-1413"
    },
    {
        id: 43,
        authors: "Bereczkei T, Birkas B, Kerekes Z",
        title: "Altruism towards strangers in need: costly signaling in an industrial society",
        source: "Evolution and Human Behavior",
        year: 2010,
        volume: "31",
        issue: "2",
        pages: "95-103"
    },
    {
        id: 44,
        authors: "崔巍",
        title: "居民幸福感的影响因素及时代演变",
        source: "经济问题",
        year: 2019,
        issue: "10",
        pages: "19-25"
    },
    {
        id: 45,
        authors: "赵玉芳, 黄金华, 陈冰",
        title: "主观社会阶层对主观幸福感的影响：安全感与社会支持的作用",
        source: "西南大学学报(社会科学版)",
        year: 2019,
        volume: "45",
        issue: "3",
        pages: "106-112,190-191"
    },
    {
        id: 46,
        authors: "罗明忠，刘子玉",
        title: "互联网使用、阶层认同与农村居民幸福感",
        source: "中国农村经济",
        year: 2022,
        issue: "8",
        pages: "114-131"
    },
    {
        id: 47,
        authors: "Fredrickson J B L",
        title: "The broaden and build theory of positive",
        source: "Philosophical Transactions of the Royal Society of London, Series B: Biological Sciences",
        year: 2004,
        volume: "359",
        issue: "1449",
        pages: "1367-1377"
    },
    {
        id: 48,
        authors: "Raposa E B, Laws H B, Ansell E B",
        title: "Prosocial behavior mitigates the negative effects of stress in everyday life",
        source: "Clinical Psychological Science",
        year: 2016,
        volume: "4",
        issue: "4",
        pages: "691-698"
    },
    {
        id: 49,
        authors: "Williamson G M, Clark M S",
        title: "Providing help and desired relationship type as determinants of changes in moods and self-evaluations",
        source: "Journal of Personality and Social Psychology",
        year: 1989,
        volume: "56",
        issue: "4",
        pages: "722-734"
    },
    {
        id: 50,
        authors: "Grant A M, Sonnentag S",
        title: "Doing good buffers against feeling bad: prosocial impact compensates for negative task and self-evaluations",
        source: "Organization Behavior and Human Decision Processes",
        year: 2010,
        volume: "111",
        issue: "1",
        pages: "13-22"
    },
    {
        id: 51,
        authors: "Case A, Deaton A",
        title: "Suicide, age and well-being: an empirical investigation",
        source: "NBER Working Papers",
        year: 2015
    },
    {
        id: 52,
        authors: "郭小艳, 王振宏",
        title: "积极情绪的概念、功能与意义",
        source: "心理科学进展",
        year: 2007,
        issue: "5",
        pages: "810-815"
    },
    {
        id: 53,
        authors: "温忠麟, 叶宝娟",
        title: "中介效应分析：方法和模型发展",
        source: "心理科学进展",
        year: 2014,
        volume: "22",
        issue: "5",
        pages: "731-745"
    },
    {
        id: 54,
        authors: "Diener E",
        title: "Subjective well-being: the science of happiness and a proposal for a national index",
        source: "American Psychologist",
        year: 2000,
        volume: "55",
        issue: "1",
        pages: "34-43"
    },
    {
        id: 55,
        authors: "凌珑",
        title: "就业质量与居民主观福利：基于中国劳动力动态调查的实证研究",
        source: "统计研究",
        year: 2022,
        issue: "10",
        pages: "149-160"
    },
    {
        id: 56,
        authors: "谢伟丽, 石军伟, 张起帆",
        title: "人工智能、要素禀赋与制造业高质量发展：来自中国208个城市的经验证据",
        source: "经济与管理研究",
        year: 2023,
        volume: "44",
        issue: "4",
        pages: "21-38"
    },
    {
        id: 57,
        authors: "Carstensen L L, Fung H H, Charles S T",
        title: "Socioemotional selectivity theory and the regulation of emotion in the second half of life",
        source: "Motivation and Emotion",
        year: 2003,
        volume: "27",
        issue: "2",
        pages: "103-123"
    },
    {
        id: 58,
        authors: "Gabriel Z, Bowling A",
        title: "Quality of life from the perspectives of older people",
        source: "Aging and Society",
        year: 2004,
        volume: "24",
        issue: "5",
        pages: "675-691"
    },
    {
        id: 59,
        authors: "Van de Vliert E, Yang H, Wang Y, et al",
        title: "Climato-economic imprints on Chinese collectivism",
        source: "Journal of Cross-Cultural Psychology",
        year: 2013,
        volume: "44",
        issue: "4",        pages: "589-605"
    }
])

// 绘制时间线图
function drawTimeline() {
  // 清空容器
  d3.select(timelineContainer.value).selectAll('*').remove()
  
  // 获取容器尺寸
  const container = timelineContainer.value
  if (!container) return
  
  const margin = { top: 20, right: 30, bottom: 40, left: 50 }
  const width = container.clientWidth - margin.left - margin.right
  const height = container.clientHeight - margin.top - margin.bottom
  
  if (width < 100 || height < 100) return
  
  // 处理数据：按年份分组并统计数量
  const yearCounts = d3.rollup(references, v => v.length, d => d.year)
  const timelineData = Array.from(yearCounts, ([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year)
  
  // 创建SVG
  const svg = d3.select(timelineContainer.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  
  // 创建比例尺
  const xScale = d3.scaleLinear()
    .domain(d3.extent(timelineData, d => d.year))
    .range([0, width])
  
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(timelineData, d => d.count)])
    .range([height, 0])
  
  // 创建线条生成器
  const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX)
  
  // 绘制X轴
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
    .append('text')
    .attr('x', width / 2)
    .attr('y', 35)
    .attr('fill', 'black')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('年份')
  
  // 绘制Y轴
  g.append('g')
    .call(d3.axisLeft(yScale))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -35)
    .attr('x', -height / 2)
    .attr('fill', 'black')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('文献数量')
  
  // 绘制时间线
  g.append('path')
    .datum(timelineData)
    .attr('fill', 'none')
    .attr('stroke', '#007bff')
    .attr('stroke-width', 2)
    .attr('d', line)
  
  // 绘制数据点
  g.selectAll('.dot')
    .data(timelineData)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.year))
    .attr('cy', d => yScale(d.count))
    .attr('r', 4)
    .attr('fill', '#007bff')
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      // 创建提示框
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0)
      
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
      
      tooltip.html(`${d.year}年: ${d.count}篇文献`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
      
      // 高亮当前点
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6)
        .attr('fill', '#0056b3')
    })
    .on('mouseout', function() {
      // 移除提示框
      d3.selectAll('.tooltip').remove()
      
      // 恢复点的样式
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 4)
        .attr('fill', '#007bff')
    })
  
  // 添加网格线
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
      .tickSize(-height)
      .tickFormat('')
    )
    .style('stroke-dasharray', '3,3')
    .style('opacity', 0.3)
  
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat('')
    )
    .style('stroke-dasharray', '3,3')
    .style('opacity', 0.3)
}

// 组件挂载后绘制时间线
onMounted(() => {
  nextTick(() => {
    setTimeout(drawTimeline, 100)
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', () => {
    setTimeout(drawTimeline, 200)
  })
})
</script>

<style scoped>
.timeline-container {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
}

:deep(.grid line) {
  stroke: #ddd;
}

:deep(.grid path) {
  stroke: none;
}

:deep(.domain) {
  stroke: #333;
}

:deep(.tick line) {
  stroke: #333;
}

:deep(.tick text) {
  fill: #333;
  font-size: 11px;
}
</style>
