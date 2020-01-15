<template>
    <div>
        <member-trend></member-trend>
        <!-- <table-detail></table-detail> -->
    </div>
</template>
<script>
import memberTrend from "./memberTrend/index.vue";
import tableDetail from "./tableDetail/index.vue";
import localDb from "@/utils/localDb.js";
export default {
      components: {
        memberTrend,
        tableDetail
    },
    data(){
        return{
            
        }
    },
    methods:{

    },
    beforeRouteLeave(to, form, next) {
        console.log(111111, to);
        if (to.path == "/generalSituation" ) {
            next();
        } else {
            localDb.set("timecont", {});
            next();
        }
    }
}
</script>