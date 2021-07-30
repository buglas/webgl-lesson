<template>
<div>
    <!-- <DrawBlock 
    :u_Width="600" 
    :u_Height="600"
    :u_Radius="100"
    width=600
    height=600
    ></DrawBlock> -->
    <MetalSwitch></MetalSwitch>
</div>
</template>
<script lang="ts">

import { defineComponent } from "vue";
import DrawBlock from "./pure.frag";
import MetalSwitch from "./switch.vue";

export default defineComponent({
  name: "App",
  components: {
    DrawBlock,
    MetalSwitch
  },
  setup(){
    return {
      
    }
  }
});

</script>