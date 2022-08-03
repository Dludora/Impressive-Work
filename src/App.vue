<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view to="/layout">
    </router-view>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  // common: {
  //   primaryColor: '#FF0000'
  // },
  Button: {
    "textColor": "#A7AFBE",
    // "textColorTertiary": "rgb(118, 124, 130)",
    "textColorHover": "#E2E4E9",
    "textColorPressed": "#414958",
    "textColorFocus": "#A7AFBE",
    "border": "1px solid #A7AFBE",
    "borderHover": "1px solid #E2E4E9",
    "borderPressed": "1px solid #414958",
    "borderFocus": "1px solid #A7AFBE",
    "rippleColor": "#E2E4E9"
  }
}
</script>

<style>
.n-config-provider {
  height: 100%;
}
*{
  margin: 0px;
  padding: 0px;
  outline: none;
  z-index: inherit;
  overflow: visible;
}
body {
  height: 100%;
}
html, body #app{
  height: 100%;
  overflow: hidden;
}
</style>
