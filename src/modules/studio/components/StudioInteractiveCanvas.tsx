"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function StudioInteractiveCanvas() {
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
      isMobile ? 52 : 45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 22 : 19;
    camera.position.x = 0;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    container.appendChild(renderer.domElement);

    // Root Group for Parallax (Strictly Centered at 0, 0, 0)
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    scene.add(rootGroup);

    // 1. Dynamic Chromatic Multi-colored Lights
    const light1 = new THREE.PointLight(0xf43f5e, 4, 35); // Rose
    const light2 = new THREE.PointLight(0x06b6d4, 4, 35); // Electric Cyan
    const light3 = new THREE.PointLight(0xa855f7, 3.5, 35); // Neon Purple
    scene.add(light1, light2, light3);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 2. Multi-colored Vertex Colored 3D Polyhedral Sphere
    const sphereRadius = isMobile ? 4.6 : 5.4;
    const sphereGeo = new THREE.IcosahedronGeometry(sphereRadius, 2);
    const count = sphereGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xf43f5e), // Rose
      new THREE.Color(0x06b6d4), // Cyan
      new THREE.Color(0xa855f7), // Purple
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0xec4899), // Pink
      new THREE.Color(0x3b82f6), // Blue
    ];

    const pos = sphereGeo.attributes.position;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Color mapping based on 3D coordinates for a chromatic gradient
      const factor = (Math.sin(x * 0.4) + Math.cos(y * 0.4) + Math.sin(z * 0.4) + 3) / 6;
      const colorIndex = Math.min(palette.length - 1, Math.floor(factor * palette.length));
      const chosenColor = palette[colorIndex];

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }
    sphereGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Semi-translucent inner facet mesh with chromatic wireframe
    const facetMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.25,
      metalness: 0.6,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const facetMesh = new THREE.Mesh(sphereGeo, facetMaterial);
    rootGroup.add(facetMesh);

    // Chromatic Wireframe Overlay
    const wireframeGeo = new THREE.WireframeGeometry(sphereGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    rootGroup.add(wireMesh);

    // Glowing Multi-color Vertex Points
    const pointsMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.28,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const vertexPoints = new THREE.Points(sphereGeo, pointsMat);
    rootGroup.add(vertexPoints);

    // 3. Vibrant Neon Orbital Rings
    const ringGeo1 = new THREE.TorusGeometry(8.2, 0.035, 8, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // Hot Rose
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    rootGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(9.6, 0.03, 8, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Neon Cyan
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 4;
    rootGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(11.0, 0.02, 8, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0xa855f7, // Purple
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.y = Math.PI / 3;
    rootGroup.add(ring3);

    // 4. Multi-color Ambient Creative Particle Field
    const particleCount = 160;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 26;

      const pColor = palette[i % palette.length];
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // Interactive Mouse & Velocity Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let mouseSpeed = 0;
    let lastX = 0;
    let lastY = 0;
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

      targetX = x * 1.2;
      targetY = y * 0.8;

      // Calculate velocity for interactive burst
      const dx = x - lastX;
      const dy = y - lastY;
      mouseSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 4, 2.5);
      lastX = x;
      lastY = y;
    };

    const handlePointerDown = () => {
      pulseScale = 1.12; // Interactive spring pop on click/touch
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", updateRect, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      updateRect();
      const width = container.clientWidth;
      const height = container.clientHeight;
      const mobile = width < 640;
      camera.fov = mobile ? 52 : 45;
      camera.position.z = mobile ? 22 : 19;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Pause when out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp with inertia
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Decay speed boost smoothly
      mouseSpeed *= 0.95;

      // Decay pulse scale back to 1 with spring
      pulseScale += (1 - pulseScale) * 0.08;

      // Interactive rotation (combining base spin + mouse interaction + velocity boost)
      const rotationBoost = 1 + mouseSpeed * 1.2;
      
      facetMesh.rotation.x = elapsedTime * 0.16 * rotationBoost + mouseY * 0.7;
      facetMesh.rotation.y = elapsedTime * 0.24 * rotationBoost + mouseX * 0.9;
      
      wireMesh.rotation.x = facetMesh.rotation.x;
      wireMesh.rotation.y = facetMesh.rotation.y;
      vertexPoints.rotation.x = facetMesh.rotation.x;
      vertexPoints.rotation.y = facetMesh.rotation.y;

      // Breathing subtle scale
      const breath = 1 + Math.sin(elapsedTime * 1.8) * 0.035;
      const currentScale = breath * pulseScale;
      rootGroup.scale.set(currentScale, currentScale, currentScale);

      // Orbiting Chromatic Lights creating shifting color caustics
      light1.position.x = Math.sin(elapsedTime * 0.9) * 12;
      light1.position.y = Math.cos(elapsedTime * 0.7) * 8;
      light1.position.z = Math.sin(elapsedTime * 0.5) * 10 + 6;

      light2.position.x = Math.cos(elapsedTime * 0.8) * 13;
      light2.position.y = Math.sin(elapsedTime * 1.1) * 9;
      light2.position.z = Math.cos(elapsedTime * 0.6) * 10 + 6;

      light3.position.x = Math.sin(elapsedTime * 0.6 + 2) * 11;
      light3.position.y = Math.cos(elapsedTime * 0.9 + 1) * 10;
      light3.position.z = Math.sin(elapsedTime * 0.8) * 8 + 5;

      // Counter-rotating orbital rings
      ring1.rotation.z = elapsedTime * 0.18;
      ring1.rotation.x = Math.PI / 3 + mouseY * 0.4;

      ring2.rotation.y = -elapsedTime * 0.14;
      ring2.rotation.z = Math.PI / 4 + mouseX * 0.4;

      ring3.rotation.x = elapsedTime * 0.12;
      ring3.rotation.y = Math.PI / 3 + mouseX * 0.2;

      // Ambient particle drift
      particles.rotation.y = elapsedTime * 0.03 + mouseX * 0.2;
      particles.rotation.x = mouseY * 0.15;

      // Camera parallax
      camera.position.x = mouseX * 2.2;
      camera.position.y = mouseY * 1.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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

      sphereGeo.dispose();
      wireframeGeo.dispose();
      facetMaterial.dispose();
      wireframeMat.dispose();
      pointsMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
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
