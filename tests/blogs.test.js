const Page = require('./helpers/page');
let page;

beforeEach(async (done)=>{
    page = await Page.build();
    await page.goto('http://localhost:3000');
    done();
});
afterEach(async (done)=>{
    await page.close();
    done();
});

describe('when logged in', async()=>{
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });
    test('can how blog create form', async()=>{
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });
    describe('And using valid inputs', async () =>{
        beforeEach(async()=>{
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My blog content');
            await page.click('form button');

        })
        test('Submitting redirects user to review page', async()=>{
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });
        test('Submitting then saving adds blog to index page', async()=>{
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('My Title');
            expect(content).toEqual('My blog content');

        })
    });
    describe('And using invalid inputs', async()=>{
        beforeEach(async ()=>{
            await page.click('form button');
        });
        test('the form shows an error message', async()=>{
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');
            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value')
        })
    })
});

describe('User is not logged in ', async ()=>{
    test('user cannot create blog posts', async ()=>{
        const result = await page.post('/api/blogs', {
            title:'My title',
            content:'My content'
        });
        expect(result).toEqual({ error: 'You must log in!' });
    });

    test('user cannot get list of blogs', async ()=>{
        const result = await page.get('/api/blogs');
        expect(result).toEqual({ error: 'You must log in!' });
    });
});