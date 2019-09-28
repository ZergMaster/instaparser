const LidRecorder = require('./LidRecorder');

let _lidRecorder;

let _page, _account;

class InstaParser {
  constructor(page, account) {
    _page = page;
    _account = account;

    _page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    _lidRecorder = new LidRecorder(_account);
  }

  async start() {
    console.log(`go to https://www.instagram.com/${_account}`);
    await _page.goto(`https://www.instagram.com/${_account}`);

    await _lidRecorder.init();

    await _getFollowersCount();
    await _openFollowersWindow();

    console.log(' -- hello, friends..');

    _startMining();
  }
}

const _startMining = () => {
  console.log(' - mining start....');
}

const _openFollowersWindow = async () => {
  const nal = await _page.$$('.-nal3');
  nal[1].click();

  // await _navigationPromise;
}

const _getFollowersCount = async () => {
  await _page.waitForSelector('.-nal3');

  const nalSelector = '.-nal3';
  await _page.waitForSelector(nalSelector);

  const followData = await _page.evaluate(nalSelector => {
    const nals = document.querySelectorAll(nalSelector);

    const followersCount = nals[1].querySelector('span').title;
    const followedCount = nals[2].querySelector('span').textContent;

    return { followersCount, followedCount };
  }, nalSelector);

  _lidRecorder.record(followData);
}

module.exports = InstaParser;
