const sharp = require('sharp');
const fs = require('fs');
const fsp = require('fs/promises');

async function fun() {
  if (!fs.existsSync(`backup`)) {
    await fsp.mkdir('backup');
  }
  const articles = (await fsp.readdir('content/articles')).filter(dir => dir !== '.DS_Store');
  for (const article of articles) {
    if (!fs.existsSync(`backup/${article}`)) {
      await fsp.mkdir(`backup/${article}`);
    }
    const photos = (await fsp.readdir(`content/articles/${article}`)).filter(file => file.slice(-4) === '.png');
    for (const photo of photos) {
      if (!fs.existsSync(`backup/${article}/${photo}`)) {
        await fsp.copyFile(`content/articles/${article}/${photo}`, `backup/${article}/${photo}`);
        const stream = sharp(`content/articles/${article}/${photo}`);
        const info = await stream.metadata();
        if (info.width > 1800) {
          await stream
            .resize(1800)
            .png({ quality: 70 })
            .toFile(`content/articles/${article}/_${photo}`);
        }
        else {
          await stream
            .png({ quality: 70 })
            .toFile(`content/articles/${article}/_${photo}`);
        }
        await fsp.unlink(`content/articles/${article}/${photo}`);
        await fsp.rename(`content/articles/${article}/_${photo}`, `content/articles/${article}/${photo}`);
      }
      else {
        await fsp.copyFile(`content/articles/${article}/${photo}`, `backup/${article}/_${photo}`);
        await fsp.copyFile(`backup/${article}/${photo}`, `content/articles/${article}/_${photo}`);
        await fsp.unlink(`content/articles/${article}/${photo}`);
        await fsp.unlink(`backup/${article}/${photo}`);
        await fsp.rename(`content/articles/${article}/_${photo}`, `content/articles/${article}/${photo}`);
        await fsp.rename(`backup/${article}/_${photo}`, `backup/${article}/${photo}`);
      }
    }
  }
}

fun();
