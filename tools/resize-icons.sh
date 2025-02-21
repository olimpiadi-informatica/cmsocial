#!/usr/bin/env sh

convert -background none icon0.svg -resize 128x128 -gravity center -extent 128x128 favicon.ico
convert -background none icon0.svg -resize 180x180 -gravity center -extent 180x180 apple-icon.png
convert -background none icon0.svg -resize 512x512 -gravity center -extent 512x512 icon1.png
convert -background none icon0.svg -resize 360x360 -gravity center -extent 512x512 icon-mask.png
