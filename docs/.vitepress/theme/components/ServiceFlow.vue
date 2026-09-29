<script setup>
import { computed } from 'vue'
const props = defineProps({ kind: { type: String, required: true } })
const flows = {
  prepare: [['出发前', '确认任务、地点与联络人'], ['到场后', '核对分工，熟悉服务区域'], ['结束时', '交接事项，归还物品']],
  hearing: [['确认方式', '先询问对方习惯怎样交流'], ['清楚表达', '正面交流，必要时使用文字'], ['核对信息', '确认地点、时间和下一步']],
  vision: [['先询问', '介绍自己，确认是否需要帮助'], ['按需陪同', '确认方式，提前说明环境变化'], ['告知离开', '确认到达，说明自己的离开']]
}
const steps = computed(() => flows[props.kind] || [])
</script>

<template>
  <ol class="service-flow" aria-label="服务流程参考">
    <li v-for="(step, index) in steps" :key="step[0]">
      <span class="flow-number" aria-hidden="true">0{{ index + 1 }}</span>
      <strong>{{ step[0] }}</strong>
      <span class="flow-description">{{ step[1] }}</span>
    </li>
  </ol>
</template>
