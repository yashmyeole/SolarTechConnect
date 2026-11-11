const COMMON = `
    uniform float uTime,uSunI,uNight,uCloud,uFogK;
    uniform vec3 uSun,uZen,uHor,uHorSun,uSunCol,uAmb,uGnd;
    float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
    float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*vnoise(p);p=p*2.03+vec2(17.3,9.1);a*=.5;}return s;}
    vec3 hazeCol(vec3 d){
      vec2 h=normalize(d.xz+vec2(1e-5)),sh=normalize(uSun.xz+vec2(1e-5));
      float sd=max(dot(h,sh),0.);
      return mix(uHor,uHorSun,sd*sd*sd);
    }
    vec3 skyBase(vec3 d,float sharp){
      vec3 hz=hazeCol(d);
      vec3 c=mix(hz,uZen,pow(clamp(d.y,0.,1.),.45));
      if(d.y<0.) c=mix(hz,uGnd,clamp(-d.y*5.,0.,1.));
      float sdot=max(dot(d,uSun),0.);
      float disc=mix(pow(sdot,2200.)*30.+pow(sdot,260.)*1.2,smoothstep(.99982,.99993,sdot)*1.7,sharp);
      float halo=(pow(sdot,700.)*.55+pow(sdot,90.)*.4+pow(sdot,10.)*.1)*mix(1.,.5,smoothstep(.1,.3,uSun.y));
      return c+uSunCol*uSunI*(disc+halo);
    }
    float cloudCover(vec3 d){vec2 uv=d.xz/(d.y+.14)*1.2+vec2(uTime*.004,uTime*.0015);return smoothstep(.5,.85,fbm(uv))*smoothstep(0.,.2,d.y)*uCloud;}
    vec3 cloudCol(vec3 d,vec3 hz){return mix(hz,vec3(1.),.4)*(.55+.45*uSunI)+uSunCol*uSunI*.2*pow(max(dot(d,uSun),0.),3.);}
    float cloudShadow(vec2 xz){return smoothstep(.5,.78,fbm(xz*.0035+vec2(uTime*.006,0.)))*uCloud;}
    vec3 applyFog(vec3 c,vec3 w){
      vec3 dv=w-cameraPosition; float f=1.-exp(-length(dv)*uFogK);
      vec3 hz=hazeCol(dv)+uSunCol*uSunI*pow(max(dot(normalize(dv),uSun),0.),10.)*.1;
      return mix(c,hz,f);
    }`;

const RISE = `float rise(float d){ float k=smoothstep(d,d+.3,uNet); return k; }`;

export const SKY_VERTEX = `varying vec3 vDir; void main(){ vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); gl_Position.z=gl_Position.w; }`;

export const SKY_FRAGMENT =
  COMMON +
  `
      varying vec3 vDir;
      void main(){
        vec3 d=normalize(vDir);
        vec3 c=skyBase(d,1.);
        vec2 hd=normalize(d.xz+vec2(1e-5));
        vec3 hz=hazeCol(d);
        if(d.y>0.){
          c=mix(c,cloudCol(d,hz),cloudCover(d)*.6);
          if(uNight>.2){
            vec2 g=d.xz/(d.y+.3)*70.; float r=hash21(floor(g));
            float st=step(.982,r)*(1.-smoothstep(.05,.4,length(fract(g)-.5)));
            c+=st*smoothstep(.2,.75,uNight)*(.55+.45*sin(uTime*1.3+r*50.))*vec3(.92,.92,1.);
          }
        }
        float r1=.006+.022*vnoise(hd*3.1+2.)+.007*vnoise(hd*11.);
        float r2=.002+.011*vnoise(hd*5.3+9.);
        vec3 hill=uAmb*vec3(.30,.29,.34);
        c=mix(c,mix(hz,hill,.45),(1.-smoothstep(r1-.001,r1+.002,d.y)));
        c=mix(c,mix(hz,hill,.72),(1.-smoothstep(r2-.001,r2+.0015,d.y)));
        if(d.y<0.) c=mix(mix(hz,hill,.72),hz,clamp(-d.y*30.,0.,1.));
        gl_FragColor=vec4(c,1.);
      }`;

export const GROUND_VERTEX = `varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`;

