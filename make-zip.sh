#!/bin/bash
zip_name="linkedin-feed-locker.zip"
build_folder="target"

mkdir -p $build_folder
rm -f $build_folder/$zip_name

zip -r $build_folder/$zip_name manifest.json content.js style.css icons/ LICENSE README.md

echo "Packaged extension as $build_folder/$zip_name"
