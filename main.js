const puppeteer = require('puppeteer');
const Loginer = require('./insta/loginer');
const instaParser = require('./insta/lidMiner');

const _log = '****';
const _pass = '****';


(async () => {
  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage();

  await Loginer(page, _log, _pass);

  console.log('login complete')

  instaParser(page, 'loftdesigne');

})();
