const LidRecorder = require('./LidRecorder');

let _lidRecorder;

let _page, _account;

let _followData;

class InstaParser {
  // static _followData = {};

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

const _startMining = async () => {
  console.log(' - mining start....');

  const windSelector = '.isgrP';
  await _page.waitForSelector(windSelector);

  const liSelector = '.PZuss';
  await _page.waitForSelector(liSelector);

  const followersWindow = await _page.evaluate(async data => {

    console.log(' evaluate data =============>');
    console.log(data);
    console.log(document);
    const wind = document.querySelector(data.windSelector);
    const liCont = document.querySelector('.PZuss');

    console.log(` ========>>>>>>>> data._followData.followersCount = ${data._followData.followersCount}`);

    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 3000);
    });

    let i = 10// Number(data._followData.followersCount.replace(' ', '').replace(' ', ''))

    for (i; i > 0; i -= 1) {
      console.log(`i = ${i}`);
      wind.scrollTop += 383;

      await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 100);
      });
    }

    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 1000);
    });

    i = Number(data._followData.followersCount.split(' ').join(''));
    for (i; i > 0; i -= 1) {
      console.log(`i = ${i}`);
      wind.scrollTop += 383;

      await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 10);
      });
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(liCont);
    const liArr = liCont.querySelectorAll('li');
    console.log('liArr ========== ');
    console.log(liArr);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

  }, { windSelector, _followData });

  console.log('followersWindow ===========> ');
  console.log(followersWindow);

  console.log('liMiner === ');
  console.log(liMiner);
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

  _followData = await _page.evaluate(nalSelector => {
    const nals = document.querySelectorAll(nalSelector);

    const followersCount = nals[1].querySelector('span').title;
    const followedCount = nals[2].querySelector('span').textContent;

    return { followersCount, followedCount };
  }, nalSelector);

  _lidRecorder.record(_followData);
}

module.exports = InstaParser;
