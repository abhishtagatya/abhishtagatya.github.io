---
title: "VeinGAN"
date: 2023-12-15
draft: false
project_tags: ["Python", "PyTorch", "OpenCV"]
status: "good"
weight: 2
summary: "Generating Syntethic Vein Images using GAN"
links:
    external_link:
        text: "Google Colab Demo"
        icon: "fas fa-external-link-alt"
        href: "https://colab.research.google.com/drive/1-GCMNedTP3j0v8AhIl7Rg3qGMDB-9lj7?usp=sharing"
        weight: 1
    another_link:
        text: "Github"
        icon: "fab alt brands fa-github"
        href: "https://github.com/abhishtagatya/veingan"
        weight: 2
---

### VeinGAN

Synthetic Image Generation of Veins using Generative Models. Experimented from simple Deep Convolutional GAN, Variational AutoEncoders, and Cycle GAN with Extracted Vein Skeletal Images.

---

### Requirements

* Python 3.8+
* Torch 2.1+
* GPU 8GB+

---

### Models

Found in the `veingan/model` folder.

* DCGAN -- _Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks
, 2016_ [📝](https://arxiv.org/abs/1511.06434v2)
* VAE -- _Auto-Encoding Variational Bayes, 2013_ [📝](https://arxiv.org/abs/1312.6114)
* CycleGAN -- _Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Network, 2017_ [📝](https://arxiv.org/abs/1703.10593?amp=1)

Feel free to fork this repo and experiment with your own model to add domain comparison.