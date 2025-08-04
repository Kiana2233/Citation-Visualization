<template>
  <div class="app-container">
    <Paper class="component" style="width: 33%;"/>
    <div class="reference-words-column" style="width: 30%;">
      <Reference class="component reference-part" />
      <Words class="component words-part" />
    </div>
    <!-- <Visualization class="component" style="width: 47%;"/> -->
    <TimeLine class="component" style="width: 47%; height: 50%;"/>
  </div>
</template>

<script setup>
import Paper from './components/Paper.vue'
import Reference from './components/Reference.vue'
import Visualization from './components/Visualization.vue'
import Words from './components/Words.vue';
import TimeLine from './components/TimeLine.vue';
</script>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

.reference-words-column {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.reference-part {
  flex: 4;
  min-height: 0;
}
.words-part {
  flex: 2;
  min-height: 0;
}

.component {
  border: 1px solid #ddd;
  overflow: auto;
}


</style>
