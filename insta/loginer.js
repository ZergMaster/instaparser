const mkdirp = require('mkdirp');
const fs = require('fs');


Loginer = async (page, config) => {
  this.page = page;
  await this.page.goto("https://www.instagram.com");
  const cookiepathname = `/tmp/${config.login}`;

  await new Promise((resolve) => {
    fs.readFile(`.${cookiepathname}/data.json`, async (err, data) => {
      if(err) console.log(`read cookie ERROR: ${err}`);
      else {
        const cookiesArr = JSON.parse(data);
        if (cookiesArr.length !== 0) {
          for (let cookie of cookiesArr) {
            await page.setCookie(cookie);
          }
          console.log('***Session has been loaded in the browser');
        } else {
          console.log('! cookies doesnt exixst');
        }
      }
      resolve();
    });
  });

  const login = async () => {

    await this.page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher", {
      waitUntil: 'networkidle2'
    });

    const navigationPromise = this.page.waitForNavigation();
    
    try {
      await this.page.waitForSelector("[name='username']", {
        timeout: 5000
      });
      await doLogin();
    } catch (err) {
      console.log('You already logined from cookies!');
    }

    try {
      await this.page.waitForSelector(".aOOlW.HoLwm", {
        timeout: 5000
      });
      await Promise.all[this.page.click(".aOOlW.HoLwm"), navigationPromise];
    } catch (err) {
      await loginWithFaceBook();
    }

    await this.page.waitForSelector(".glyphsSpriteMobile_nav_type_logo");

    // const pathname = `./history/${config.login}`;
    // mkdirp(pathname, async (err) => {
    //   if (err) console.error(`Make dir ERROR: ${err}`)
    //   else await this.page.screenshot({ path: `${pathname}/${config.login}_${new Date().getTime()}.png` });
    // });

    // Save Session Cookies
    const cookiesObject = await this.page.cookies()
    mkdirp(`.${cookiepathname}`, async (err) => {
      if (err) console.error(`Make dir ERROR: ${err}`)
      else fs.writeFile(`.${cookiepathname}/data.json`, JSON.stringify(cookiesObject, null, '  '),
        (err) => {
          if (err) {
            console.log('The file could not be written.', err);
          }
          console.log(`Session has been successfully saved to ${cookiepathname}/data.json`);
        });
    });
  }

  const doLogin = async() => {
    await this.page.click("[name='username']");
    await keyBoardWrite(config.login);
    // await page.type("[name='username']", process.env.INSTAGRAM_USER);

    //password
    await this.page.keyboard.down("Tab");
    //passwor to be visible
    // page.$eval("._2hvTZ.pexuQ.zyHYP[type='password']", (el) => el.setAttribute("type", "text"));
    await keyBoardWrite(config.pass);
    // await page.keyboard.type(process.env.INSTAGRAM_PWD);

    await this.page.waitFor(500);

    await this.page.evaluate(() => {
      let btns = [...document.querySelector(".HmktE").querySelectorAll("button")];
      btns.forEach(async (btn) => {
        if ((btn.innerText == "Log In") || (btn.innerText == "Войти"))
          await Promise.all[btn.click(), navigationPromise];
      });
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
