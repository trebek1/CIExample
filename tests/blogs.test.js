const Page = require('./helpers/Page');

let page;

beforeEach(async () => {
	page = await Page.build();
	await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe("when logged in", async () => {
	beforeEach(async () => {
		await page.login();
		await page.click('a.btn-floating');
	});

	test('can see blog form ', async () => {
		const text = await page.getContentsOf('form label');
		expect(text).toEqual('Blog Title');
	});

	describe('and using valid inputs ', async () => {
		beforeEach(async () => {
			await page.type('.title input', 'my title');
			await page.type('.content input', 'my content');
			await page.click('form button');
		});
		test(' submitting takes user to review screen ', async () => {
			const text = await page.getContentsOf('h5');
			expect(text).toEqual('Please confirm your entries');
		});

		test('submitting and saving adds blog to index page', async () => {
			await page.click('button.green');
			await page.waitFor('.card');

			const title = await page.getContentsOf('.card-title');
			const content = await page.getContentsOf('p');

			expect(title).toEqual('my title');
			expect(content).toEqual('my content');
		});
	});

	describe('and using invalid inputs ', async () => {
		beforeEach(async () => {
			await page.click('form button');
		});
		test('the form shows an error message ', async () => {
			const error1 = await page.getContentsOf('.title .red-text');
			const error2 = await page.getContentsOf('.content .red-text');

			expect(error1).toEqual("You must provide a value");
			expect(error2).toEqual("You must provide a value");
		});
	});
});

describe('User is not logged in', async () => {
	const actions = [
		{
			method: 'get',
			path: 'api/blogs'
		},
		{
			method: 'post',
			path: '/api/blogs',
			data: {
				title: 'T',
				content: 'C'
			}
		}
	];

	test('Blog related actions are prohibited', async () => {
		const results = await page.execRequests(actions);
		for(let result of results){
			expect(result).toEqual({error: 'You must log in!'});
		}
	});


	// test.only('User cannot create blog posts ', async () => {
	// 	const result = await page.get('/api/blogs', { title: 'My Title', content: 'My C'});
	// 	expect(result).toEqual({error: 'You must log in!'});
	// });
	// test('user cannot get blogs', async () => {
	// 	const result = await page.get('/api/blogs');
	// 	console.log(result);
	// 	expect(result).toEqual({error: 'You must log in!'});
	// });
});


