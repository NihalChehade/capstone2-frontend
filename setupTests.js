import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock setup file or before each test
jest.mock('./src/api', () => ({
    BASE_URL: 'mocked url'
  }));