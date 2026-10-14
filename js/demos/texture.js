/* Texture: a surface rendered in WebGL from a height map, lit by a light whose angle you control.
   Raking light (low angle) reveals texture; overhead light flattens it. */
(function () {
  'use strict';
  var U = window.CIPU;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;uniform vec3 uL;uniform float uMat;uniform float uTime;',
    'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'vec2 hash2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
    ' return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
    'vec2 vor(vec2 p){vec2 n=floor(p),f=fract(p);float d1=8.,d2=8.;',
    ' for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=hash2(n+g);vec2 r=g+o-f;float d=dot(r,r);',
    '  if(d<d1){d2=d1;d1=d;}else if(d<d2){d2=d;}}',
    ' return vec2(sqrt(d1),sqrt(d2)-sqrt(d1));}',
    'float height(vec2 p){',
    '  if(uMat<.5){',  // sand ripples
    '    float w=p.x*5.2+fbm(p*.6)*5.+sin(p.y*.9)*1.4;',
    '    float r=fract(w/6.2831);r=r<.72?r/.72:1.-(r-.72)/.28;',
    '    return r*.55+fbm(p*1.3)*.25+noise(p*40.)*.05;',
    '  } else if(uMat<1.5){', // cracked earth
    '    vec2 v=vor(p*1.25+fbm(p*.7)*.6);',
    '    float crack=smoothstep(.0,.09,v.y);',
    '    float dome=.18*(1.-v.x*v.x);',
    '    return crack*(.55+dome)+fbm(p*6.)*.12+noise(p*38.)*.05;',
    '  } else if(uMat<2.5){', // weathered wood
    '    float g=fbm(vec2(p.x*.35,p.y*4.2));',
    '    float rings=sin(p.y*7.+g*14.);',
    '    float grain=.5+.22*rings+.18*fbm(vec2(p.x*1.2,p.y*16.));',
    '    float split=smoothstep(.015,.0,abs(fbm(vec2(p.x*.2,p.y*1.6))-.52))*.6;',
    '    return grain-split+noise(p*vec2(9.,60.))*.06;',
    '  } else {', // stone
    '    float b=fbm(p*1.2);float rid=1.-abs(fbm(p*3.1)*2.-1.);',
    '    return b*.6+rid*.32+noise(p*30.)*.08;',
    '  }',
    '}',
    'float amp(){return uMat<.5?.55:uMat<1.5?.75:uMat<2.5?.4:.65;}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;',
    '  vec2 p=uv*5.+vec2(3.,1.);',
    '  float e=.012; float A=amp();',
    '  float h=height(p)*A;',
    '  float hx=height(p+vec2(e,0.))*A-h, hy=height(p+vec2(0.,e))*A-h;',
    '  vec3 n=normalize(vec3(-hx/e,-hy/e,1.)*vec3(.18,.18,1.));',
    '  vec3 L=normalize(uL);',
    '  float dif=max(dot(n,L),0.);',
    '  float sh=1.;',
    '  if(L.z<.97){',
    '    vec2 d2=normalize(L.xy); float slope=L.z/max(length(L.xy),.001);',
    '    for(int i=1;i<18;i++){float t=float(i)*.05; float hh=height(p+d2*t)*A; if(hh>h+t*slope*5.5){sh=0.;break;}}',
    '  }',
    '  float alb=uMat<.5?.78:uMat<1.5?.66+.1*fbm(p*2.):uMat<2.5?.6+.12*fbm(vec2(p.x*.5,p.y*8.)):.62+.15*fbm(p*4.);',
    '  float expo=1./max(L.z*.85+.15,.22);',
    '  float v=alb*(dif*mix(.25,1.,sh)*.86*expo*.55+.08);',
    '  vec3 col=vec3(pow(clamp(v,0.,1.2),.4545))*vec3(1.,.97,.92);',
    '  col+=(hash(gl_FragCoord.xy+uTime)-.5)*.035;',
    '  gl_FragColor=vec4(col,1.);',
    '}'
  ].join('\n');

  var MATS = [
    { v: 0, label: 'Sand ripples' },
    { v: 1, label: 'Cracked earth' },
    { v: 2, label: 'Weathered wood' },
    { v: 3, label: 'Stone' }
  ];

  U.demo('texture', function (host) {
    host.className = 'demo';
    host.innerHTML =
      '<div class="screen"><canvas aria-label="A close-up of a surface lit from an adjustable angle"></canvas>' +
      '<span class="tip">Drag sideways to turn the light</span>' +
      '<div class="hud"><span class="h-l"></span><span class="h-t hot"></span></div></div>' +
      '<div class="controls"></div>' +
      '<p class="readout" aria-live="polite"></p>';
    var screen = host.querySelector('.screen');
    U.corners(screen);
    var canvas = host.querySelector('canvas'), tip = host.querySelector('.tip');
    var hL = host.querySelector('.h-l'), hT = host.querySelector('.h-t'), readout = host.querySelector('.readout');
    var st = { el: 9, tel: 9, az: -25, taz: -25, mat: 1 };
    var dirty = true;

    var controls = host.querySelector('.controls');
    var elR = U.range({ id: 'tex-angle', label: 'Light angle', min: 3, max: 90, value: st.el, grow: true,
      format: function (v) { return v + '°'; }, scale: ['Raking', 'Overhead'],
      onInput: function (v) { st.tel = v; dirty = true; } });
    controls.appendChild(elR);
    controls.appendChild(U.seg(MATS, 1, function (v) { st.mat = +v; dirty = true; }, 'Surface'));

    U.drag(canvas, {
      start: function (ev) { tip.classList.add('gone'); canvas._x0 = ev.clientX; canvas._a0 = st.taz; },
      move: function (ev) { st.taz = canvas._a0 + (ev.clientX - canvas._x0) / canvas.clientWidth * 300; dirty = true; }
    });

    var gl = null, loc = {};
    try {
      gl = canvas.getContext('webgl', { antialias: false }) || canvas.getContext('experimental-webgl');
      if (gl) {
        var prog = gl.createProgram();
        [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]].forEach(function (s) {
          var sh = gl.createShader(s[0]); gl.shaderSource(sh, s[1]); gl.compileShader(sh);
          if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
          gl.attachShader(prog, sh);
        });
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        var pl = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(pl); gl.vertexAttribPointer(pl, 2, gl.FLOAT, false, 0, 0);
        ['uRes', 'uL', 'uMat', 'uTime'].forEach(function (n) { loc[n] = gl.getUniformLocation(prog, n); });
      }
    } catch (err) { gl = null; if (window.console) console.warn('Texture demo: WebGL unavailable', err); }

    function text() {
      var e = Math.round(st.el);
      if (e < 15) return ['Texture strongest', '<strong>Raking light at ' + e + '°.</strong> Every crack throws a shadow, so the surface jumps out.'];
      if (e < 45) return ['Texture visible', '<strong>Angled light at ' + e + '°.</strong> Shorter shadows, softer texture.'];
      return ['Texture flattened', '<strong>Overhead light at ' + e + '°.</strong> No shadows, so the surface looks flat.'];
    }

    function render(t) {
      U.fitCanvas(canvas, 3 / 2, 1);
      var e = st.el * Math.PI / 180, a = st.az * Math.PI / 180;
      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(loc.uRes, canvas.width, canvas.height);
        gl.uniform3f(loc.uL, Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e));
        gl.uniform1f(loc.uMat, st.mat);
        gl.uniform1f(loc.uTime, t % 10);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      } else {
        var c = canvas.getContext('2d');
        c.fillStyle = '#7d776f'; c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = '#ece6dc'; c.font = '16px sans-serif'; c.fillText('WebGL is not available in this browser.', 20, 30);
      }
      var tx = text();
      hL.textContent = 'Light ' + Math.round(st.el) + '° above the surface';
      hT.textContent = tx[0];
      var html = '<span class="mono">Texture</span>' + tx[1];
      if (readout._last !== html) { readout.innerHTML = html; readout._last = html; }
    }

    var loop = U.loop(function (t) {
      var moving = Math.abs(st.tel - st.el) > .05 || Math.abs(st.taz - st.az) > .05;
      st.el += (st.tel - st.el) * .2; st.az += (st.taz - st.az) * .2;
      // only redraw while something changes; the GPU rests otherwise
      if (moving || dirty) { dirty = false; render(t); }
    });
    window.addEventListener('resize', function () { dirty = true; });
    render(0);
    return { enter: function () { dirty = true; loop.start(); }, leave: loop.stop };
  });
})();
