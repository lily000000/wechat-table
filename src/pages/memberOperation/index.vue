<template>
    <div>
        <member-overview></member-overview>
        <member-trend></member-trend>
        <active-trend></active-trend>
        <research-report></research-report>
    </div>
</template>
<script>
import memberOverview from "./memberOverview/index.vue";
import memberTrend from "./memberChart/memberTrend/index.vue";
import activeTrend from "./memberChart/activeTrend/index.vue";
import researchReport from "./researchReport/index";
export default {
    components: {
        memberOverview,
        memberTrend,
        activeTrend,
        researchReport
  },
  data(){
      return{


      }
  },
  methods:{



  }
    
}
</script>
<style scoped>

</style>