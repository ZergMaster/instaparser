const instaParser = async (page, account) => {
  await page.goto(`https://www.instagram.com/${account}`, {
    waitUntil: 'networkidle2'
  });

  const navigationPromise = page.waitForNavigation();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.waitForSelector('.-nal3');

  const nalSelector = '.-nal3';
  await page.waitForSelector(nalSelector);

  const resp = await page.evaluate(nalSelector => {
    const nals = document.querySelectorAll(nalSelector);

    const followersCount = nals[1].querySelector('span').title;
    const followedCount = nals[2].querySelector('span').textContent;

    return { followersCount, followedCount };
  }, nalSelector);

  console.log(' ************** resp');
  console.log(await resp);

  const nal = await page.$$('.-nal3');
  nal[1].click();

  await navigationPromise;

  console.log('hello, friends');

  const buttons = await page.$$('.L3NKy');
  console.log(` --> buttons.length = ${buttons.length}`);
  console.log(buttons);
}

module.exports = instaParser;
