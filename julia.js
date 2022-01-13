let Shader,palette;
function setup() {
  createCanvas(window.innerWidth,window.innerHeight,WEBGL);
	pixelDensity(1.5);
  noStroke();
}
function draw() {
  shader(Shader);
	Shader.setUniform('pal',palette);
	Shader.setUniform('c',[cos(frameCount/256+PI/2)*0.8,cos(frameCount/256)*0.8]);
  rect(0,0,width,height);
}
function preload() {
  Shader=new p5.Shader(this._renderer,`
		precision highp float;
		attribute vec3 aPosition;
		attribute vec2 aTexCoord;
		varying vec2 vTexCoord;
		void main() {
			vTexCoord=aTexCoord;
			vec4 positionVec4=vec4(aPosition,1.);
			positionVec4.xy=positionVec4.xy*2.-1.; 
			gl_Position=positionVec4;
		}
	`,`
		precision highp float;
		varying vec2 vTexCoord;
		uniform sampler2D pal;
		uniform vec2 c;
		void main() {
			vec2 z=vec2(5.*vTexCoord.x-2.5,(5.*vTexCoord.y-2.5)*${windowHeight/windowWidth});
			int iter=100;
			for(int i=0;i<100;i++) {
				float x=(z.x+z.y)*(z.x-z.y)+c.x;
				float y=2.*z.y*z.x+c.y;
				if((x*x+y*y)>4.) {iter=i;break;}
				z.x=x;
				z.y=y;
			}
			gl_FragColor=texture2D(pal,vec2(iter==100?0.:float(iter)/100.,1));
		}
	`);
	palette=loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAAAAXNSR0IArs4c6QAAAGRJREFUOE9jZGBg+M8ABiwMDAwcSDQyGyZHSIyQPDZzOJCsZoE6AUaDnIRDDGwUmjqYGNwrUHmQOnQxFoQc3FVIykE+AWNai7EwMPxhQOAfFLBB5gyE/uHlAeTYGM5sUEphYAAAjJafAWvSA74AAAAASUVORK5CYII=");
}