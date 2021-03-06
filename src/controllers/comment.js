const commentHandler = async (urlPost, page, post)=> {
    //await page.goto(urlPost);
    await page.waitForSelector('textarea', { visible: true });

    const commentInput = await page.waitForSelector('textarea', { visible: true });
    const postBtn = await page.waitForSelector('button[type="submit"]', { visible: true });

    await commentInput.type(post, { delay: 100 });
    console.log(`Post made: ${post}`);
    await postBtn.click();
}

module.exports = commentHandler;