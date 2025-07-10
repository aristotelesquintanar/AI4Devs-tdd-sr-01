import { PrismaClient } from '@prisma/client';

// Mock de Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
    workExperience: {
      create: jest.fn(),
      update: jest.fn(),
    },
    resume: {
      create: jest.fn(),
    },
  })),
}));

// Configuración global para tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
}); 