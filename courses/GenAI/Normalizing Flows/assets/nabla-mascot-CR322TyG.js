var e=Object.freeze([`default`,`reading-glasses`,`laptop`,`headphones`,`checkmark`,`incorrect`,`question`,`bounce`]),t=document.createElement(`template`);t.innerHTML=`
  <style>
    :host {
      --nabla-color: #585858;
      --nabla-dark: #161616;
      --nabla-mid: #8e8e8e;
      --nabla-screen: #2d2d2d;
      display: inline-block;
      width: 192px;
      height: 192px;
      line-height: 0;
      vertical-align: middle;
      contain: layout paint style;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .body,
    .symbol {
      fill: none;
      stroke: var(--nabla-color);
      stroke-width: 29;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .eye {
      fill: #fcfcfa;
      stroke: var(--nabla-color);
      stroke-width: 1.5;
    }

    .pupil {
      fill: var(--nabla-dark);
    }

    .highlight {
      fill: #fff;
    }

    .brow {
      fill: none;
      stroke: var(--nabla-color);
      stroke-width: 7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .expression-brow {
      stroke: var(--nabla-dark);
    }

    .prop {
      fill: none;
      stroke: #424242;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .prop-fill {
      fill: #424242;
    }

    .prop-mid {
      fill: var(--nabla-mid);
    }

    .screen {
      fill: var(--nabla-screen);
      stroke: var(--nabla-color);
      stroke-width: 10;
    }

    .code-light { stroke: #cacaca; }
    .code-mid { stroke: #a0a0a0; }
    .code-dark { stroke: #747474; }

    [data-hidden="true"] {
      visibility: hidden;
    }
  </style>

  <svg viewBox="0 0 384 384" aria-hidden="true" focusable="false">
    <g id="mascot">
      <path class="body" d="M112 124 L272 124 L192 320 Z" />
      <g id="face">
        <g id="left-eye">
          <ellipse class="eye" cx="160" cy="101" rx="31" ry="42" />
          <ellipse id="left-pupil" class="pupil" cx="160" cy="106" rx="13.5" ry="21.5" />
          <circle id="left-highlight" class="highlight" cx="157" cy="96" r="2.7" />
        </g>
        <g id="right-eye">
          <ellipse class="eye" cx="224" cy="101" rx="31" ry="42" />
          <ellipse id="right-pupil" class="pupil" cx="224" cy="106" rx="13.5" ry="21.5" />
          <circle id="right-highlight" class="highlight" cx="221" cy="96" r="2.7" />
        </g>
        <path id="left-brow" class="brow" d="M137 56 Q160 42 183 56" />
        <path id="right-brow" class="brow" d="M201 56 Q224 42 247 56" />
      </g>
    </g>

    <g id="glasses" data-hidden="true">
      <ellipse class="prop" cx="160" cy="106" rx="31.5" ry="28.5" stroke-width="5" />
      <ellipse class="prop" cx="224" cy="106" rx="31.5" ry="28.5" stroke-width="5" />
      <path class="prop" d="M191 103 L193 103" stroke-width="5" />
      <path class="prop" d="M129 92 L111 84 M255 92 L273 84" stroke-width="4" />
    </g>

    <g id="laptop" data-hidden="true">
      <rect class="screen" x="79" y="198" width="226" height="129" rx="10" />
      <g id="code-lines" fill="none" stroke-width="6" stroke-linecap="round">
        <path class="code-light" d="M105 231 H181" />
        <path class="code-mid" d="M118 250 H222" />
        <path class="code-dark" d="M105 269 H167" />
        <path class="code-light" d="M118 288 H209" />
      </g>
      <path class="prop-fill" d="M76 326 H308 L330 343 H54 Z" />
      <path class="prop" d="M54 343 H330" stroke-width="4" />
    </g>

    <g id="headphones" data-hidden="true">
      <path class="prop" d="M118 137 C118 63 266 63 266 137" stroke-width="12" />
      <rect class="prop-fill" x="99" y="119" width="28" height="68" rx="12" />
      <rect class="prop-fill" x="257" y="119" width="28" height="68" rx="12" />
      <rect class="prop-mid" x="105" y="129" width="16" height="48" rx="7" />
      <rect class="prop-mid" x="263" y="129" width="16" height="48" rx="7" />
    </g>

    <g id="check-symbol" data-hidden="true">
      <path id="check-path" class="symbol" pathLength="1" d="M88 220 L158 286 L294 105" />
      <g id="check-spark" stroke="#a0a0a0" stroke-width="4" stroke-linecap="round">
        <path d="M302 76 V106" />
        <path d="M287 91 H317" />
      </g>
    </g>

    <g id="x-symbol" data-hidden="true">
      <path class="symbol" d="M116 112 L268 290 M268 112 L116 290" />
      <g id="x-face">
        <ellipse class="eye" cx="162" cy="164" rx="27" ry="37" />
        <ellipse class="eye" cx="222" cy="164" rx="27" ry="37" />
        <ellipse class="pupil" cx="165" cy="177" rx="12" ry="19" />
        <ellipse class="pupil" cx="219" cy="177" rx="12" ry="19" />
        <circle class="highlight" cx="162" cy="168" r="2.5" />
        <circle class="highlight" cx="216" cy="168" r="2.5" />
        <path class="brow expression-brow" d="M138 124 L181 103" />
        <path class="brow expression-brow" d="M203 103 L246 124" />
      </g>
      <g id="x-ticks" class="prop" stroke-width="4">
        <path d="M95 94 L79 78" />
        <path d="M289 94 L305 78" />
      </g>
    </g>

    <g id="question-symbol" data-hidden="true">
      <path id="question-path" class="symbol" pathLength="1"
        d="M126 139 C126 97 158 73 198 73 C238 73 264 98 263 134 C262 171 236 186 216 201 C201 212 198 224 198 244" />
      <circle id="question-dot" cx="198" cy="293" r="15" fill="var(--nabla-color)" />
      <g id="question-face">
        <ellipse class="eye" cx="171" cy="134" rx="22" ry="30" />
        <ellipse class="eye" cx="220" cy="134" rx="22" ry="30" />
        <ellipse class="pupil" cx="173" cy="133" rx="9.5" ry="15.5" />
        <ellipse class="pupil" cx="218" cy="133" rx="9.5" ry="15.5" />
        <circle class="highlight" cx="171" cy="126" r="2.3" />
        <circle class="highlight" cx="216" cy="126" r="2.3" />
        <path class="brow expression-brow" d="M148 52 Q171 38 194 52" />
        <path class="brow expression-brow" d="M197 52 Q220 38 243 52" />
      </g>
    </g>

    <g id="impact-lines" data-hidden="true" class="prop" stroke-width="3">
      <path d="M170 350 H145" />
      <path d="M214 350 H239" />
    </g>
  </svg>
`;var n=(e,t=0,n=1)=>Math.max(t,Math.min(n,e)),r=(e,t,n)=>e+(t-e)*n,i=e=>{let t=n(e);return t*t*(3-2*t)},a=e=>{let t=n(e),r=1.70158;return 1+(r+1)*(t-1)**3+r*(t-1)**2},o=(e,t,n)=>{if(e<=t||e>=n)return 0;let r=(t+n)/2;return e<=r?i((e-t)/(r-t)):1-i((e-r)/(n-r))},s=(e,t=.12,n=.43,r=.76,o=.96)=>e<t?0:e<n?a((e-t)/(n-t)):e<r?1:e<o?1-i((e-r)/(o-r)):0,c=(e,t,n=1,r=1,i=0,a=0,o=0)=>`translate(${a} ${o}) translate(${e} ${t}) rotate(${i}) scale(${n} ${r}) translate(${-e} ${-t})`,l=class extends HTMLElement{static get observedAttributes(){return[`emote`,`size`,`color`,`duration`,`paused`]}constructor(){super(),this.attachShadow({mode:`open`}),this.shadowRoot.append(t.content.cloneNode(!0)),this._els={};for(let e of[`mascot`,`face`,`left-eye`,`right-eye`,`left-pupil`,`right-pupil`,`left-highlight`,`right-highlight`,`left-brow`,`right-brow`,`glasses`,`laptop`,`code-lines`,`headphones`,`check-symbol`,`check-path`,`check-spark`,`x-symbol`,`x-face`,`x-ticks`,`question-symbol`,`question-path`,`question-dot`,`question-face`,`impact-lines`])this._els[e]=this.shadowRoot.getElementById(e);this._raf=0,this._startedAt=0,this._elapsedBeforePause=0,this._playing=!1,this._reducedMotion=!1,this._media=null,this._onMotionPreference=e=>{this._reducedMotion=e.matches,this._reducedMotion?(this.pause(),this.render(.58)):(this.render(0),this.hasAttribute(`paused`)||this.restart())},this._tick=this._tick.bind(this)}connectedCallback(){this.setAttribute(`role`,`img`),this._media=window.matchMedia(`(prefers-reduced-motion: reduce)`),this._reducedMotion=this._media.matches,this._media.addEventListener?.(`change`,this._onMotionPreference),this._syncAttributes(),this._reducedMotion&&this.pause(),this.render(this._reducedMotion?.58:0),this.dataset.nablaReady=`true`,this.dispatchEvent(new CustomEvent(`nabla-ready`,{bubbles:!0,composed:!0})),!this.hasAttribute(`paused`)&&!this._reducedMotion&&this.play()}disconnectedCallback(){this.pause(),this._media?.removeEventListener?.(`change`,this._onMotionPreference)}attributeChangedCallback(){this.isConnected&&this._syncAttributes()}get emote(){let t=this.getAttribute(`emote`)||`default`;return e.includes(t)?t:`default`}set emote(t){this.setAttribute(`emote`,e.includes(t)?t:`default`)}get duration(){let e=Number(this.getAttribute(`duration`));return Number.isFinite(e)&&e>=400?e:2400}get playing(){return this._playing}play(){if(!(this._playing||this._reducedMotion||this.emote===`default`)){if(this.hasAttribute(`paused`)){this.removeAttribute(`paused`);return}this._playing=!0,this._startedAt=performance.now()-this._elapsedBeforePause,this._raf=requestAnimationFrame(this._tick)}}pause(){this._playing&&=(cancelAnimationFrame(this._raf),this._elapsedBeforePause=performance.now()-this._startedAt,!1)}freeze(e=.58){cancelAnimationFrame(this._raf),this._playing=!1;let t=n(e);this._elapsedBeforePause=this.duration*t,this.render(t)}restart(){cancelAnimationFrame(this._raf),this._playing=!1,this._elapsedBeforePause=0,this.render(0),!this._reducedMotion&&!this.hasAttribute(`paused`)&&this.play()}_syncAttributes(){let e=Number(this.getAttribute(`size`));Number.isFinite(e)&&e>0?(this.style.width=`${e}px`,this.style.height=`${e}px`):(this.style.removeProperty(`width`),this.style.removeProperty(`height`));let t=this.getAttribute(`color`);t?this.style.setProperty(`--nabla-color`,t):this.style.removeProperty(`--nabla-color`),this.setAttribute(`aria-label`,`Nabla mascot: ${this.emote.replaceAll(`-`,` `)}`),this.hasAttribute(`paused`)?this.pause():this._reducedMotion||this.restart()}_tick(e){if(!this._playing)return;let t=e-this._startedAt,n=t%this.duration/this.duration,r=Math.floor(this._elapsedBeforePause/this.duration);Math.floor(t/this.duration)!==r&&(this.dispatchEvent(new CustomEvent(`nabla-loop`,{bubbles:!0})),!this._playing)||(this._elapsedBeforePause=t,this.render(n),this._raf=requestAnimationFrame(this._tick))}_show(e,t){e.dataset.hidden=t?`false`:`true`,e.style.opacity=t?`1`:`0`}_reset(){let e=this._els;for(let t of[`glasses`,`laptop`,`headphones`,`check-symbol`,`x-symbol`,`question-symbol`,`impact-lines`])this._show(e[t],!1),e[t].removeAttribute(`transform`);this._show(e.mascot,!0),e.mascot.removeAttribute(`transform`),e.face.style.opacity=`1`,e[`left-eye`].removeAttribute(`transform`),e[`right-eye`].removeAttribute(`transform`),e[`left-pupil`].setAttribute(`cx`,`160`),e[`left-pupil`].setAttribute(`cy`,`106`),e[`right-pupil`].setAttribute(`cx`,`224`),e[`right-pupil`].setAttribute(`cy`,`106`),e[`left-highlight`].setAttribute(`cx`,`157`),e[`left-highlight`].setAttribute(`cy`,`96`),e[`right-highlight`].setAttribute(`cx`,`221`),e[`right-highlight`].setAttribute(`cy`,`96`),e[`left-brow`].setAttribute(`d`,`M137 56 Q160 42 183 56`),e[`right-brow`].setAttribute(`d`,`M201 56 Q224 42 247 56`),e[`check-path`].style.strokeDasharray=`1`,e[`check-path`].style.strokeDashoffset=`1`,e[`check-spark`].style.opacity=`0`,e[`question-path`].style.strokeDasharray=`1`,e[`question-path`].style.strokeDashoffset=`1`,e[`question-dot`].setAttribute(`transform`,`translate(198 293) scale(0) translate(-198 -293)`),e[`question-face`].style.opacity=`0`,e[`x-face`].style.opacity=`0`,e[`x-ticks`].style.opacity=`0`;for(let t of e[`code-lines`].children)t.style.transformBox=`fill-box`,t.style.transformOrigin=`left center`,t.style.transform=`scaleX(0)`}_setPupils(e=0,t=0){let n=this._els;n[`left-pupil`].setAttribute(`cx`,String(160+e)),n[`left-pupil`].setAttribute(`cy`,String(106+t)),n[`right-pupil`].setAttribute(`cx`,String(224+e)),n[`right-pupil`].setAttribute(`cy`,String(106+t)),n[`left-highlight`].setAttribute(`cx`,String(157+e)),n[`left-highlight`].setAttribute(`cy`,String(96+t)),n[`right-highlight`].setAttribute(`cx`,String(221+e)),n[`right-highlight`].setAttribute(`cy`,String(96+t))}_blink(e){let t=Math.max(.06,1-.94*n(e));this._els[`left-eye`].setAttribute(`transform`,c(160,101,1,t)),this._els[`right-eye`].setAttribute(`transform`,c(224,101,1,t))}_collapseMascot(e,t=!1){let r=i(n(e/.58));this._els.mascot.setAttribute(`transform`,c(192,200,1+.13*r,Math.max(.04,1-.94*r),0,0,34*r)),this._els.mascot.style.opacity=String(1-i(n((e-.48)/.18))),this._blink(i(n((e-.08)/.24))),t?(this._els[`left-brow`].setAttribute(`d`,`M137 50 L183 62`),this._els[`right-brow`].setAttribute(`d`,`M201 62 L247 50`)):(this._els[`left-brow`].setAttribute(`d`,`M137 62 L183 48`),this._els[`right-brow`].setAttribute(`d`,`M201 48 L247 62`))}render(e=0){let t=(e%1+1)%1;switch(this._reset(),this.emote){case`reading-glasses`:this._renderGlasses(t);break;case`laptop`:this._renderLaptop(t);break;case`headphones`:this._renderHeadphones(t);break;case`checkmark`:this._renderCheckmark(t);break;case`incorrect`:this._renderIncorrect(t);break;case`question`:this._renderQuestion(t);break;case`bounce`:this._renderBounce(t);break;default:break}}_renderGlasses(e){let t=this._els,i=s(e),a=o(e,.39,.51),l=o(e,.39,.49),u=0;if(e>.5&&e<.76&&(u=4.5*Math.sin((e-.5)/.26*Math.PI*2)),this._setPupils(u,2*n(i)),this._blink(l),t.mascot.setAttribute(`transform`,c(192,200,1+.045*a,1-.055*a,0,0,4*a)),i<=.001)return;this._show(t.glasses,!0);let d=r(-191,0,i),f=Math.sin(n(i)*Math.PI*2.5)*(1-n(i))*13;t.glasses.setAttribute(`transform`,`translate(0 ${d}) rotate(${f} 192 106)`)}_renderLaptop(e){let t=this._els,c=s(e,.1,.46,.78,.97),l=i(n((c-.15)/.85)),u=i(n((c-.15)/.45)),d=o(e,.43,.51);if(this._setPupils(0,13*u),this._blink(d),c<=.001)return;this._show(t.laptop,!0);let f=r(90,0,a(n(c/.58))),p=Math.max(.08,a(l));t.laptop.setAttribute(`transform`,`translate(0 ${f}) translate(192 326) scale(1 ${p}) translate(-192 -326)`);let m=i(n((l-.38)/.5));[...t[`code-lines`].children].forEach((e,t)=>{e.style.transform=`scaleX(${n(m*1.45-t*.12)})`})}_renderHeadphones(e){let t=this._els,i=s(e),a=o(e,.39,.52),l=0;if(e>.51&&e<.76&&(l=Math.sin((e-.51)/.25*Math.PI*3)),this._setPupils(5*l,0),this._blink(o(e,.4,.49)),t.mascot.setAttribute(`transform`,c(192,200,1+.035*a,1-.05*a,1.4*l,0,3*a+2.5*l)),i<=.001)return;this._show(t.headphones,!0);let u=r(-170,0,i),d=Math.sin(n(i)*Math.PI*3)*(1-n(i))*10;t.headphones.setAttribute(`transform`,`translate(0 ${u+d})`)}_renderCheckmark(e){let t=this._els,r=0;e>=.14&&e<.48?r=i((e-.14)/.34):e>=.48&&e<.72?r=1:e>=.72&&e<.96&&(r=1-i((e-.72)/.24)),this._collapseMascot(r);let a=i(n((r-.22)/.78));if(a<=.001)return;this._show(t[`check-symbol`],!0),t[`check-path`].style.strokeDashoffset=String(1-a),t[`check-spark`].style.opacity=String(i(n((a-.8)/.2)));let s=o(e,.43,.58);t[`check-symbol`].setAttribute(`transform`,c(192,205,1+.07*s,1-.05*s))}_symbolAmount(e){return e<.12?0:e<.45?i((e-.12)/.33):e<.73?1:e<.96?1-i((e-.73)/.23):0}_renderIncorrect(e){let t=this._els,r=this._symbolAmount(e);this._collapseMascot(r);let i=a(n((r-.22)/.78));if(i<=.001)return;this._show(t[`x-symbol`],!0);let s=0;if(e>.45&&e<.7){let t=1-(e-.45)/.25;s=Math.sin((e-.45)/.25*Math.PI*6)*5*t}t[`x-symbol`].setAttribute(`transform`,c(192,201,i,i,s));let l=a(n((i-.48)/.52));t[`x-face`].style.opacity=String(n(l)),t[`x-ticks`].style.opacity=String(o(e,.4,.54))}_renderQuestion(e){let t=this._els,r=this._symbolAmount(e);this._collapseMascot(r,!0);let i=a(n((r-.18)/.82));if(i<=.001)return;this._show(t[`question-symbol`],!0),t[`question-path`].style.strokeDashoffset=String(1-n(i));let o=a(n((i-.64)/.36));t[`question-dot`].setAttribute(`transform`,c(198,293,o,o)),t[`question-face`].style.opacity=String(n(a(n((i-.46)/.54))));let s=0;e>.46&&e<.72&&(s=Math.sin((e-.46)/.26*Math.PI*3)*4),t[`question-symbol`].setAttribute(`transform`,c(192,190,1,1,s))}_renderBounce(e){let t=this._els,a=i(n((e-.08)/.18));e>.86&&(a*=1-i((e-.86)/.12)),this._setPupils(2*a,16*a);let s=n((e-.24)/.58),l=[[0,0],[.12,-7],[.31,28],[.49,-19],[.66,13],[.8,-8],[.91,4],[1,0]],u=0;for(let e=0;e<l.length-1;e+=1){let[t,n]=l[e],[a,o]=l[e+1];if(s>=t&&s<=a){u=r(n,o,i((s-t)/(a-t)));break}}let d=o(s,.25,.38)+.65*o(s,.61,.71)+.35*o(s,.87,.95),f=o(s,.08,.24)+.55*o(s,.43,.58)+.3*o(s,.74,.85),p=o(e,.1,.18)+o(s,.27,.36)+.5*o(s,.63,.7);this._blink(n(p)),t.mascot.setAttribute(`transform`,c(192,200,1+.09*d-.04*f,1-.11*d+.065*f,Math.sin(s*Math.PI*5)*(1-s),0,u));let m=Math.max(o(s,.28,.36),.65*o(s,.64,.7));m>.02&&(this._show(t[`impact-lines`],!0),t[`impact-lines`].style.opacity=String(m),t[`impact-lines`].setAttribute(`transform`,`scale(${1+m*.25} 1)`))}};customElements.get(`nabla-mascot`)||customElements.define(`nabla-mascot`,l);window.NablaMascot=l;window.NABLA_EMOTES=e;