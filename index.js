let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

let gravity = 1;
let friction = 0.99;

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let mouse = {
  x: undefined,
  y: undefined
};
const maxRadius = 8;
const minRadius=5;
let particles = [];
let colorArr=getColorArray();

addEventListener("mousemove", event => {
  mouse.x = event.x;
  mouse.y = event.y;
});

addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

addEventListener("click", () => {
  colorArr=getColorArray();
  init();
});

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


function Distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}



function init() {
  particles = [];
  for (let i = 0; i < 900; i++) {
    const radius = 5;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);

    if (i != 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          Distance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);

          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, getColor(colorArr)));
  }
}

init();


function getColor() {
  let cl1r = ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"];
  let clr=[["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"],
  ["#C09CD9", "#7D60A6", "#353FF2", "#A69C0F", "#D9CC1E"],
  ["#D92378", "#0B508C", "#5ABFBF", "#F2E527", "#F23535"]];
  let color=clr[Math.floor(Math.random() * clr.length)];
  return color[Math.floor(Math.random() * color.length)];
}

// function getColor() {
//     let clr = ["#F2CB05", "#F29F05", "#D97904"];
//     return clr[Math.floor(Math.random() * clr.length)];
//   }


function getColorArray()
{
    let clr=[["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"],
    ["#C09CD9", "#7D60A6", "#353FF2", "#A69C0F", "#D9CC1E"],
    ["#4DBBBF", "#337D80", "#66FAFF", "#1A3E40", "#5CE1E6"],
    ["#F61F38", "#E2001A", "#AF0014", "#16AE95", "#00957C"],
    ["#7C428C", "#7833A6", "#F2A679", "#F28972", "#D97171"],
    ["#D92378", "#0B508C", "#5ABFBF", "#F2E527", "#F23535"]];
    console.log(clr[Math.floor(Math.random() * clr.length)]);
    
    return clr[Math.floor(Math.random() * clr.length)];
}



function getColor(colorArray){
    return colorArray[Math.floor(Math.random() * colorArray.length)];
}
getColor(getColorArray());

function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.minRadius = radius;
  this.velocity = {
    x: (Math.random() * 0.5)*5,
    y: (Math.random() * 0.5)*5
  };
  this.mass = 1;
  this.opacity=0.2;

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    //c.save();
    c.globalAlpha=this.opacity;
    c.fillStyle=color;
    c.fill();
    //c.restore();
    // c.strokeStyle=color;
    // c.stroke();
   
  };
  this.update = particles => {
    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;
      if (Distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0) {
        resolveCollision(this, particles[i]);
      }
    }

  
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      // this.dy = -this.dy * friction;        //for gravity
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    // // else{
    // //     this.dy+=gravity;  //gravity
    // // }

    // if(this.x + radius + this.dx>canvas.width || this.x-this.radius <= 0)
    // {
    //     this.dx= -this.dx;
    // }
    // this.x += this.dx;
    // this.y += this.dy;
    if(Distance(mouse.x,mouse.y,this.x,this.y)<100){
        if(this.opacity<1)
        {
            this.opacity +=0.08;
        }
        else this.opacity=1;
     }
     else if(this.opacity>0)
     {
         this.opacity -=0.02;
         this.opacity= Math.max(0,this.opacity);
     }
 
     if(mouse.x-this.x<50 && mouse.x-this.x>-50 && mouse.y-this.y<50 && mouse.y-this.y>=-50){
        if(this.radius<maxRadius){
            this.radius+=4;
        }
    }
    else if(this.radius>this.minRadius)
    {
        this.radius-=1;
    }
       this.draw();
  };
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach(particle => {
    particle.update(particles);
  });
}

init();


animate();
