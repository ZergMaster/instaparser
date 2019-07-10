const instaParser = async (page, account) => {
  await page.goto(`https://www.instagram.com/${account}`, {
    waitUntil: 'networkidle2'
  });
}

module.exports = instaParser;
