import { Tv2Page } from './app.po';

describe('tv2 App', () => {
  let page: Tv2Page;

  beforeEach(() => {
    page = new Tv2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
