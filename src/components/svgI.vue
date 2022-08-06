<template>
    <div class="svg-icon">
        <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="100" height="100" viewBox="0 0 26.458333 26.458334" version="1.1" id="svg2279" inkscape:version="0.92.5 (2060ec1f9f, 2020-04-08)" sodipodi:docname="logoI.svg" :style="'height:'+size+'px;width:'+size+'px'">
            <defs id="defs2273"/>
            <sodipodi:namedview id="base" pagecolor="#ffffff" bordercolor="#666666" borderopacity="1.0" inkscape:pageopacity="0.0" inkscape:pageshadow="2" inkscape:zoom="5.6" inkscape:cx="45.833007" inkscape:cy="44.95947" inkscape:document-units="mm" inkscape:current-layer="layer1" showgrid="false" inkscape:window-width="1920" inkscape:window-height="986" inkscape:window-x="-11" inkscape:window-y="-11" inkscape:window-maximized="1" units="px" inkscape:snap-bbox="false" inkscape:bbox-paths="true" inkscape:snap-page="true"/>
            <metadata id="metadata2276">
              <rdf:RDF>
                <cc:Work rdf:about="">
                  <dc:format>image/svg+xml</dc:format>
                  <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
                  <dc:title/>
                </cc:Work>
              </rdf:RDF>
            </metadata>
            <g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(0,-270.54165)">
              <path style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:451.56002808px;line-height:1.25;font-family:Georgia;-inkscape-font-specification:'Georgia, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:justify;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill-opacity:1;stroke-opacity:1" :style="'fill:'+pricolor+';stroke:'+bordercolor+';stroke-width:'+border+';'" d="m 6.6357464,271.92599 v 1.30644 c 0.3802166,0.0477 0.8325116,0.0901 1.3571557,0.2703 0.525275,0.0901 0.9217997,0.1802 1.1898431,0.3604 0.4243643,0.18019 0.7090757,0.45049 0.8541358,0.72078 0.145059,0.2703 0.218038,0.63069 0.218038,1.0001 v 8.99185 a 10.048454,10.048454 0 0 0 5.948314,-9.15944 c 0,-0.3604 0.07276,-0.72079 0.218039,-1.03613 0.145059,-0.3604 0.435177,-0.54059 0.871255,-0.72079 0.345977,-0.0901 0.770343,-0.1802 1.273364,-0.2703 0.50275,-0.0721 0.921618,-0.0901 1.256696,-0.18019 v -1.30644 h -4.233646 z" id="path2263" inkscape:connector-curvature="0"/>
              <path style="font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:451.56002808px;line-height:1.25;font-family:Georgia;-inkscape-font-specification:'Georgia, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:justify;letter-spacing:0px;word-spacing:0px;writing-mode:lr-tb;text-anchor:start;fill-opacity:1;stroke-opacity:1" :style="'fill:'+secolor+';stroke:'+bordercolor+';stroke-width:'+border+';'" d="m 16.203261,275.36146 a 10.048454,10.048454 0 0 1 -5.948315,9.15943 v 6.78443 1.07217 c 0,0.4505 -0.07823,0.81089 -0.234256,1.05416 -0.1450601,0.27029 -0.4243661,0.4505 -0.8379178,0.6307 -0.2234448,0.0901 -0.6315912,0.18018 -1.22336,0.18018 -0.5811362,0.0477 -1.0219886,0.0721 -1.3236388,0.0901 v 1.30643 h 3.6553016 9.531458 v -1.30643 c -0.368505,-0.0225 -0.826205,-0.0712 -1.373915,-0.18021 -0.536087,-0.0901 -0.921709,-0.18018 -1.156327,-0.27028 -0.424364,-0.1802 -0.715383,-0.4505 -0.871253,-0.72079 -0.145059,-0.2703 -0.217138,-0.6307 -0.217138,-1.03614 v -8.02779 -1.40554 z" id="path2257" inkscape:connector-curvature="0"/>
            </g>
          </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'SvgI',
    // 矢量图I，分为上下两部分，暂不支持半透明，参数如下
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
        pricolor:{          // 上半部分颜色
            default:"#FFF"
        },
        secolor:{           //下半部分颜色
            default:"#AAA"
        }
    },
})
</script>

<style scoped>
.svg-icon{
    /*width: 81px;*/
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>