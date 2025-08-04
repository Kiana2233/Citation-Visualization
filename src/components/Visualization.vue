<template>
  <div class="references-container">
    <div 
      v-for="reference in references" 
      :key="reference.id"
      class="reference-item"
    >
      <span>{{ reference.authors }}</span>
      <div class="reference-dot" :id="`dot-${reference.id}`"></div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

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
    authors: "Van de Vliert E",
  }
])

</script>

<style scoped>
.references-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
}

.reference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  min-height: 40px;
}

.reference-item:last-child {
  border-bottom: none;
}

.reference-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  margin-right: 10px;
}

.reference-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #007bff;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reference-dot:hover {
  background-color: #0056b3;
  transform: scale(1.2);
}
</style>
