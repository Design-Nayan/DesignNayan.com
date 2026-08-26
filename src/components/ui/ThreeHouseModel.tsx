"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ThreeHouseModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(16, 12, 20);
    camera.lookAt(0, 2.5, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 3. Lighting (Architectural Sun & Warm Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.8);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    sunLight.position.set(20, 30, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-15, 15, -15);
    scene.add(fillLight);

    // Warm Interior Point Lights
    const warmLight1 = new THREE.PointLight(0xff9933, 4, 12);
    warmLight1.position.set(1, 3.5, 2);
    scene.add(warmLight1);

    const warmLight2 = new THREE.PointLight(0xffaa44, 3, 10);
    warmLight2.position.set(-2, 1.8, 1);
    scene.add(warmLight2);

    // 4. Materials
    const concreteWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
    });

    const concreteDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2,
    });

    const woodPlankMat = new THREE.MeshStandardMaterial({
      color: 0xc28249,
      roughness: 0.55,
      metalness: 0.05,
    });

    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.6,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      reflectivity: 0.9,
    });

    const interiorGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
    });

    const metalFrameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    });

    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x65a30d,
      roughness: 0.8,
    });

    // 5. Build 3D House Model Hierarchy
    const houseGroup = new THREE.Group();

    // A. Base Platform / Lawn & Pool
    const groundGeo = new THREE.BoxGeometry(16, 0.4, 14);
    const groundMesh = new THREE.Mesh(groundGeo, concreteWhiteMat);
    groundMesh.position.y = -0.2;
    groundMesh.receiveShadow = true;
    houseGroup.add(groundMesh);

    // Swimming pool
    const poolGeo = new THREE.BoxGeometry(5.5, 0.3, 3);
    const poolMesh = new THREE.Mesh(poolGeo, poolWaterMat);
    poolMesh.position.set(4, -0.05, 3.5);
    houseGroup.add(poolMesh);

    // Grass section
    const grassGeo = new THREE.BoxGeometry(14.5, 0.05, 3);
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.set(0, 0.03, -4.5);
    houseGroup.add(grassMesh);

    // B. Ground Floor Structure
    // Main ground block (White plaster)
    const gfMainGeo = new THREE.BoxGeometry(8, 3, 7);
    const gfMain = new THREE.Mesh(gfMainGeo, concreteWhiteMat);
    gfMain.position.set(-1, 1.5, 0);
    gfMain.castShadow = true;
    gfMain.receiveShadow = true;
    houseGroup.add(gfMain);

    // Wood accent wall on ground floor
    const woodWallGeo = new THREE.BoxGeometry(3.5, 2.9, 0.2);
    const woodWall = new THREE.Mesh(woodWallGeo, woodPlankMat);
    woodWall.position.set(-3.2, 1.5, 3.55);
    woodWall.castShadow = true;
    houseGroup.add(woodWall);

    // Glass Living Room Facade (Ground floor)
    const gfGlassGeo = new THREE.BoxGeometry(4.2, 2.7, 0.1);
    const gfGlass = new THREE.Mesh(gfGlassGeo, glassMat);
    gfGlass.position.set(0.8, 1.45, 3.55);
    houseGroup.add(gfGlass);

    // Interior warm glow panel
    const gfInteriorGeo = new THREE.PlaneGeometry(3.8, 2.4);
    const gfInterior = new THREE.Mesh(gfInteriorGeo, interiorGlowMat);
    gfInterior.position.set(0.8, 1.45, 2.5);
    houseGroup.add(gfInterior);

    // Ground floor window mullions (Black metal frame)
    const gfMullionGeo = new THREE.BoxGeometry(0.1, 2.7, 0.15);
    const gfMullion1 = new THREE.Mesh(gfMullionGeo, metalFrameMat);
    gfMullion1.position.set(-0.6, 1.45, 3.58);
    houseGroup.add(gfMullion1);

    const gfMullion2 = new THREE.Mesh(gfMullionGeo, metalFrameMat);
    gfMullion2.position.set(2.2, 1.45, 3.58);
    houseGroup.add(gfMullion2);

    // C. First Floor Cantilever (Modern Architectural Overhang)
    const ffCantileverGeo = new THREE.BoxGeometry(9, 3.2, 6.5);
    const ffCantilever = new THREE.Mesh(ffCantileverGeo, concreteDarkMat);
    ffCantilever.position.set(0.5, 4.6, 0.8);
    ffCantilever.castShadow = true;
    ffCantilever.receiveShadow = true;
    houseGroup.add(ffCantilever);

    // Wood Paneling Section on First Floor
    const ffWoodGeo = new THREE.BoxGeometry(4, 3, 0.2);
    const ffWood = new THREE.Mesh(ffWoodGeo, woodPlankMat);
    ffWood.position.set(2.8, 4.6, 4.1);
    ffWood.castShadow = true;
    houseGroup.add(ffWood);

    // Master Bedroom Large Glass Panorama Window
    const ffGlassGeo = new THREE.BoxGeometry(4.6, 2.6, 0.1);
    const ffGlass = new THREE.Mesh(ffGlassGeo, glassMat);
    ffGlass.position.set(-1.6, 4.6, 4.1);
    houseGroup.add(ffGlass);

    // Master Bedroom Warm Interior Glow
    const ffInterior = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.2), interiorGlowMat);
    ffInterior.position.set(-1.6, 4.6, 3.2);
    houseGroup.add(ffInterior);

    // Balcony Overhang & Glass Railing
    const balconyFloorGeo = new THREE.BoxGeometry(6, 0.2, 2.5);
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, concreteWhiteMat);
    balconyFloor.position.set(-1.5, 3.05, 4.8);
    balconyFloor.castShadow = true;
    balconyFloor.receiveShadow = true;
    houseGroup.add(balconyFloor);

    // Glass Balcony Railing
    const railingGlassGeo = new THREE.BoxGeometry(6, 0.9, 0.05);
    const railingGlass = new THREE.Mesh(railingGlassGeo, glassMat);
    railingGlass.position.set(-1.5, 3.6, 6);
    houseGroup.add(railingGlass);

    // Top Handrail
    const handrailGeo = new THREE.BoxGeometry(6.1, 0.08, 0.1);
    const handrail = new THREE.Mesh(handrailGeo, metalFrameMat);
    handrail.position.set(-1.5, 4.05, 6);
    houseGroup.add(handrail);

    // Side Railing
    const sideRailingGeo = new THREE.BoxGeometry(0.05, 0.9, 2.4);
    const sideRailing = new THREE.Mesh(sideRailingGeo, glassMat);
    sideRailing.position.set(-4.5, 3.6, 4.8);
    houseGroup.add(sideRailing);

    // D. Rooftop Terrace & Architectural Canopy
    const roofSlabGeo = new THREE.BoxGeometry(9.6, 0.35, 7.2);
    const roofSlab = new THREE.Mesh(roofSlabGeo, concreteWhiteMat);
    roofSlab.position.set(0.5, 6.3, 0.8);
    roofSlab.castShadow = true;
    houseGroup.add(roofSlab);

    // Roof Louver / Pergola
    for (let i = 0; i < 5; i++) {
      const louverGeo = new THREE.BoxGeometry(4, 0.15, 0.1);
      const louver = new THREE.Mesh(louverGeo, darkWoodMat);
      louver.position.set(2.5, 6.6, -1 + i * 0.8);
      louver.castShadow = true;
      houseGroup.add(louver);
    }

    // E. Architectural Landscaping & Details
    // Modern Planter Box
    const planterGeo = new THREE.BoxGeometry(1.2, 0.8, 4);
    const planter = new THREE.Mesh(planterGeo, concreteDarkMat);
    planter.position.set(-5.5, 0.4, 2);
    planter.castShadow = true;
    houseGroup.add(planter);

    // Plants / Foliage
    for (let i = 0; i < 3; i++) {
      const foliageGeo = new THREE.SphereGeometry(0.5 + Math.random() * 0.2, 8, 8);
      const foliage = new THREE.Mesh(foliageGeo, grassMat);
      foliage.position.set(-5.5, 1.1, 0.8 + i * 1.2);
      foliage.castShadow = true;
      houseGroup.add(foliage);
    }

    // Modern Stepping Stones
    for (let i = 0; i < 4; i++) {
      const paverGeo = new THREE.BoxGeometry(1.4, 0.08, 0.8);
      const paver = new THREE.Mesh(paverGeo, concreteWhiteMat);
      paver.position.set(1.5 + i * 0.4, 0.04, 5.5 + i * 1.0);
      paver.receiveShadow = true;
      houseGroup.add(paver);
    }

    // Position house group in scene
    houseGroup.position.set(0, -1, 0);
    scene.add(houseGroup);

    setLoading(false);

    // 6. Interactive Mouse Parallax & Orbit
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = -0.35;
    let targetRotationX = 0.08;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = -0.35 + mouseX * 0.45;
      targetRotationX = 0.08 - mouseY * 0.2;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseX = x;
        targetRotationY = -0.35 + mouseX * 0.4;
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating breathing animation
      houseGroup.position.y = -1 + Math.sin(elapsedTime * 1.2) * 0.08;

      // Smooth interpolation toward target mouse angle + subtle idle rotation
      const idleAngle = Math.sin(elapsedTime * 0.5) * 0.08;
      houseGroup.rotation.y += (targetRotationY + idleAngle - houseGroup.rotation.y) * 0.05;
      houseGroup.rotation.x += (targetRotationX - houseGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Placeholder */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
            <span className="text-xs font-semibold text-neutral-500">Loading 3D Architecture Model...</span>
          </div>
        </div>
      )}
    </div>
  );
}