export const GROUND_FRAGMENT =
  COMMON +
  `
      varying vec3 vW; uniform vec3 uRows; uniform vec4 uField;
      void main(){
        float dist=length(cameraPosition-vW);
        float n1=fbm(vW.xz*.035), n2=vnoise(vW.xz*1.7);
        vec3 base=mix(vec3(.34,.37,.26),vec3(.50,.46,.36),n1);
        base*=.9+.2*n2*(1.-smoothstep(10.,160.,dist));
        float sh=0.;
        if(vW.x>uField.x&&vW.x<uField.y&&vW.z>uField.z&&vW.z<uField.w){
          float u=mod(vW.x-uRows.y,uRows.x), w=uRows.z-uRows.y, e=fwidth(vW.x)*1.5+.12;
          sh=smoothstep(0.,e,u)*(1.-smoothstep(w-e,w,u));
          sh*=smoothstep(uField.z,uField.z+6.,vW.z)*(1.-smoothstep(uField.w-6.,uField.w,vW.z));
        }
        vec3 sun=uSunCol*uSunI*pow(max(uSun.y,0.),.6)*1.05;
        vec3 col=base*(uAmb+sun*(1.-sh*.8)*(1.-.45*cloudShadow(vW.xz)));
        gl_FragColor=vec4(applyFog(col,vW),1.);
      }`;

export const TABLE_VERTEX = `
      attribute float aRnd; varying vec3 vW,vN; varying vec2 vUv; varying float vRnd;
      void main(){ vUv=uv; vRnd=aRnd; mat4 m=modelMatrix*instanceMatrix; vec4 w=m*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(m)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`;

export const TABLE_FRAGMENT =
  COMMON +
  `
      varying vec3 vW,vN; varying vec2 vUv; varying float vRnd; uniform vec3 uPanelN;
      void main(){
        vec3 N=normalize(vN), V=normalize(cameraPosition-vW);
        vec3 sun=uSunCol*uSunI*(1.-.45*cloudShadow(vW.xz));
        float ndl=max(dot(N,uSun),0.);
        vec3 col;
        if(dot(N,uPanelN)>.98){
          vec2 m=vUv*vec2(2.,6.), f=abs(fract(m)-.5), fw=fwidth(m);
          float frame=max(smoothstep(.488-fw.x,.488,f.x),smoothstep(.482-fw.y,.482,f.y));
          vec2 g=m*vec2(12.,6.), cf=abs(fract(g)-.5), cw=fwidth(g);
          float cell=max(smoothstep(.46-cw.x,.46,cf.x),smoothstep(.46-cw.y,.46,cf.y))*(1.-smoothstep(.12,.45,max(cw.x,cw.y)));
          vec3 base=mix(vec3(.018,.032,.075),vec3(.03,.055,.125),vRnd);
          base=mix(base,vec3(.15,.2,.3),cell*.5);
          vec3 lit=base*(uAmb*1.2+sun*ndl);
          vec3 R=reflect(-V,normalize(N+vec3((vRnd-.5)*.035,0.,(fract(vRnd*7.3)-.5)*.035)));
          float fres=.045+.955*pow(1.-max(dot(N,V),0.),5.);
          vec3 rf=skyBase(R,0.);
          if(R.y>0.) rf=mix(rf,cloudCol(R,hazeCol(R)),cloudCover(R)*.5);
          col=mix(lit,rf,clamp(fres,0.,1.)*.88);
          col=mix(col,vec3(.5,.52,.56)*(uAmb+sun*ndl),frame*.85);
        } else if(dot(N,uPanelN)<-.98){
          vec2 m=vUv*vec2(2.,6.), f=abs(fract(m)-.5), fw=fwidth(m);
          float seam=max(smoothstep(.485-fw.x,.485,f.x),smoothstep(.48-fw.y,.48,f.y));
          float rail=max(1.-smoothstep(.018,.03,abs(vUv.x-.28)),1.-smoothstep(.018,.03,abs(vUv.x-.72)));
          vec3 back=mix(vec3(.7,.71,.73),vec3(.36,.37,.4),max(seam*.7,rail));
          col=back*(uAmb*.85+uGnd*.7);
        } else {
          col=vec3(.33,.34,.37)*(uAmb*.9+sun*ndl*.8);
        }
        gl_FragColor=vec4(applyFog(col,vW),1.);
      }`;

