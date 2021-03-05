const commentHandler = async (urlPost, page, postTextCb)=> {
    await page.goto(urlPost);
    await page.waitForSelector('textarea', { visible: true });

    const commentInput = await page.waitForSelector('textarea', { visible: true });
    const postBtn = await page.waitForSelector('button[type="submit"]', { visible: true });

    const post = await postTextCb();
    await commentInput.type(post, { delay: 100 });
    console.log(`Post made: ${post}`);
    await postBtn.click();
}

module.exports = commentHandler;