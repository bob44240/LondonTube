import { LondonPage } from './app.po';

describe('london App', () => {
  let page: LondonPage;

  beforeEach(() => {
    page = new LondonPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
