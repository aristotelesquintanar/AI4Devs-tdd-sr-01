import { Request, Response } from 'express';
import { addCandidateController } from '../../presentation/controllers/candidateController';

// Mock del servicio
jest.mock('../../application/services/candidateService', () => ({
  addCandidate: jest.fn()
}));

const { addCandidate } = require('../../application/services/candidateService');

describe('Candidate Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };
  });

  describe('addCandidateController', () => {
    const validCandidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Mayor 123, Madrid',
      educations: [
        {
          institution: 'Universidad Complutense',
          title: 'Ingeniería Informática',
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        }
      ],
      workExperiences: [
        {
          company: 'TechCorp',
          position: 'Desarrollador Full Stack',
          description: 'Desarrollo de aplicaciones web',
          startDate: '2022-07-01',
          endDate: '2023-12-31'
        }
      ],
      cv: {
        filePath: 'uploads/cv.pdf',
        fileType: 'application/pdf'
      }
    };

    test('debería crear un candidato exitosamente', async () => {
      const mockCreatedCandidate = {
        id: 1,
        ...validCandidateData
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = validCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar candidato sin relaciones', async () => {
      const simpleCandidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com'
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...simpleCandidateData
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = simpleCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(simpleCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar error de validación', async () => {
      const validationError = new Error('Invalid data');
      addCandidate.mockRejectedValue(validationError);
      mockRequest.body = validCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Invalid data'
      });
    });

    test('debería manejar error de email duplicado', async () => {
      const duplicateEmailError = new Error('The email already exists in the database');
      addCandidate.mockRejectedValue(duplicateEmailError);
      mockRequest.body = validCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'The email already exists in the database'
      });
    });

    test('debería manejar error de base de datos', async () => {
      const dbError = new Error('Database connection failed');
      addCandidate.mockRejectedValue(dbError);
      mockRequest.body = validCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Database connection failed'
      });
    });

    test('debería manejar error desconocido', async () => {
      const unknownError = 'Unknown error';
      addCandidate.mockRejectedValue(unknownError);
      mockRequest.body = validCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error adding candidate',
        error: 'Unknown error'
      });
    });

    test('debería manejar request body vacío', async () => {
      const mockCreatedCandidate = { id: 1 };
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = {};

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar candidato con solo datos básicos', async () => {
      const basicCandidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '612345678'
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...basicCandidateData
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = basicCandidateData;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(basicCandidateData);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar candidato con solo educación', async () => {
      const candidateWithEducation = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }
        ]
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...candidateWithEducation
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = candidateWithEducation;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(candidateWithEducation);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar candidato con solo experiencia laboral', async () => {
      const candidateWithExperience = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        workExperiences: [
          {
            company: 'TechCorp',
            position: 'Desarrollador Full Stack',
            description: 'Desarrollo de aplicaciones web',
            startDate: '2022-07-01',
            endDate: '2023-12-31'
          }
        ]
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...candidateWithExperience
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = candidateWithExperience;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(candidateWithExperience);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });

    test('debería manejar candidato con solo CV', async () => {
      const candidateWithCV = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        cv: {
          filePath: 'uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };
      
      const mockCreatedCandidate = {
        id: 1,
        ...candidateWithCV
      };
      
      addCandidate.mockResolvedValue(mockCreatedCandidate);
      mockRequest.body = candidateWithCV;

      await addCandidateController(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(addCandidate).toHaveBeenCalledWith(candidateWithCV);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Candidate added successfully',
        data: mockCreatedCandidate
      });
    });
  });
}); 