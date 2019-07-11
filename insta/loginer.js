const mkdirp = require('mkdirp');
const jsonfile = require('jsonfile');


Loginer = async (page, config) => {
  this.page = page;

  const cookiepathname = `/tmp/${config.login}`;
  try {
    // If file exist load the cookies
    const cookiesArr = require(`.${cookiepathname}/data.json`)
    if (cookiesArr.length !== 0) {
      for (let cookie of cookiesArr) {
        await page.setCookie(cookie)
      }
      console.log('Session has been loaded in the browser')
      return true
    }
  } catch (e) {
    console.log('cookies doesnt exixst');
  }

  const login = async () => {

    await this.page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher", {
      waitUntil: 'networkidle2'
    });

    const navigationPromise = this.page.waitForNavigation();
    await this.page.waitForSelector("[name='username']");
    await this.page.click("[name='username']");
    await keyBoardWrite(config.login);
    // await page.type("[name='username']", process.env.INSTAGRAM_USER);

    //password
    await this.page.keyboard.down("Tab");
    //passwor to be visible
    // page.$eval("._2hvTZ.pexuQ.zyHYP[type='password']", (el) => el.setAttribute("type", "text"));
    await keyBoardWrite(config.pass);
    // await page.keyboard.type(process.env.INSTAGRAM_PWD);

    //the selector of the "Login" button
    // await page.click("._0mzm-.sqdOP.L3NKy>.Igw0E.IwRSH.eGOV_._4EzTm");

    await this.page.waitFor(500);

    await this.page.evaluate(() => {
      let btns = [...document.querySelector(".HmktE").querySelectorAll("button")];
      btns.forEach(async (btn) => {
        if ((btn.innerText == "Log In") || (btn.innerText == "Войти"))
          await Promise.all[btn.click(), navigationPromise];
      });
    });

    //Optional
    //check if the element asking to download the app arises
    // try {
    // 	await loginPage.waitForSelector("._3m3RQ._7XMpj",{
    // 		timeout:3000
    // 	});
    // 	await loginPage.click("._3m3RQ._7XMpj");
    // } catch (err) {

    // }

    //Optional


    // Save Session Cookies

    const cookiesObject = await this.page.cookies()
    mkdirp(`.${cookiepathname}`, async (err) => {
      if (err) console.error(`Make dir ERROR: ${err}`)
      else jsonfile.writeFile(`${cookiepathname}/data.json`, cookiesObject, { spaces: 2 },
        (err) => {
          if (err) {
            console.log('The file could not be written.', err);
          }
          console.log(`Session has been successfully saved to ${cookiepathname}/data.json`);
        });
    });
    // Write cookies to temp file to be used in other profile pages

    //check if the app asks for notifications
    try {
      await this.page.waitForSelector(".aOOlW.HoLwm", {
        timeout: 5000
      });
      await Promise.all[this.page.click(".aOOlW.HoLwm"), navigationPromise];
    } catch (err) {
      await loginWithFaceBook();
    }

    await this.page.waitForSelector(".glyphsSpriteMobile_nav_type_logo");

    const pathname = `./history/${config.login}`;
    mkdirp(pathname, async (err) => {
      if (err) console.error(`Make dir ERROR: ${err}`)
      else await this.page.screenshot({ path: `${pathname}/${config.login}_${new Date().getTime()}.png` });
    });
  }

  const loginWithFaceBook = async () => {
    console.log('...try to login with facebook');
    await this.page.evaluate(() => {
      const btns = [...document.querySelector(".XFYOY").querySelectorAll("button")];
      btns.forEach(async (btn) => {
        console.log(`btn.innerText.includes("Facebook") === ${btn.innerText.includes("Facebook")}`);
        if (btn.innerText.includes("Facebook")) {
          await Promise.all[btn.click(), navigationPromise];
        }
      });
    });


    await this.page.waitForSelector("[name='email']");
    await this.page.click("[name='email']");
    await keyBoardWrite(config.fblogin);
    await this.page.keyboard.down("Tab");
    await keyBoardWrite(config.fbpass);

    await this.page.evaluate(() => {
      let btns = [...document.querySelector(".XFYOY").querySelectorAll("button")];
      btns.forEach(async (btn) => {
        if ((btn.innerText == "Log In") || (btn.innerText == "Войти"))
          await Promise.all[btn.click(), navigationPromise];
      });
    });

    // await this.page.waitForSelector(".aOOlW.HoLwm", {
    //   timeout: 5000
    // });
    // await this.page.click(".aOOlW.HoLwm");
  }

  const keyBoardWrite = async (value) => {
    await this.page.keyboard.type(value, { delay: (Math.random() * 100 + 50) });
  }

  await login();
}

module.exports = Loginer;
