<template>
    <div class="svg-icon" :style="'height:'+size+'px;width:'+size+'px'">
        <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="105" height="105" viewBox="0 0 105 105" version="1.1" id="svg1305" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="logoCreate.svg" :style="'height:'+size+'px;width:'+size+'px'">
  <defs id="defs1299"/>
  <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="3.959798" inkscape:cx="12.85369" inkscape:cy="49.053124" inkscape:document-units="px" inkscape:current-layer="layer1" showgrid="false" units="px" inkscape:snap-page="true" inkscape:snap-bbox="true" inkscape:bbox-paths="true" inkscape:bbox-nodes="true" inkscape:window-width="1920" inkscape:window-height="986" inkscape:window-x="-11" inkscape:window-y="-11" inkscape:window-maximized="1" viewbox-width="100"/>
  <metadata id="metadata1302">
    <rdf:RDF>
      <cc:Work rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
        <dc:title/>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-269.21873)">
    <path style="opacity:1;fill-opacity:1;fill-rule:nonzero;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" :style="'fill:'+color+';stroke:'+bordercolor+';stroke-width:'+border+';'" d="m 47.145966,327.07273 v 27.68949 h 12.34735 13.541933 13.541908 c 7.502232,0 13.541933,-6.17475 13.541933,-13.84471 0,-7.66997 -6.039701,-13.84478 -13.541933,-13.84478 H 73.035249 59.493316 Z" id="path1065" inkscape:connector-curvature="0" inkscape:export-filename="C:\Users\mutto\Documents\web\Cyan\2022-summer-se\src\assets\logo.png" inkscape:export-xdpi="126.03361" inkscape:export-ydpi="126.03361"/>
    <path inkscape:connector-curvature="0" id="path1115" d="M 47.145966,316.3647 H 19.456482 v 12.34733 13.54196 13.54187 c 0,7.50223 6.174737,13.54192 13.844731,13.54192 7.669993,0 13.844753,-6.03969 13.844753,-13.54192 v -13.54187 -13.54196 z" style="opacity:1;fill-opacity:1;fill-rule:nonzero;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" :style="'fill:'+color+';stroke:'+bordercolor+';stroke-width:'+border+';'" inkscape:export-filename="C:\Users\mutto\Documents\web\Cyan\2022-summer-se\src\assets\logo.png" inkscape:export-xdpi="126.03361" inkscape:export-ydpi="126.03361"/>
    <path style="opacity:1;fill-opacity:1;fill-rule:nonzero;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" :style="'fill:'+color+';stroke:'+bordercolor+';stroke-width:'+border+';'" d="M 57.853982,316.3647 V 288.67521 H 45.506644 31.964726 18.42283 c -7.502246,0 -13.5419191,6.17475 -13.5419191,13.84478 0,7.66997 6.0396731,13.84475 13.5419191,13.84475 h 13.541896 13.541918 z" id="path1123" inkscape:connector-curvature="0" inkscape:export-filename="C:\Users\mutto\Documents\web\Cyan\2022-summer-se\src\assets\logo.png" inkscape:export-xdpi="126.03361" inkscape:export-ydpi="126.03361"/>
    <path style="opacity:1;fill-opacity:1;fill-rule:nonzero;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1" :style="'fill:'+color+';stroke:'+bordercolor+';stroke-width:'+border+';'" d="m 71.69876,274.09968 c -7.670018,0 -13.844778,6.17471 -13.844778,13.84475 v 13.84475 13.84474 11.43881 h 27.689509 v -11.43881 -13.84474 -13.84475 c 0,-7.67004 -6.174763,-13.84475 -13.844731,-13.84475 z" id="path1131" inkscape:connector-curvature="0" inkscape:export-filename="C:\Users\mutto\Documents\web\Cyan\2022-summer-se\src\assets\logo.png" inkscape:export-xdpi="126.03361" inkscape:export-ydpi="126.03361"/>
  </g>
</svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SvgI',
    // 矢量图Create，暂不支持半透明，参数如下
    props: {
        size:{              // 大小，占据正方形，会在两侧留白
            default:"20"
        },
        border:{            // 线条宽度
            default:"0"
        },
        bordercolor:{       // 线条颜色
            default:"#FFF"
        },
        color:{          // 颜色
            default:"#FFF"
        },
    },
})
</script>

<style scoped>
.svg-icon{
    /*overflow: hidden;*/
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>