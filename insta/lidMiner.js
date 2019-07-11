const instaParser = async (page, account) => {
  await page.goto(`https://www.instagram.com/${account}`, {
    waitUntil: 'networkidle2'
  });

  const navigationPromise = page.waitForNavigation();

  await page.waitForSelector('.-nal3');

  console.log('try to find selector....');

  const nal = await page.$$('.-nal3');

  console.log(nal);

  const followersCount = nal[1].$('span').title;
  console.log(`followersCount ==== ${followersCount}`);

  const followedCount = nal[2].$('span').innerHtml;
  console.log(`followed to ==== ${followedCount}`);

  nal[1].click();
  await navigationPromise;
  console.log('hello, friends');
}

module.exports = instaParser;
