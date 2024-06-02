---
title: "AutoClip"
date: 2023-07-04
draft: false
project_tags: ["Python", "MoviePy", "GoogleTTS"]
status: "good"
weight: 2
summary: "Automatic Video Editing for TikTok/YT Shorts Format"
links:
    external_link:
        text: "YouTube"
        icon: "fas fa-external-link-alt"
        href: "https://youtu.be/hBpDLvg5Mbs?si=yrMnub6qXm1QOWMP"
        weight: 1
    another_link:
        text: "Github"
        icon: "fab alt brands fa-github"
        href: "https://gist.github.com/abhishtagatya/e2899784cf7a526b47834f478a35d069"
        weight: 2
---

[<img src="https://img.youtube.com/vi/hBpDLvg5Mbs/maxresdefault.jpg" width="100%" title="AutoClip">](https://youtu.be/hBpDLvg5Mbs)

### AutoClip

Vertical Video Editing made easy by AutoClip. Simply fill in the video background, the overlay, and the text-to-speech to generate a quality video ready to be uploaded on your platform of choice.

---

### Source Code


```python
#    _____     _       _____ _ _     
#   |  _  |_ _| |_ ___|     | |_|___ 
#   |     | | |  _| . |   --| | | . |
#   |__|__|___|_| |___|_____|_|_|  _|
#                            |_| 
#
# By Abhishta (github.com/abhishtagatya)

# pip install gTTs
# pip install moviepy
# pip install rich
# pip install pyfiglet

import os
import random
from typing import List, Tuple

from gtts import gTTS
from moviepy.editor import (
    CompositeVideoClip, CompositeAudioClip,
    VideoFileClip, AudioFileClip, ImageClip, TextClip,
    concatenate_videoclips, concatenate_audioclips
)
import moviepy.video.fx.all as vfx
from rich.console import Console
from rich.progress import track
import pyfiglet


def generate_speech(
        text: str, 
        lang: str = 'en', 
        filename: str = 'audio.mp3'):
    """
    Generate Speech Audio from gTTS

    text: str - Text to be synthesized
    lang: str - Language of text
    filename: str - Filename of output
    """
    myobj = gTTS(text=text, lang=lang, slow=False, tld='ca') # Change per settings https://gtts.readthedocs.io/en/latest/module.html
    myobj.save(filename)
    return


def clip(
        content: str, 
        video_file: str, 
        outfile: str, 
        image_file: str = '', 
        offset: int = 0, 
        duration: int = 0):
    """
    Generate the Complete Clip

    content: str - Full content text
    video_file: str - Background video
    outfile: str - Filename of output
    image_file: str - Banner to display
    offset: int - Offset starting point of background video (default: 0)
    duration: int - Limit the video (default: audio length)
    """
    audio_comp, text_comp = generate_audio_text(split_text(content))

    audio_comp_list = []
    for audio_file in track(audio_comp, description='Stitching Audio...'):
        audio_comp_list.append(AudioFileClip(audio_file))
    audio_comp_stitch = concatenate_audioclips(audio_comp_list)
    audio_comp_stitch.write_audiofile('temp_audio.mp3', fps=44100)

    audio_duration = audio_comp_stitch.duration
    if duration == 0:
        duration = audio_duration

    audio_comp_stitch.close()

    vid_clip = VideoFileClip(video_file).subclip(offset, offset + duration)
    vid_clip = vid_clip.resize((1980, 1280))
    vid_clip = vid_clip.crop(x_center=1980 / 2, y_center=1280 / 2, width=720, height=1280)

    if image_file != '':
        image_clip = ImageClip(image_file).set_duration(duration).set_position(("center", 'center')).resize(0.8) # Adjust if the Banner is too small
        vid_clip = CompositeVideoClip([vid_clip, image_clip])

    vid_clip = CompositeVideoClip([vid_clip, concatenate_videoclips(text_comp).set_position(('center', 860))])

    vid_clip = vid_clip.set_audio(AudioFileClip('temp_audio.mp3').subclip(0, duration))
    vid_clip.write_videofile(outfile, audio_codec='aac')
    vid_clip.close()


def split_text(text: str, delimiter: str = '\n'):
    """
    Split the Text

    text: str - Text to split
    delimiter: str - Delimiter of split (default: \n)
    """
    return text.split(delimiter)


def generate_audio_text(fulltext: List[str]):
    """
    Generate Audio and Text from Full Text

    fulltext: List[str] - List of splitted Text
    """
    audio_comp = []
    text_comp = []

    for idx, text in track(enumerate(fulltext), description='Synthesizing Audio...'):
        if text == "":
            continue
            
        audio_file = f"temp_assets/audio_{idx}.mp3"
        generate_speech(text.strip(), filename=audio_file)

        audio_duration = AudioFileClip(audio_file).duration

        text_clip = TextClip(
            text,
            font='Helvetica', # Change Font if not found
            fontsize=32,
            color="white",
            align='center',
            method='caption',
            size=(660, None)
        )
        text_clip = text_clip.set_duration(audio_duration)

        audio_comp.append(audio_file)
        text_comp.append(text_clip)

    return audio_comp, text_comp


if __name__ == '__main__':

    console = Console()
    banner = pyfiglet.figlet_format(text='AutoClip', font='rectangles')
    console.print()
    console.print("[bold][red1]" + banner)
    console.print("[dark_red] By Abhishta (github.com/abhishtagatya)")

    if not os.path.exists("temp_assets"):
        os.mkdir("temp_assets")

    video_background_file = "<SET YOUR VIDEO FILE>.mp4" # Your video background file
    video_background_offset = random.randint(0, 5000) # Starting Position of Video : 0 for Beginning
    image_banner_file = "<SET YOUR IMAGE BANNER>.png" # Your image banner file
    output_file = "AutoClip_Out.mp4" # The output filename

    content = """<YOUR STORY>
    <RECOMMENDED TO SPLIT PER LINES>
    <IF YOU WANT TO DISPLAY SUBTITLES IN THIS ORDER>
    <THANK YOU>
    """

    console.print("\n\n[light_green] Task Starting\n\n")
    clip(content=content, 
         video_file=video_background_file, 
         image_file=image_banner_file,
         outfile=output_file, 
         offset=video_background_offset)

    console.print("\n\n[light_green] Completed!")
```