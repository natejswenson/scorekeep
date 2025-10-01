/* eslint-disable no-undef */
import '@testing-library/react-native/extend-expect';

// Mock useWindowDimensions to default to landscape (800x600)
// This keeps existing tests working. Individual tests can override this mock.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 800, height: 600 })),
}));