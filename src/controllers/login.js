const loginHandler = async (page, username, password) => {
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForSelector('input[name="username"]', { visible: true });

    const usernameInput = await page.$('input[name="username"]');
    const passwordInput = await page.$('input[name="password"]');
    const signInBtn = await page.$("form button");

    await usernameInput.type(username, { delay: 100 });
    await passwordInput.type(password, { delay: 100 });
    await signInBtn.click();

    await page.waitForTimeout(5000);
    await page.waitForSelector('img[alt="Instagram"]', { visible: true });

    //Click IG LOGO to avoid messages
    const instagramLogo = await page.$('img[alt="Instagram"]');
    await instagramLogo.click();

    //Click Not Now notifications popup
    await page.waitForSelector('div[role="dialog"]', { visible: true });
    const notNowBtn = await page.$('div[role="dialog"] button:nth-child(2)');
    await notNowBtn.click();
}

module.exports = loginHandler;