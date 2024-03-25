const fs = require('fs');
const sharp = require('sharp');

// Функция которая собирает фотки из папки
async function collectImagesFromFolder(folderPath) {
  const images = [];
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (file.toLowerCase().endsWith('.png')) {
      images.push(`${folderPath}/${file}`);
    }
  }
  return images;
}

// Функция для создания tifff файла из изображений..
async function createTiffFromPngImages(pngImages, outputFilename) {
  // Получаем метаданные первого изображения для определения размеров TIFF
  const { width, height } = await sharp(pngImages[0]).metadata();

  // Создаем новое изображение формата TIF, с этой библиотекой работаю впервые, думаю строго не засудите,хах)
  const tiffImage = sharp({
    create: {
      width,
      height,
      channels: 4, // RGBA, в случае 3 был бы RGB
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Прозрачный фон
    }
  });

  // Обрабатываем все изображения PNG и добавляем их к TIFF
  for (const pngImage of pngImages) {
    const pngBuffer = await sharp(pngImage).resize({ width, height }).toBuffer();
    tiffImage.composite([{ input: pngBuffer, left: 0, top: 0 }]);
  }

  // Сохраняем TIFF в файл
  await tiffImage.toFile(outputFilename);

  return outputFilename;
}

// Основная функция для сбора изображений из папки и создания TIFF файла
async function processImagesFolder(folderPath, outputFilename) {
  try {
    const pngImages = await collectImagesFromFolder(folderPath);
    const tiffFilename = await createTiffFromPngImages(pngImages, outputFilename);
    console.log(`Congrats!!! TIFF фай создан!)): ${tiffFilename}`);
  } catch (error) {
    console.error('какая то ошибка((:', error);
  }
}

const imagesFolderPath = './1388_12_Наклейки 3-D_3';
const outputFilename = 'Result.tiff';

processImagesFolder(imagesFolderPath, outputFilename);

// Запуск скрипта в терминале командой : node index.js, так же проверьте , в корневой ли вы директории