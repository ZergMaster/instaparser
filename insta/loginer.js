const screenshot = 'instagram.png';

Loginer = async (page, log, pass) => {
  this.page = page;
  this.login = log;
  this.pass = pass;

  const login = async () => {

    await this.page.goto("https://www.instagram.com/accounts/login/?source=auth_switcher", {
      waitUntil: 'networkidle2'
    });

    const navigationPromise = this.page.waitForNavigation();
    await this.page.waitForSelector("[name='username']");
    await this.page.click("[name='username']");
    await keyBoardWrite(this.login);
    // await page.type("[name='username']", process.env.INSTAGRAM_USER);

    //password
    await this.page.keyboard.down("Tab");
    //passwor to be visible
    // page.$eval("._2hvTZ.pexuQ.zyHYP[type='password']", (el) => el.setAttribute("type", "text"));
    await keyBoardWrite(this.pass);
    // await page.keyboard.type(process.env.INSTAGRAM_PWD);

    //the selector of the "Login" button
    // await page.click("._0mzm-.sqdOP.L3NKy>.Igw0E.IwRSH.eGOV_._4EzTm");

    await this.page.waitFor(500);

    await this.page.evaluate(() => {
      let btns = [...document.querySelector(".HmktE").querySelectorAll("button")];
      btns.forEach(function (btn) {
        if ((btn.innerText == "Log In") || (btn.innerText == "Войти"))
          btn.click();
      });
    });

    await navigationPromise;

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
    //check if the app asks for notifications
    try {
      await this.page.waitForSelector(".aOOlW.HoLwm", {
        timeout: 5000
      });
      await this.page.click(".aOOlW.HoLwm");
    } catch (err) {
      console.log(err);
    }

    await navigationPromise;

    await this.page.waitForSelector(".glyphsSpriteMobile_nav_type_logo");

    await this.page.screenshot({ path: screenshot });

    console.log('See screenshot: ' + screenshot)
  }

  const keyBoardWrite = async (value) => {
    await this.page.keyboard.type(value, { delay: (Math.random() * 100 + 50) });
  }

  await login();
}

module.exports = Loginer;
