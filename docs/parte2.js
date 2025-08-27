import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

// --- Shaders GLSL para nebulosas ---
export const nebulaVertex = `
varying vec3 vColor;
void main() {
    vColor = color;
    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

export const nebulaFragment = `
varying vec3 vColor;
uniform float time;
void main() {
    float alpha = 0.3 + 0.2*sin(time*0.5 + gl_FragCoord.x*0.01);
    gl_FragColor = vec4(vColor, alpha);
}
`;

// --- Função: criar partículas básicas ---
export function createParticles(group, num, spread, size, colors){
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(num*3);
    const particleColors = new Float32Array(num*3);
    const color = new THREE.Color();

    for(let i=0;i<num;i++){
        positions[i*3] = (Math.random()-0.5)*spread;
        positions[i*3+1] = (Math.random()-0.5)*spread;
        positions[i*3+2] = (Math.random()-0.5)*spread;

        color.set(colors[Math.floor(Math.random()*colors.length)]);
        particleColors[i*3] = color.r;
        particleColors[i*3+1] = color.g;
        particleColors[i*3+2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleColors,3));

    const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite:false
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
    return points;
}

// --- Função: criar galáxias espirais ---
export function createGalaxy(group, cx, cy, cz, arms, particlesPerArm, radius){
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for(let i=0;i<arms;i++){
        for(let j=0;j<particlesPerArm;j++){
            const angle = (j/particlesPerArm)*Math.PI*2 + (i*2*Math.PI/arms);
            const r = (j/particlesPerArm)*radius;
            const x = cx + r*Math.cos(angle);
            const y = cy + r*Math.sin(angle);
            const z = cz + (Math.random()-0.5)*0.5;

            positions.push(x,y,z);
            color.setHSL(Math.random(),1.0,0.5);
            colors.push(color.r,color.g,color.b);
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));

    const material = new THREE.PointsMaterial({
        size:0.05,
        vertexColors:true,
        blending:THREE.AdditiveBlending,
        depthWrite:false
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
    return points;
}

// --- Função: criar nebulosas pulsantes ---
export function createNebula(group, cx, cy, cz, radius, colorHex){
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color(colorHex);

    for(let i=0;i<3000;i++){
        const angle = Math.random()*Math.PI*2;
        const r = Math.random()*radius;
        const x = cx + r*Math.cos(angle);
        const y = cy + r*Math.sin(angle);
        const z = cz + (Math.random()-0.5)*radius/2;

        positions.push(x,y,z);
        colors.push(color.r,color.g,color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));

    const material = new THREE.ShaderMaterial({
        vertexShader: nebulaVertex,
        fragmentShader: nebulaFragment,
        uniforms: { time: { value: 0 } },
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent:true,
        depthWrite:false
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
    return points;
}
