import { theme, palette } from '../index';

describe('Theme Configuration', () => {
  it('should export a valid MUI theme object', () => {
    expect(theme).toBeDefined();
    expect(theme.palette).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.breakpoints).toBeDefined();
  });

  it('should contain team1 palette with main/light/dark', () => {
    expect(palette.team1).toBeDefined();
    expect(palette.team1.main).toBe('#FF0000');
    expect(palette.team1.light).toBe('rgba(255, 0, 0, 0.2)');
    expect(palette.team1.dark).toBe('#CC0000');
  });

  it('should contain team2 palette with main/light/dark', () => {
    expect(palette.team2).toBeDefined();
    expect(palette.team2.main).toBe('#0000FF');
    expect(palette.team2.light).toBe('rgba(0, 0, 255, 0.2)');
    expect(palette.team2.dark).toBe('#0000CC');
  });

  it('should contain neutral palette', () => {
    expect(palette.neutral).toBeDefined();
    expect(palette.neutral.white).toBe('#FFFFFF');
    expect(palette.neutral.overlay).toBe('rgba(255, 255, 255, 0.95)');
    expect(palette.neutral.dark).toBe('#333333');
  });

  it('should define typography variants for score', () => {
    expect(theme.typography.score).toBeDefined();
    expect(theme.typography.score).toMatchObject({
      fontSize: '240px',
      fontWeight: 900,
      color: '#FFFFFF',
    });
  });

  it('should define breakpoints for mobile/desktop', () => {
    expect(theme.breakpoints.values).toBeDefined();
    expect(theme.breakpoints.values.xs).toBe(0);
    expect(theme.breakpoints.values.sm).toBe(600);
    expect(theme.breakpoints.values.md).toBe(900);
  });

  it('should have primary color matching team1', () => {
    expect(theme.palette.primary.main).toBe(palette.team1.main);
  });

  it('should have secondary color matching team2', () => {
    expect(theme.palette.secondary.main).toBe(palette.team2.main);
  });

  it('should define custom typography variants', () => {
    expect(theme.typography.gamesText).toBeDefined();
    expect(theme.typography.gamesLabel).toBeDefined();
    expect(theme.typography.tallyText).toBeDefined();
    expect(theme.typography.controlText).toBeDefined();
    expect(theme.typography.resetIcon).toBeDefined();
  });
});