export const POST_VERTEX = `varying vec3 vW,vN; void main(){ mat4 m=modelMatrix*instanceMatrix; vec4 w=m*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(m)*normal); gl_Position=projectionMatrix*viewMatrix*w; }`;

export const POST_FRAGMENT =
  COMMON +
  `varying vec3 vW,vN; void main(){ vec3 col=vec3(.42,.43,.46)*(uAmb*.8+uSunCol*uSunI*max(dot(normalize(vN),uSun),0.)*.5); gl_FragColor=vec4(applyFog(col,vW),1.); }`;

export const NODE_VERTEX = `
      uniform float uNet,uTime,uScale; attribute vec3 aFrom; attribute float aDelay,aKind; varying float vA,vKind; ${RISE}
      void main(){ float k=rise(aDelay); vec4 mv=modelViewMatrix*vec4(mix(aFrom,position,k),1.);
        gl_Position=projectionMatrix*mv; float tw=.78+.22*sin(uTime*2.+aDelay*40.);
        gl_PointSize=min(130.,(aKind>.5?2.:1.4)*tw*k*uScale/-mv.z); vA=k*exp(mv.z*.0021); vKind=aKind; }`;

export const NODE_FRAGMENT = `
      varying float vA,vKind;
      void main(){ float r=length(gl_PointCoord-.5)*2.; float core=1.-smoothstep(0.,.34,r), glow=pow(max(1.-r,0.),2.2)*.5;
        vec3 c=mix(vec3(1.,.95,.9),vec3(1.,.62,.48),vKind); gl_FragColor=vec4(c*(core+glow)*vA,1.); }`;

export const LINK_VERTEX = `
      uniform float uNet; attribute vec3 aFrom; attribute float aDelay,aT,aEdge,aSeed; varying float vT,vP,vSeed,vFade; ${RISE}
      void main(){ vec4 mv=modelViewMatrix*vec4(mix(aFrom,position,rise(aDelay)),1.); gl_Position=projectionMatrix*mv;
        vT=aT; vP=smoothstep(aEdge,aEdge+.22,uNet); vSeed=aSeed; vFade=exp(mv.z*.0021); }`;

export const LINK_FRAGMENT = `
      uniform float uTime; varying float vT,vP,vSeed,vFade;
      void main(){ if(vT>vP) discard; float ph=fract(uTime*.22+vSeed); float pulse=1.-smoothstep(0.,.07,abs(vT-ph));
        vec3 c=vec3(.98,.78,.72)*.6+vec3(1.,.66,.5)*pulse*1.2; gl_FragColor=vec4(c*vFade*min(1.,vP*3.),1.); }`;

export const SCREEN_VERTEX = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`;

export const FINAL_FRAGMENT = `
      uniform sampler2D tA,tB; uniform float uMix,uTime,uAspect; varying vec2 vUv;
      float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);}
      void main(){
        vec2 uv=vUv; vec3 c;
        if(uMix<=.001) c=texture2D(tA,uv).rgb;
        else if(uMix>=.999) c=texture2D(tB,uv).rgb;
        else{
          vec2 q=uv*vec2(uAspect,1.);
          float nz=vnoise(q*2.6+uTime*.04)*.6+vnoise(q*7.+3.)*.4;
          float e=uv.x*.72+(1.-uv.y)*.28+(nz-.5)*.34;
          float edge=mix(-.3,1.3,uMix);
          float m=1.-smoothstep(edge-.05,edge+.05,e);
          float band=exp(-pow((e-edge)/.075,2.));
          vec2 push=vec2(.034,.012)*band*(nz-.5)*2.;
          vec3 a=texture2D(tA,uv+push).rgb, b=texture2D(tB,uv-push).rgb;
          c=mix(a,b,m)+vec3(1.,.66,.52)*band*.16;
        }
        float v=1.-smoothstep(.3,1.3,length((uv-.5)*vec2(1.15,1.)));
        c*=mix(.84,1.,v);
        c+=(hash21(uv*vec2(1733.,977.)+fract(uTime)*91.)-.5)*.016;
        gl_FragColor=vec4(c,1.);
      }`;

export const VIDEO_FRAGMENT = `uniform sampler2D tV; uniform vec2 uFit; varying vec2 vUv; void main(){ gl_FragColor=vec4(texture2D(tV,(vUv-.5)*uFit+.5).rgb,1.); }`;
