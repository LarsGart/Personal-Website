var colors = "083d77-ebebd3-f4d35e-ee964b-f95738-f24".split("-").map(a=>"#"+a)
var colors2 = "22577a-38a3a5-57cc99-80ed99-c7f9cc-fff".split("-").map(a=>"#"+a)
var particles = []
var particle_multiplier = 5.6
var mobile = false
var pixel_density_modifier = 3
function setup() {
	createCanvas(window.innerWidth,window.innerHeight);
	// if the height is greater than the width, we're on a phone
	if (window.innerHeight > window.innerWidth) {
		// set the particle multiplier to 5
		mobile = true;
		particle_multiplier = 12;
		pixel_density_modifier = 8;
	}
	background(100);
	fill("#151023")
	pixelDensity(particle_multiplier / pixel_density_modifier)
	rect(0,0,width,height) // 
	for(var i=0;i<height;i+=particle_multiplier){
		if(mobile){
			break;
		}
		particles.push(new Particle({
			p: createVector(0,(i-height/2)+height/2),
			v: createVector(1,-(i-height/2)/50),
			a: createVector(0.04,0),
			color: colors[int(i/50)%colors.length],
			r: max(1,random(15)*random()*random())
		}))
	
	}
}

function draw() {
	noStroke()
	// background(0,1)
	particles.forEach(p=>{
		p.update()
		p.draw()
	})
}

function mouseClicked() {
	var num_particles = 40;
	var circle_radius = 14;
	if(mobile){
		num_particles /= 4;
	}
	for (var i = 0; i < num_particles; i++) {
	  var angle = i * (360 / num_particles);
	  var x = mouseX + circle_radius * cos(radians(angle));
	  var y = mouseY + circle_radius * sin(radians(angle));
	  var velocity = createVector(x - mouseX, y - mouseY);
	  velocity.mult(.4); // adjust this multiplier to control the particle speed
	  particles.push(new Particle({
		p: createVector(x, y),
		v: velocity,
		a: createVector(0.04, 0),
		color: random(random([colors,colors2])),
		r: max(1, random(15) * random())
	  }));
	}
  }
  
  

class Particle{
	constructor(args){
		let def = {
			lastP: createVector(0,0),
			p: createVector(0,0),
			v: createVector(0,0),
			a: createVector(0,0),
			color: color(255),
			rSpan: random([120]),
			dashSpan: random([90]),
			r: 2
		}
		Object.assign(def,args)
		Object.assign(this,def)
	}
	update(){
		this.lastP.x = this.p.x
		this.lastP.y = this.p.y
		this.p.add(this.v)
		this.v.add(this.a)
			this.p.y+=sin(this.p.x/this.rSpan)*particle_multiplier
			this.p.x+=sin(this.p.y/this.rSpan)*particle_multiplier
		
		if (int(this.p.x)%20==0){
			this.v.x+=(noise(this.p.x*100,100000)-0.5)/20
			this.v.y+=(noise(this.p.y*100,5)-0.15)/20
		}
		let delta = createVector(width/2.2,height/2.2).sub(this.p) //
		if(mobile){
			this.p.add(delta.mult(0.003).limit(5))
		}else{
		this.p.add(delta.mult(0.035).limit(5))
		}
		this.v.mult(0.999)
		this.r*=0.998
	}
	draw(){
		push()
			noStroke()
			strokeWeight(this.r)
			stroke(this.color)
			if ((frameCount % this.dashSpan)<this.dashSpan){
				line(this.lastP.x,this.lastP.y,this.p.x,this.p.y)
			}
			let c = color(this.color)
			c.setAlpha(3)
			stroke(c)
			blendMode(SCREEN)
		pop() // this pop is for the blendMode. blendMode is a way 
		
	}
}
