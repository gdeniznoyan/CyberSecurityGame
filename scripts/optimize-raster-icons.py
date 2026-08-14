import argparse
from pathlib import Path

from PIL import Image


def optimize_icon(path: Path, output_size: int, content_size: int) -> None:
    with Image.open(path) as source:
        image = source.convert("RGBA")
        alpha_box = image.getchannel("A").getbbox()

        if alpha_box is None:
            raise ValueError(f"Icon has no visible content: {path}")

        subject = image.crop(alpha_box)
        subject.thumbnail((content_size, content_size), Image.Resampling.LANCZOS)

        canvas = Image.new("RGBA", (output_size, output_size), (0, 0, 0, 0))
        position = (
            (output_size - subject.width) // 2,
            (output_size - subject.height) // 2,
        )
        canvas.alpha_composite(subject, position)
        canvas.save(path, "PNG", optimize=True)


parser = argparse.ArgumentParser(description="Crop, center, and optimize raster icons.")
parser.add_argument("--directory", type=Path, default=Path("assets/component-icons-raster"))
parser.add_argument("--output-size", type=int, default=512)
parser.add_argument("--content-size", type=int, default=456)
args = parser.parse_args()

icon_paths = sorted(args.directory.glob("*.png"))
for icon_path in icon_paths:
    optimize_icon(icon_path, args.output_size, args.content_size)

print(f"Optimized {len(icon_paths)} raster icons in {args.directory}.")
