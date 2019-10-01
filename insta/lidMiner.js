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

  const followersWindow = await _page.evaluate(async data => {

    console.log(' evaluate data =============>');
    console.log(data);
    const wind = document.querySelector(data.windSelector);

    console.log(` ========>>>>>>>> data._followData.followersCount = ${data._followData.followersCount}`);

    let i = 100// Number(data._followData.followersCount.replace(' ', '').replace(' ', ''))

    await new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 3000);
      });

    for(i; i>0; i-=1) {

      console.log(`i = ${i}`);
      wind.scrollTop += 383;

      await new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 100);
        });
      
    }


    //wind.scrollBy(0, wind.innerHeight);
    console.log( ` === wind.scrollTop ==== ${wind.scrollTop}`);
    console.log( ` === wind.offsetHeight ==== ${wind.offsetHeight}`);
    // wind.scrollTop = wind.offsetHeight;
    console.log(' ------------------------------------------- ');
    console.log( ` === wind.scrollTop ==== ${wind.scrollTop}`);
    console.log( ` === wind.offsetHeight ==== ${wind.offsetHeight}`);

    console.log('wind = ');
    console.log(wind);
    // const liArr = wind.querySelectorAll('li');
    // const liArr = wind.querySelectorAll('li');
    // console.log('liArr = ');
    // console.log(liArr);
    // console.log(' === liArr[0].offsetHeight =========== ');
    // console.log(liArr[0].height);

    // return liArr;
  }, {windSelector, _followData});

  const liSelector = '.PZuss';
  await _page.waitForSelector(windSelector);
  const liMiner = await _page.evaluate(liSelector => {
    const liCont = document.querySelector(liSelector);
    console.log('liCont======== ');
    console.log(liCont);
    const liArr = liCont.querySelectorAll('li');
    console.log('liArr ========== ');
    console.log(liArr);
  }, liSelector);

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
