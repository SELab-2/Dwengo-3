import { render } from '@testing-library/react';
import { describe, test, vi } from 'vitest';
import 'vitest-dom/extend-expect';
import LoginForm from '../../../client/src/components/LoginForm.tsx';
import React from 'react';

// Auth mock
const mockUseAuth = vi.hoisted(() => {
  return {
    useAuth: vi.fn(),
    useRegister: vi.fn(),
    useLogin: vi.fn(),
    useLogOut: vi.fn(),
  };
});
vi.mock('../../client/src/hooks/useAuth.ts', () => {
  return mockUseAuth;
});

// Tests
describe('LoginForm component test', () => {
  test('render test', () => {
    render(<LoginForm />);
  });
});
