
describe('Sample Test', () => {
  it('has a dummy spec to test 2 + 2', () => {
    // An intentionally failing test. No code within expect() will never equal 4.
    expect(3 + 3).toEqual(6);
  });
  it('should multiply two by 3', () => {
    expect(33 * 2).toEqual(66);
  });
});
