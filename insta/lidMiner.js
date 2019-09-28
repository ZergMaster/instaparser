const LidRecorder = require('./LidRecorder');

let _lidRecorder;

class InstaParser {

  constructor(page, account) {
    this._page = page;
    this._account = account;

    this._page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    this.init();

    _lidRecorder = new LidRecorder(account);
  }

  async init() {
    console.log(`go to https://www.instagram.com/${this._account}`);
    await this._page.goto(`https://www.instagram.com/${this._account}`);

    await _lidRecorder.init();

    await this.getFollowersCount();
    await this.openFollowersWindow();

    console.log('hello, friends');
  }

  async openFollowersWindow() {
    const nal = await this._page.$$('.-nal3');
    nal[1].click();

    // await _navigationPromise;
  }

  async getFollowersCount() {
    await this._page.waitForSelector('.-nal3');

    const nalSelector = '.-nal3';
    await this._page.waitForSelector(nalSelector);

    const followData = await this._page.evaluate(nalSelector => {
      const nals = document.querySelectorAll(nalSelector);

      const followersCount = nals[1].querySelector('span').title;
      const followedCount = nals[2].querySelector('span').textContent;

      return { followersCount, followedCount };
    }, nalSelector);

    _lidRecorder.record(followData);
  }
}

//   const nal = await page.$$('.-nal3');
//   nal[1].click();

//   await navigationPromise;

//   console.log('hello, friends');

module.exports = InstaParser;
