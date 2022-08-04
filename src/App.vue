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
  
  "common": {
    "fontSize": "12px",
    "bodyColor": "#16181DFF",
    "cardColor": "#2B303BFF",
    "borderColor": "rgb(224, 224, 230)"
  },
  "Card": {
    "borderColor": "rgba(239, 239, 245, 0)"
  },
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
  },
  Menu: {
    "borderRadius": "2px",
    "itemColorActive": "#414958ff",
    "groupTextColor": "rgb(118, 124, 130)",
    "itemColorHover": "#414958aa",
    "itemColorActiveHover": "#414958dd",
    "itemTextColorActive": "#FFFFFFFF",
    "itemTextColorHover": "#E2E4E9FF",
    "itemTextColor": "#A7AFBEFF",
    "itemTextColorChildActive": "#FFFFFFFF",
    "itemTextColorActiveHover": "#FFFFFFFF",
    "itemTextColorChildActiveHover": "#FFFFFFFF",
    "itemColorActiveCollapsed": "rgba(222, 222, 222, 0.15)",
    "itemTextColorHoverHorizontal": "#E2E4E9FF",
    "itemTextColorHorizontal": "#A7AFBEff",
    "itemTextColorActiveHoverHorizontal": "#FFFFFFFF",
    "itemTextColorActiveHorizontal": "#FFFFFFFF",
    "itemTextColorChildActiveHorizontal": "#FFFFFFFF",
    "itemIconColor": "#A7AFBEFF",
    "itemTextColorChildActiveHoverHorizontal": "#FFFFFFFF",
    "itemIconColorActive": "#FFFFFFFF",
    "itemIconColorHover": "#E2E4E9FF",
    "itemIconColorActiveHover": "#FFFFFFFF",
    "itemIconColorChildActive": "#FFFFFFFF",
    "itemIconColorChildActiveHover": "#FFFFFFFF",
    "itemIconColorHoverHorizontal": "#E2E4E9FF",
    "itemIconColorActiveHoverHorizontal": "#FFFFFFFF",
    "itemIconColorChildActiveHoverHorizontal": "#FFFFFFFF",
    "itemIconColorActiveHorizontal": "#FFFFFFFF",
    "itemIconColorChildActiveHorizontal": "#FFFFFFFF"
  },
  "Input": {
    "caretColor": "#DDB055FF",
    "textColor": "rgba(255, 255, 255, 1)",
    "colorFocus": "#414958FF",
    "loadingColor": "#2B303BFF",
    "boxShadowFocus": "inset 1px 1px 4px rgba(0, 0, 0, 0.25)",
    "borderFocus": "none",
    "borderHover": "none",
    "border": "none",
    "borderDisabled": "none",
    "countTextColor": "rgba(255, 255, 255, 0.52)",
    "color": "#363C4AFF",
    "textDecorationColor": "rgba(255, 255, 255, 0.82)",
    "textColorDisabled": "rgba(255, 255, 255, 0.38)",
    "groupLabelTextColor": "rgba(255, 255, 255, 0.82)",
    "placeholderColor": "#A7AFBEFF",
    "caretColorError": "#BD424CFF",
    "loadingColorError": "#BD424CFF",
    "borderError": "2px solid #BD424C",
    "borderHoverError": "2px solid #BD424C",
    "boxShadowFocusError": "inset 1px 1px 4px rgba(0, 0, 0, 0.25)",
    "colorFocusError": "#414958FF",
    "borderFocusError": "2px solid #BD424C",
    "loadingColorWarning": "#DDB055FF",
    "caretColorWarning": "#DDB055FF",
    "borderWarning": "2px solid #DDB055",
    "borderHoverWarning": "2px solid #DDB055",
    "colorFocusWarning": "#414958FF",
    "borderFocusWarning": "2px solid #DDB055",
    "boxShadowFocusWarning": "inset 1px 1px 4px rgba(0, 0, 0, 0.25)"
  },
  "Tabs": {
    "tabTextColorActiveLine": "#FFFFFFFF",
    "tabTextColorHoverLine": "#FFFFFFFF",
    "tabTextColorLine": "#A7AFBEFF",
    "tabTextColorActiveBar": "#FFFFFFFF",
    "tabTextColorHoverBar": "#FFFFFFFF",
    "tabTextColorBar": "#A7AFBEFF",
    "tabTextColorActiveCard": "#FFFFFFFF",
    "barColor": "#FFFFFFFF"
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
  background: #16181D;
  height: 100%;
}
html, body #app{
  height: 100%;
  overflow: hidden;
}
</style>
