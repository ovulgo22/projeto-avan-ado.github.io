import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';

// --- Função: zoom cinematográfico automático ---
export function cinematicZoom(camera, timelineDuration=180000){ // duração em ms
    const startTime = performance.now();
    function updateZoom(){
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / timelineDuration, 1); // normaliza de 0 a 1
        camera.position.z = 60 - 30*t + 10*Math.sin(elapsed*0.0005); // zoom + leve oscilação
        if(t<1) requestAnimationFrame(updateZoom);
    }
    updateZoom();
}

// --- Função: glow avançado para supernovas ---
export function supernovaGlow(points){
    points.material.size = 0.08;
    points.material.needsUpdate = true;
    function pulse(){
        points.material.size = 0.06 + 0.02*Math.sin(performance.now()*0.005);
        requestAnimationFrame(pulse);
    }
    pulse();
}

// --- Função: fundo de estrelas com parallax ---
export function createStarField(scene, numStars=2000, spread=200){
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for(let i=0;i<numStars;i++){
        positions.push(
            (Math.random()-0.5)*spread,
            (Math.random()-0.5)*spread,
            (Math.random()-0.5)*spread
        );
        color.setHSL(0.6 + Math.random()*0.4,0.7,0.8);
        colors.push(color.r,color.g,color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors:true,
        blending: THREE.AdditiveBlending,
        depthWrite:false
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    return stars;
}

// --- Função: distorção gravitacional aprimorada ---
export function gravityDistortion(blackHolesGroup, particlesGroup){
    function updateGravity(){
        blackHolesGroup.children.forEach(bh=>{
            particlesGroup.children.forEach(points=>{
                const pos = points.geometry.attributes.position.array;
                for(let i=0;i<pos.length;i+=3){
                    const dx = bh.position.x - pos[i];
                    const dy = bh.position.y - pos[i+1];
                    const dz = bh.position.z - pos[i+2];
                    const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                    if(dist<7){ // raio de influência maior
                        const force = 0.001/dist; // atração proporcional inversa à distância
                        pos[i] += dx*force;
                        pos[i+1] += dy*force;
                        pos[i+2] += dz*force;
                    }
                }
                points.geometry.attributes.position.needsUpdate = true;
            });
        });
        requestAnimationFrame(updateGravity);
    }
    updateGravity();
}
