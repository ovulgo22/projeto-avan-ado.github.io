import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.141.0/build/three.module.js';
import { createParticles, createGalaxy, createNebula } from './parte2.js';

// --- Função: criar buracos negros ---
export function createBlackHole(group, x, y, z, size){
    const geometry = new THREE.SphereGeometry(size,16,16);
    const material = new THREE.MeshBasicMaterial({color:0x000000});
    const blackHole = new THREE.Mesh(geometry,material);
    blackHole.position.set(x,y,z);
    group.add(blackHole);
    return blackHole;
}

// --- Linha do tempo do Big Bang ---
// 0-20s: Singularidade e inflação
export function timelineBigBang(particlesGroup, galaxiesGroup, nebulasGroup, blackHolesGroup){
    setTimeout(()=>{
        createParticles(particlesGroup, 5000, 1, 0.05, ['#ffffff','#ffffaa','#ffcc88']);
    },0);

    setTimeout(()=>{
        createParticles(particlesGroup, 10000, 5, 0.05, ['#ffffff','#ffffaa','#ffcc88']);
    },5000);

    // 20-40s: Radiação cósmica de fundo
    setTimeout(()=>{
        createParticles(particlesGroup, 5000, 15, 0.03, ['#ff5555','#ffaa33','#ffcc77']);
    },20000);

    // 40-60s: Formação de átomos
    setTimeout(()=>{
        createParticles(particlesGroup, 5000, 20, 0.04, ['#88ccff','#aaffaa']);
    },40000);

    // 60-100s: Primeiras estrelas e supernovas
    setTimeout(()=>{
        createGalaxy(galaxiesGroup, 10, 0, 0, 4, 1200, 5);
        createGalaxy(galaxiesGroup, -15, 5, 0, 3, 1000, 4);
    },60000);

    setTimeout(()=>{
        createParticles(particlesGroup, 1000, 3, 0.08, ['#ffffff','#ffff33']); // Supernovas
    },80000);

    // 100-160s: Nebulosas e evolução de galáxias
    setTimeout(()=>{
        createNebula(nebulasGroup, 0, 10, 0, 5, 0xff00ff);
        createNebula(nebulasGroup, 10, -5, 0, 4, 0x00ffff);
        createNebula(nebulasGroup, -10, -10, 0, 3, 0xffaa00);
    },100000);

    // 160-200s: Buracos negros e núcleos galácticos
    setTimeout(()=>{
        createBlackHole(blackHolesGroup, 10, 0, 0, 1);
        createBlackHole(blackHolesGroup, -15, 5, 0, 1.2);
    },160000);
}

// --- Função de animação contínua ---
export function animateUniverse(renderer, scene, camera, controls, particlesGroup, galaxiesGroup, nebulasGroup, blackHolesGroup){
    function animate(time){
        requestAnimationFrame(animate);
        controls.update();

        // Expansão do universo
        particlesGroup.children.forEach(points=>{
            const pos = points.geometry.attributes.position.array;
            for(let i=0;i<pos.length;i+=3){
                pos[i] *= 1.0005;
                pos[i+1] *= 1.0005;
                pos[i+2] *= 1.0005;
            }
            points.geometry.attributes.position.needsUpdate = true;
        });

        // Rotação galáxias
        galaxiesGroup.children.forEach(g=>{
            g.rotation.z += 0.0005;
            g.rotation.x += 0.0002;
        });

        // Pulsação nebulosas
        nebulasGroup.children.forEach(n=>{
            n.material.uniforms.time.value = time*0.001;
        });

        // Gravidade de buracos negros
        blackHolesGroup.children.forEach(bh=>{
            particlesGroup.children.forEach(points=>{
                const pos = points.geometry.attributes.position.array;
                for(let i=0;i<pos.length;i+=3){
                    const dx = bh.position.x - pos[i];
                    const dy = bh.position.y - pos[i+1];
                    const dz = bh.position.z - pos[i+2];
                    const dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
                    if(dist<5){
                        pos[i] += dx/dist*0.0005;
                        pos[i+1] += dy/dist*0.0005;
                        pos[i+2] += dz/dist*0.0005;
                    }
                }
                points.geometry.attributes.position.needsUpdate = true;
            });
        });

        renderer.render(scene,camera);
    }
    animate(0);
}
