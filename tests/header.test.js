const Page = require('./helpers/page');

let page;

beforeEach(async(done)=>{
    page = await Page.build();
    await page.goto('http://localhost:3000');
    done();
});
afterEach(async(done)=>{
    await page.close();
    done();
});

test('check header has correct text', async(done)=>{
    // const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
    done();
});

test('check clicking login starts 0auth flow', async(done)=>{
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/);
    done();
   
});

test('when logged in , shows logout button', async(done)=>{
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
    done();
})