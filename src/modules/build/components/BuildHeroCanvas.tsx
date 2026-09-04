"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function BuildHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const isMobile = container.clientWidth < 640;

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 55 : 45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, isMobile ? 2 : 4, isMobile ? 24 : 20);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    container.appendChild(renderer.domElement);

    // Root Group (Centered for both mobile and desktop)
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    scene.add(rootGroup);

    // 1. Construction Engineering Lights (Amber 0xf59e0b, Industrial Rose 0xe11d48, Blueprint Cyan 0x06b6d4)
    const amberLight = new THREE.PointLight(0xf59e0b, 4, 35);
    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 35);
    const roseLight = new THREE.PointLight(0xe11d48, 3, 30);
    scene.add(amberLight, cyanLight, roseLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 2. Parametric Structural Steel Framework (Represents High-Rise RCC & Column Framing)
    const buildingGroup = new THREE.Group();
    rootGroup.add(buildingGroup);

    // Floor Slabs
    const slabGeo = new THREE.BoxGeometry(7, 0.25, 7);
    const slabEdges = new THREE.EdgesGeometry(slabGeo);
    const slabMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.75,
    });

    for (let floor = -2; floor <= 2; floor++) {
      const slabLine = new THREE.LineSegments(slabEdges, slabMat);
      slabLine.position.y = floor * 2.2;
      buildingGroup.add(slabLine);
    }

    // Vertical Columns (4 Corner Columns + 4 Mid-Span Columns)
    const colGeo = new THREE.BoxGeometry(0.2, 9, 0.2);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.8,
    });

    const colCoords = [
      [-3.3, -3.3], [3.3, -3.3], [-3.3, 3.3], [3.3, 3.3],
      [0, -3.3], [0, 3.3], [-3.3, 0], [3.3, 0]
    ];

    colCoords.forEach(([cx, cz]) => {
      const column = new THREE.Mesh(colGeo, colMat);
      column.position.set(cx, 0, cz);
      buildingGroup.add(column);
    });

    // 3. Diagonal Structural Bracing (Seismic Zone V Engineering Cross Ties)
    const braceMat = new THREE.LineBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.6,
    });

    const bracePoints = [
      new THREE.Vector3(-3.3, -4.4, -3.3), new THREE.Vector3(3.3, 4.4, -3.3),
      new THREE.Vector3(3.3, -4.4, -3.3), new THREE.Vector3(-3.3, 4.4, -3.3),
      new THREE.Vector3(-3.3, -4.4, 3.3), new THREE.Vector3(3.3, 4.4, 3.3),
      new THREE.Vector3(3.3, -4.4, 3.3), new THREE.Vector3(-3.3, 4.4, 3.3),
    ];
    const braceGeo = new THREE.BufferGeometry().setFromPoints(bracePoints);
    const braceLines = new THREE.LineSegments(braceGeo, braceMat);
    buildingGroup.add(braceLines);

    // 4. Ground Blueprint Grid
    const gridHelper = new THREE.GridHelper(26, 26, 0xf59e0b, 0x334155);
    gridHelper.position.y = -5.8;
    rootGroup.add(gridHelper);

    // 5. Floating Dust & Spark Particle Field (Construction Site Spark Atmosphere)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i + 2] = (Math.random() - 0.5) * 35;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let pulseScale = 1;

    // Cache container rect to prevent forced layout reflows on pointermove
    let containerRect = container.getBoundingClientRect();
    const updateRect = () => {
      if (container) {
        containerRect = container.getBoundingClientRect();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = containerRect;
      if (!rect.width || !rect.height) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.9;
      targetY = y * 0.6;
    };

    const handlePointerDown = () => {
      pulseScale = 1.08;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });

    const handleResize = () => {
      if (!container) return;
      updateRect();
      const width = container.clientWidth;
      const height = container.clientHeight;
      const mobile = width < 640;
      camera.fov = mobile ? 55 : 45;
      camera.position.z = mobile ? 24 : 20;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      pulseScale += (1 - pulseScale) * 0.08;

      // Rotate architectural structural frame
      buildingGroup.rotation.y = elapsedTime * 0.18 + mouseX * 0.5;
      buildingGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05 + mouseY * 0.3;

      // Orbiting construction site lights
      amberLight.position.x = Math.sin(elapsedTime * 0.8) * 12;
      amberLight.position.y = Math.cos(elapsedTime * 0.6) * 8;
      amberLight.position.z = Math.sin(elapsedTime * 0.7) * 10 + 6;

      cyanLight.position.x = Math.cos(elapsedTime * 0.7) * 13;
      cyanLight.position.y = Math.sin(elapsedTime * 0.9) * 9;
      cyanLight.position.z = Math.cos(elapsedTime * 0.5) * 10 + 6;

      roseLight.position.x = Math.sin(elapsedTime * 0.5 + 2) * 11;
      roseLight.position.y = Math.cos(elapsedTime * 0.8 + 1) * 8;
      roseLight.position.z = Math.sin(elapsedTime * 0.6) * 8 + 5;

      // Gentle floating particles
      particles.rotation.y = elapsedTime * 0.02 + mouseX * 0.15;
      particles.rotation.x = mouseY * 0.1;

      // Breathing scale
      const breath = 1 + Math.sin(elapsedTime * 1.5) * 0.025;
      const currentScale = breath * pulseScale;
      rootGroup.scale.set(currentScale, currentScale, currentScale);

      // Camera parallax
      camera.position.x = mouseX * 1.8;
      camera.position.y = (isMobile ? 2 : 4) + mouseY * 1.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      slabGeo.dispose();
      slabEdges.dispose();
      slabMat.dispose();
      colGeo.dispose();
      colMat.dispose();
      braceGeo.dispose();
      braceMat.dispose();
      gridHelper.geometry.dispose();
      (gridHelper.material as THREE.Material).dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-90 select-none"
      aria-hidden="true"
    />
  );
}
