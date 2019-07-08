cd class
composite -background none -size 32x32 .png
montage $(cat ../composition.tsv | sed 's/\t/.png /g') -background none -tile 11x6 -geometry 32x32+0+0 classes.png
rm .png
pngquant classes.png
mv classes-fs8.png ../classes.png
rm classes.png
cd ..
