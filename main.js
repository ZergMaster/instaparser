const puppeteer = require('puppeteer');
const Loginer = require('./insta/loginer');
const instaParser = require('./insta/lidMiner');

const targetAccount = 'vashloft'; //'loftdesigne';


(async () => {

  const config = require('./config.json');

  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage();

  await Loginer(page, config.instagram);

  console.log('login complete')

  // instaParser(page, targetAccount);

})();
