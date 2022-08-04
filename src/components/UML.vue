<template>
  <div class="big-contain">
    <n-config-provider  :theme="darkTheme">
      <div>


        <n-gradient-text type="danger">
          想做UML？
        </n-gradient-text>

        <n-checkbox
            @update:checked="handleUpdateChecked"
        >
          抉择时刻
        </n-checkbox>

      </div>
    </n-config-provider>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'

export default defineComponent({
  components: {

  },

  setup () {
    return {

      show: ref(false),
      handleUpdateChecked (value: boolean) {
        toUML();
      }
    }
  }
})

function toUML() {
  // 通过此方法可以使用
  window.location.href = 'https://www.diagrams.net/';
}

</script>

<style scoped>
.big-contain{
  width:fit-content;
  margin:39px 43px 0 61px;
}

.n-gradient-text {
  font-size: 36px;
}
</style>