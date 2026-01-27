/* eslint-disable */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(process.cwd(), 'public', 'images');

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  files.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg'].includes(ext)) {
      const inputPath = path.join(imagesDir, file);
      // Construct output path with .webp extension
      // We use the same basename. 
      const outputFilename = path.basename(file, ext) + '.webp';
      const outputPath = path.join(imagesDir, outputFilename);

      console.log(`Converting ${file} to ${outputFilename}...`);

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(info => {
          console.log(`Successfully converted ${file} to WebP.`);
        })
        .catch(err => {
          console.error(`Error converting ${file}:`, err);
        });
    }
  });
});
