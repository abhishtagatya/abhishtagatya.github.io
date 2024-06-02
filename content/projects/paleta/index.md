---
title: "Paleta"
date: 2024-03-13
draft: false
project_tags: ["Python", "Pillow"]
status: "good"
weight: 1
summary: "Palette Extraction and Management Tool for Game Assets"
links:
    another_link:
        text: "Github"
        icon: "fab alt brands fa-github"
        href: "https://github.com/abhishtagatya/paintgan"
        weight: 1
---

{{< figure src="https://raw.githubusercontent.com/abhishtagatya/paleta/master/docs/preview.png" title="Paleta" width="100%">}}

Paleta is a Color Pallet Extraction and Management Tool that is focused on enhancing Visual Game Assets. It supports pallet conversion, mixing, minimizing, and matching in any way possible.

--- 

### Sample Code


```python
from paleta.color import Color
from paleta.palette import Palette
from paleta.image import export_palette, extract_convert_palette

# Initializing Colors
red = Color.from_hex("#F00")
green = Color.from_hex("#0F0")
blue = Color.from_hex("#00F")

# Operations on Color
magenta = red + blue
yellow = red + green
cyan = green + blue

print(magenta.rgba)  # Get RGBA value
print(yellow.to_lightness())  # To 0...255 Value
print(cyan.to_hsl())  # Get HSL Value

magenta += 10  # Add 10 across values of RGB
cyan -= (10, 0, 10)  # Subtract 10 across R and B value

twilight_5 = Palette(
    Color.from_hex("fbbbad"),
    Color.from_hex("ee8695"),
    Color.from_hex("4a7a96"),
    Color.from_hex("333f58"),
    Color.from_hex("292831")
)  # Create a Palette Class

tw = Palette.from_lospec("twilight-5")  # Or use the Lospec API

assert (twilight_5.colors == tw.colors)  # They're the same

twilight_5.add(yellow)  # Add yellow to the palette
twilight_5.remove(yellow)  # And Remove it

warm_ochre = Palette.from_lospec("warm-ochre")
the_after = Palette.from_lospec("the-after")

twilight_5.union(warm_ochre)  # Combine Palette Sets
twilight_5.intersection(the_after)  # Or find where they intersect

extract_convert_palette("ref.png", "palette.png", f_out="new_ref.png")  # Map a Palette to an Image
export_palette(warm_ochre, f="warm-ochre.png")  # Export a Created or Imported Palette
```