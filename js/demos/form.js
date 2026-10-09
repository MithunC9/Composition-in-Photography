/* Form: a sculpted, pepper-like object rendered with WebGL ray marching.
   Move the light to see form appear (side light) and disappear (front light, backlight).
   "Shape only" shows the same object as a flat silhouette. */
(function () {
  'use strict';
  var U = window.CIPU;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;uniform float uTime;uniform vec3 uL;uniform float uShape;uniform float uRot;',
    'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
    'float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}',
    'float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}',
    'float obj(vec3 p){',
    '  p.xz=rot(uRot)*p.xz; p.xy=rot(.22)*p.xy;',
    '  float y=p.y, a=atan(p.z,p.x), r=length(p.xz);',
    '  float t=clamp(abs(y+.05)/1.02,0.,1.);',
    '  float prof=.74*pow(max(0.,1.-pow(t,2.6)),.62)+.06;',
    '  float lob=.13*cos(4.*a+y*2.1)*smoothstep(1.05,.15,abs(y))+.025*sin(11.*a+y*4.);',
    '  float d=(r-(prof+lob))*.55;',
    '  d=max(d,abs(y+.05)-1.02);',
    '  float stem=sdCap(p,vec3(0.,.86,0.),vec3(.2,1.32,.05),.075);',
    '  return smin(d,stem,.12);',
    '}',
    'float map(vec3 p){return min(obj(p),p.y+1.1);}',
    'vec3 nrm(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}',
    'float shadow(vec3 ro,vec3 rd){float res=1.,t=.02;for(int i=0;i<40;i++){float h=map(ro+rd*t);res=min(res,9.*h/t);t+=clamp(h,.02,.25);if(res<.002||t>6.)break;}return clamp(res,0.,1.);}',
    'float ao(vec3 p,vec3 n){float o=0.,s=1.;for(int i=1;i<6;i++){float h=.04*float(i);o+=(h-map(p+n*h))*s;s*=.7;}return clamp(1.-2.5*o,0.,1.);}',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    '  vec3 ro=vec3(0.,.55,6.1), ta=vec3(0.,-.12,0.);',
    '  vec3 ww=normalize(ta-ro), uu=normalize(cross(ww,vec3(0.,1.,0.))), vv=cross(uu,ww);',
    '  vec3 rd=normalize(uv.x*uu+uv.y*vv+1.9*ww);',
    '  float t=0.; float hit=0.; float isObj=0.;',
    '  for(int i=0;i<110;i++){vec3 q=ro+rd*t;float d=map(q);if(d<.0008){hit=1.;isObj=step(obj(q),.004);break;}t+=d;if(t>9.)break;}',
    '  vec3 L=normalize(uL);',
    '  float bgv=mix(.075,.16,smoothstep(-.6,.6,uv.y));',
    '  vec3 col=vec3(bgv);',
    '  if(uShape>.5){',
    '    col=vec3(.82,.8,.76);',
    '    if(hit>.5&&isObj>.5) col=vec3(.06);',
    '    else if(hit>.5) col=vec3(.74,.72,.68);',
    '  } else if(hit>.5){',
    '    vec3 p=ro+rd*t, n=nrm(p);',
    '    float dif=max(dot(n,L),0.);',
    '    float sh=dif>0.?shadow(p+n*.004,L):0.;',
    '    float occ=ao(p,n);',
    '    float spec=pow(max(dot(reflect(-L,n),-rd),0.),30.)*.35*sh;',
    '    float amb=.05+.04*n.y;',
    '    if(isObj>.5){',
    '      float v=dif*sh*.95+amb*occ+spec;',
    '      col=vec3(v);',
    '    } else {',
    '      float v=(dif*sh*.55+amb*.6)*occ;',
    '      col=mix(vec3(v),vec3(bgv),smoothstep(2.5,7.,t));',
    '    }',
    '  }',
    '  col=pow(max(col,0.),vec3(.4545));',
    '  col*=vec3(1.,.975,.93);',
    '  col+=(hash(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.045;',
    '  float vig=1.-.35*dot(uv*.9,uv*.9);',
    '  gl_FragColor=vec4(col*vig,1.);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  var PRESETS = {
    front: { label: 'Front light', az: 0, el: 12 },
    side: { label: 'Side light', az: 88, el: 22 },
    top: { label: 'Top light', az: 30, el: 78 },
    back: { label: 'Backlight', az: 165, el: 18 }
  };

  U.demo('form', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><canvas aria-label="A sculpted pepper-like object. Drag to move the light."></canvas>' +
      '<span class="tip">Drag on the picture to move the light</span>' +
      '<div class="hud"><span class="h-light"></span><span class="h-state hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var canvas = host.querySelector('canvas'), tip = host.querySelector('.tip');
    var hLight = host.querySelector('.h-light'), hState = host.querySelector('.h-state'), readout = host.querySelector('.readout');
    var st = { az: 88, el: 22, taz: 88, tel: 22, shape: false, rot: .6 };

    var controls = host.querySelector('.controls');
    var pseg = U.seg(Object.keys(PRESETS).map(function (k) { return { v: k, label: PRESETS[k].label }; }), 'side', function (v) {
      st.taz = PRESETS[v].az; st.tel = PRESETS[v].el;
    }, 'Light position');
    controls.appendChild(pseg);
    controls.appendChild(U.seg([{ v: 'form', label: 'Form' }, { v: 'shape', label: 'Shape only' }], 'form', function (v) { st.shape = v === 'shape'; }, 'Rendering'));

    U.drag(canvas, {
      start: function () { tip.classList.add('gone'); pseg.set(''); },
      move: function (ev) {
        var r = canvas.getBoundingClientRect();
        st.taz = U.clamp(((ev.clientX - r.left) / r.width - .5) * 360, -180, 180);
        st.tel = U.clamp((1 - (ev.clientY - r.top) / r.height) * 100 - 10, -5, 85);
      }
    });

    function describe() {
      var a = Math.abs(st.az);
      if (st.shape) return ['Shape', '<strong>Shape only.</strong> The same object as a flat silhouette: you can recognize the outline, but there is no volume. That is the difference between shape (2D) and form (3D).'];
      if (st.el > 62) return ['Form, from above', '<strong>Top light.</strong> The upper surfaces glow and the lower half sinks into shadow. Some form shows, but the lobes lose their modeling.'];
      if (a < 28) return ['Form hidden', '<strong>Front light</strong>, from the camera’s direction. Few shadows are visible, so the object starts to look like a flat cut-out. Form disappears.'];
      if (a > 140) return ['Silhouette', '<strong>Backlight.</strong> The side facing us falls into shadow and only a bright edge remains. Form collapses into a silhouette, which is shape.'];
      return ['Form revealed', '<strong>Side light.</strong> Highlight, midtones and deep shadow sweep across every lobe. The tonal gradation tells your eye the object is round and solid, like Weston’s pepper.'];
    }

    var gl = null, prog, loc = {};
    try {
      gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: false }) || canvas.getContext('experimental-webgl');
      if (gl) {
        prog = gl.createProgram();
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        var buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var pl = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(pl);
        gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
        ['uRes', 'uTime', 'uL', 'uShape', 'uRot'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
      }
    } catch (err) { gl = null; if (window.console) console.warn('Form demo: WebGL unavailable', err); }

    var ctx2 = gl ? null : canvas.getContext('2d');

    function render(t) {
      var size = U.fitCanvas(canvas, 3 / 2, 1);
      var L = [Math.sin(st.az * Math.PI / 180) * Math.cos(st.el * Math.PI / 180), Math.sin(st.el * Math.PI / 180), Math.cos(st.az * Math.PI / 180) * Math.cos(st.el * Math.PI / 180)];
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(loc.uRes, canvas.width, canvas.height);
        gl.uniform1f(loc.uTime, t);
        gl.uniform3f(loc.uL, L[0], L[1], L[2]);
        gl.uniform1f(loc.uShape, st.shape ? 1 : 0);
        gl.uniform1f(loc.uRot, st.rot);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        // 2D fallback: a lit sphere
        var w = canvas.width, h = canvas.height, r = h * .3;
        ctx2.fillStyle = '#151413'; ctx2.fillRect(0, 0, w, h);
        if (st.shape) { ctx2.fillStyle = '#d2cfc8'; ctx2.fillRect(0, 0, w, h); ctx2.fillStyle = '#111'; ctx2.beginPath(); ctx2.arc(w / 2, h / 2, r, 0, 7); ctx2.fill(); }
        else {
          var gx = w / 2 + L[0] * r * .6, gy = h / 2 - L[1] * r * .6;
          var g = ctx2.createRadialGradient(gx, gy, r * .05, w / 2, h / 2, r);
          g.addColorStop(0, L[2] > -.3 ? '#efe9df' : '#333'); g.addColorStop(1, '#0d0c0b');
          ctx2.fillStyle = g; ctx2.beginPath(); ctx2.arc(w / 2, h / 2, r, 0, 7); ctx2.fill();
        }
      }
      var d = describe();
      var side = Math.abs(st.az) < 28 ? 'front' : Math.abs(st.az) > 140 ? 'behind' : st.az < 0 ? 'left' : 'right';
      hLight.textContent = 'Light from the ' + side + ' · ' + Math.round(st.el) + '° up';
      hState.textContent = d[0];
      var html = '<span class="mono">Form</span>' + d[1];
      if (readout._last !== html) { readout.innerHTML = html; readout._last = html; }
    }

    var loop = U.loop(function (t, dt) {
      st.az += (st.taz - st.az) * .12;
      st.el += (st.tel - st.el) * .12;
      if (!U.reduced) st.rot += dt * .22;
      render(t);
    });
    render(0);
    return { enter: loop.start, leave: loop.stop };
  });
})();
