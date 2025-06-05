"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[571],{7485:function(t,e,i){i.d(e,{VF:function(){return d}});var a=i(7437);i(2265);var s=i(9183);let r="#4fa94d",o={"aria-busy":!0,role:"progressbar"},n=(0,s.ZP).div`
  display: ${t=>t.$visible?"flex":"none"};
`,l=(0,s.F4)`
12.5% {
  stroke-dasharray: ${33.98873199462888}px, ${242.776657104492}px;
  stroke-dashoffset: -${26.70543228149412}px;
}
43.75% {
  stroke-dasharray: ${84.97182998657219}px, ${242.776657104492}px;
  stroke-dashoffset: -${84.97182998657219}px;
}
100% {
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492}px;
  stroke-dashoffset: -${240.34889053344708}px;
}
`;(0,s.ZP).path`
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492};
  stroke-dashoffset: 0;
  animation: ${l} ${1.6}s linear infinite;
`;let d=({height:t=90,width:e=80,radius:i=12.5,color:s=r,secondaryColor:l=r,ariaLabel:d="mutating-dots-loading",wrapperStyle:c,wrapperClass:h,visible:p=!0})=>(0,a.jsx)(n,{style:c,$visible:p,className:h,"data-testid":"mutating-dots-loading","aria-label":d,...o,children:(0,a.jsxs)("svg",{id:"goo-loader",width:e,height:t,"data-testid":"mutating-dots-svg",children:[(0,a.jsxs)("filter",{id:"fancy-goo",children:[(0,a.jsx)("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"6",result:"blur"}),(0,a.jsx)("feColorMatrix",{in:"blur",mode:"matrix",values:"1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9",result:"goo"}),(0,a.jsx)("feComposite",{in:"SourceGraphic",in2:"goo",operator:"atop"})]}),(0,a.jsxs)("g",{filter:"url(#fancy-goo)",children:[(0,a.jsx)("animateTransform",{id:"mainAnim",attributeName:"transform",attributeType:"XML",type:"rotate",from:"0 50 50",to:"359 50 50",dur:"1.2s",repeatCount:"indefinite"}),(0,a.jsx)("circle",{cx:"50%",cy:"40",r:i,fill:s,children:(0,a.jsx)("animate",{id:"cAnim1",attributeType:"XML",attributeName:"cy",dur:"0.6s",begin:"0;cAnim1.end+0.2s",calcMode:"spline",values:"40;20;40",keyTimes:"0;0.3;1",keySplines:"0.09, 0.45, 0.16, 1;0.09, 0.45, 0.16, 1"})}),(0,a.jsx)("circle",{cx:"50%",cy:"60",r:i,fill:l,children:(0,a.jsx)("animate",{id:"cAnim2",attributeType:"XML",attributeName:"cy",dur:"0.6s",begin:"0.4s;cAnim2.end+0.2s",calcMode:"spline",values:"60;80;60",keyTimes:"0;0.3;1",keySplines:"0.09, 0.45, 0.16, 1;0.09, 0.45, 0.16, 1"})})]})]})}),c=(0,s.F4)`
to {
   transform: rotate(360deg);
 }
`;(0,s.ZP).svg`
  animation: ${c} 0.75s steps(12, end) infinite;
  animation-duration: 0.75s;
`,(0,s.ZP).polyline`
  stroke-width: ${t=>t.width}px;
  stroke-linecap: round;

  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }

  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }

  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }

  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }

  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }

  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }

  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }

  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }

  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }

  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }

  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`;let h=(0,s.F4)`
to {
   stroke-dashoffset: 136;
 }
`;(0,s.ZP).polygon`
  stroke-dasharray: 17;
  animation: ${h} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
`,(0,s.ZP).svg`
  transform-origin: 50% 65%;
`}}]);