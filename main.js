const puppeteer = require('puppeteer');
const Loginer = require('./insta/loginer');
const InstaLidMiner = require('./insta/lidMiner');

const targetAccount = 'vashloft'; //'loftdesigne';


(async () => {

  const config = require('./configs/viktorkroft.config.json');
  // const config = require('./configs/vsevolodushka_leonov.config.json');


  //...........
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,

  })

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));

  await Loginer(page, config.instagram);

  console.log('-------------------------------> login complete')

  new InstaLidMiner(page, targetAccount);

})();
