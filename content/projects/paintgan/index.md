---
title: "PaintGAN"
date: 2022-08-12
draft: false
project_tags: ["Python", "TensorFlow"]
status: "good"
weight: 2
summary: "Generative Adversarial Models for Painting Domain"
links:
    external_link:
        text: "Google Colab Demo"
        icon: "fas fa-external-link-alt"
        href: "https://colab.research.google.com/drive/1JkWbnn-L_MflojHc3YVaPjQHabupmha_?usp=sharing"
        weight: 1
    another_link:
        text: "Github"
        icon: "fab alt brands fa-github"
        href: "https://github.com/abhishtagatya/paintgan"
        weight: 2
---

{{< figure src="https://raw.githubusercontent.com/abhishtagatya/paintgan/master/docs/model-comp.png" title="PaintGAN" width="100%">}}


PaintGAN is a framework that puts together Style Transfer models specifically in Painting Domains to be implemented in Tensorflow 2.8+ in a Google Colab environment.

--- 

### Requirements

* Python 3.8+
* Tensorflow 2.8+
* GPU 12GB+
* Storage Size 200GB+

---

### Models

Found in the `paintgan/algorithm` folder.

Style Transfer models are implemented using Tensorflow 2.8+ with each of them having a subfolder  `paintgan/algorithm/{model}_comp/` to store classes and functions
for implementation. Here are a few models implemented within this framework.

* Gatys et al. -- _A Neural Algorithm of Artistic Style, 2016_ [📝](https://arxiv.org/abs/1508.06576)
* AdaIN -- _Arbitrary Style Transfer in Real-time with Adaptive Instance Normalization, 2017_ [📝](https://arxiv.org/abs/1703.06868)
* CycleGAN -- _Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Network, 2017_ [📝](https://arxiv.org/abs/1703.10593?amp=1)
* DiscoGAN -- _Learning to Discover Cross-Domain Relations with Generative Adversarial Network, 2017_ [📝](https://arxiv.org/abs/1703.05192)

Feel free to fork this repo and experiment with your own model to add domain comparison.