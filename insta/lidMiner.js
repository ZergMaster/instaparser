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

  const buttons = await page.$$('.L3NKy');
  console.log(` --> buttons.length = ${buttons.length}`);
  console.log(buttons);
}

module.exports = instaParser;
