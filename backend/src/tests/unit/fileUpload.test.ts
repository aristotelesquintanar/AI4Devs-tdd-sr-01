import { Request, Response } from 'express';
import multer from 'multer';
import { uploadFile } from '../../application/services/fileUploadService';

// Mock de multer
jest.mock('multer', () => {
  const mockMulter = {
    diskStorage: jest.fn(),
    single: jest.fn()
  };
  return jest.fn(() => mockMulter);
});

describe('File Upload Service Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockMulterSingle: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnThis();
    mockMulterSingle = jest.fn();
    
    mockRequest = {
      file: undefined
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    // Mock de multer.single
    (multer as jest.MockedFunction<typeof multer>).mockReturnValue({
      single: mockMulterSingle
    } as any);
  });

  describe('uploadFile', () => {
    test('debería subir un archivo PDF exitosamente', () => {
      const mockFile = {
        path: 'uploads/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      } as any;
      
      mockRequest.file = mockFile;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        filePath: 'uploads/1234567890-cv.pdf',
        fileType: 'application/pdf'
      });
    });

    test('debería subir un archivo DOCX exitosamente', () => {
      const mockFile = {
        path: 'uploads/1234567890-cv.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        originalname: 'cv.docx'
      } as any;
      
      mockRequest.file = mockFile;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        filePath: 'uploads/1234567890-cv.docx',
        fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    });

    test('debería rechazar archivo sin tipo válido', () => {
      mockRequest.file = undefined;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Invalid file type, only PDF and DOCX are allowed!'
      });
    });

    test('debería manejar error de Multer (LIMIT_FILE_SIZE)', () => {
      const multerError = new Error('File too large') as any;
      multerError.code = 'LIMIT_FILE_SIZE';
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(multerError, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'File too large'
      });
    });

    test('debería manejar error de Multer (LIMIT_FILE_COUNT)', () => {
      const multerError = new Error('Too many files') as any;
      multerError.code = 'LIMIT_FILE_COUNT';
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(multerError, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Too many files'
      });
    });

    test('debería manejar error de Multer (LIMIT_UNEXPECTED_FILE)', () => {
      const multerError = new Error('Unexpected field') as any;
      multerError.code = 'LIMIT_UNEXPECTED_FILE';
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(multerError, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Unexpected field'
      });
    });

    test('debería manejar otros errores de Multer', () => {
      const multerError = new Error('Unknown multer error') as any;
      multerError.code = 'UNKNOWN_ERROR';
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(multerError, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Unknown multer error'
      });
    });

    test('debería manejar errores generales', () => {
      const generalError = new Error('General error');
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(generalError, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'General error'
      });
    });

    test('debería manejar archivo con ruta personalizada', () => {
      const mockFile = {
        path: 'uploads/custom-folder/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      } as any;
      
      mockRequest.file = mockFile;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        filePath: 'uploads/custom-folder/1234567890-cv.pdf',
        fileType: 'application/pdf'
      });
    });

    test('debería manejar archivo con nombre original complejo', () => {
      const mockFile = {
        path: 'uploads/1234567890-Mi_CV_Completo_2024.pdf',
        mimetype: 'application/pdf',
        originalname: 'Mi_CV_Completo_2024.pdf'
      } as any;
      
      mockRequest.file = mockFile;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        filePath: 'uploads/1234567890-Mi_CV_Completo_2024.pdf',
        fileType: 'application/pdf'
      });
    });

    test('debería verificar que multer.single se llama con el campo correcto', () => {
      mockRequest.file = {
        path: 'uploads/1234567890-cv.pdf',
        mimetype: 'application/pdf',
        originalname: 'cv.pdf'
      } as any;
      
      mockMulterSingle.mockImplementation((fieldName, callback) => {
        expect(fieldName).toBe('file');
        callback(null, mockRequest, mockResponse);
      });

      uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockMulterSingle).toHaveBeenCalledWith('file', expect.any(Function));
    });
  });
}); 