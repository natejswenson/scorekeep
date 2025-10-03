import appJson from '../../app.json';

describe('App Configuration for Web', () => {
  test('should have web configuration', () => {
    expect(appJson.expo.web).toBeDefined();
  });

  test('should have favicon configured', () => {
    expect(appJson.expo.web?.favicon).toBe('./assets/favicon.png');
  });

  test('should use metro bundler for web', () => {
    expect(appJson.expo.web?.bundler).toBe('metro');
  });

  test('native orientation should remain portrait', () => {
    // Native apps should stay portrait-only
    expect(appJson.expo.orientation).toBe('portrait');
  });
});
