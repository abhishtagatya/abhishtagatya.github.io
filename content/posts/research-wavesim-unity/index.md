---
title: "Realistic Wave Simulation in Unity URP"
date: 2025-06-14T00:00:00+01:00
draft: false
description: "Experiment on Sum of Sine Waves"
tags: ["Unity", "HLSL Programming", "Rendering", "Shaders"]
categories: ["Experiment"]
lightbox:
  enabled: true
justified_gallery:
  enabled: true
cover: "demo.gif"
---

{{< youtube VeVeaHHpKKU >}}

### Introduction

This project is a **custom water shader** written in HLSL for the Universal Render Pipeline (URP). It simulates dynamic waves with configurable functions, domain warping, and physically-inspired lighting, enabling both stylized and semi-realistic water rendering.  

### Core Features  

#### Wave Simulation  
- Supports **sine** and **exponent-based** wave functions.  
- Multiple overlapping waves can be combined with adjustable **frequency**, **speed**, **amplitude**, and **wave count**.  
- **Domain warping** adds natural randomness and complexity to wave motion.  

#### Normal Reconstruction  
- Normals are recalculated using central differences for more accurate lighting.  
- Produces realistic reflections and specular highlights that respond to wave motion.  

#### Lighting and Reflections  
- Configurable between **PBR lighting** and **Blinn-Phong**.  
- Supports **environment reflections** via a cubemap.  
- Adjustable smoothness, metallic, and specular controls for fine-tuning water appearance.  

#### Customization Parameters  
- **Wave Settings**: Count, frequency, speed, amplitude.  
- **Warp Settings**: Frequency, amplitude, speed.  
- **Material Settings**: Base color, metallic, smoothness, occlusion, specular highlights, and reflection intensity.  

### Conclusion  

The shader demonstrates how to blend **procedural wave displacement** with **reflection-based lighting** to simulate believable water surfaces in Unity. By layering domain-warped waves and combining multiple lighting models, it balances flexibility, realism, and artistic control for interactive environments.  
