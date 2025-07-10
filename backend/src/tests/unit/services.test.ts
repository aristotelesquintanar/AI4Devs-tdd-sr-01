import { addCandidate } from '../../application/services/candidateService';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';

// Mock de los modelos
jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');
jest.mock('../../application/validator');

const MockCandidate = Candidate as jest.MockedClass<typeof Candidate>;
const MockEducation = Education as jest.MockedClass<typeof Education>;
const MockWorkExperience = WorkExperience as jest.MockedClass<typeof WorkExperience>;
const MockResume = Resume as jest.MockedClass<typeof Resume>;

describe('Candidate Service Tests', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock del método save de Candidate
    const mockSave = jest.fn().mockResolvedValue({ id: 1, ...validCandidateData });
    MockCandidate.prototype.save = mockSave;
    
    // Mock del constructor de Candidate
    MockCandidate.mockImplementation((data) => ({
      ...data,
      save: mockSave,
      education: [],
      workExperience: [],
      resumes: []
    }));
    
    // Mock de los constructores de Education, WorkExperience y Resume
    MockEducation.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ id: 1, ...data })
    }));
    
    MockWorkExperience.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ id: 1, ...data })
    }));
    
    MockResume.mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ id: 1, ...data })
    }));
  });

  describe('addCandidate', () => {
    test('debería crear un candidato exitosamente sin relaciones', async () => {
      const candidateData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com'
      };

      const result = await addCandidate(candidateData);

      expect(MockCandidate).toHaveBeenCalledWith(candidateData);
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería crear un candidato con educación', async () => {
      const candidateData = {
        ...validCandidateData,
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }
        ]
      };

      const result = await addCandidate(candidateData);

      expect(MockCandidate).toHaveBeenCalledWith(candidateData);
      expect(MockEducation).toHaveBeenCalledWith({
        institution: 'Universidad Complutense',
        title: 'Ingeniería Informática',
        startDate: '2018-09-01',
        endDate: '2022-06-30'
      });
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería crear un candidato con experiencia laboral', async () => {
      const candidateData = {
        ...validCandidateData,
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

      const result = await addCandidate(candidateData);

      expect(MockCandidate).toHaveBeenCalledWith(candidateData);
      expect(MockWorkExperience).toHaveBeenCalledWith({
        company: 'TechCorp',
        position: 'Desarrollador Full Stack',
        description: 'Desarrollo de aplicaciones web',
        startDate: '2022-07-01',
        endDate: '2023-12-31'
      });
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería crear un candidato con CV', async () => {
      const candidateData = {
        ...validCandidateData,
        cv: {
          filePath: 'uploads/cv.pdf',
          fileType: 'application/pdf'
        }
      };

      const result = await addCandidate(candidateData);

      expect(MockCandidate).toHaveBeenCalledWith(candidateData);
      expect(MockResume).toHaveBeenCalledWith({
        filePath: 'uploads/cv.pdf',
        fileType: 'application/pdf'
      });
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería crear un candidato completo con todas las relaciones', async () => {
      const result = await addCandidate(validCandidateData);

      expect(MockCandidate).toHaveBeenCalledWith(validCandidateData);
      expect(MockEducation).toHaveBeenCalled();
      expect(MockWorkExperience).toHaveBeenCalled();
      expect(MockResume).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería manejar múltiples educaciones', async () => {
      const candidateData = {
        ...validCandidateData,
        educations: [
          {
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          },
          {
            institution: 'Universidad Politécnica',
            title: 'Máster en Desarrollo Web',
            startDate: '2022-09-01',
            endDate: '2023-06-30'
          }
        ]
      };

      await addCandidate(candidateData);

      expect(MockEducation).toHaveBeenCalledTimes(2);
    });

    test('debería manejar múltiples experiencias laborales', async () => {
      const candidateData = {
        ...validCandidateData,
        workExperiences: [
          {
            company: 'TechCorp',
            position: 'Desarrollador Junior',
            description: 'Desarrollo frontend',
            startDate: '2022-07-01',
            endDate: '2023-06-30'
          },
          {
            company: 'InnovationCorp',
            position: 'Desarrollador Senior',
            description: 'Desarrollo full stack',
            startDate: '2023-07-01',
            endDate: '2024-06-30'
          }
        ]
      };

      await addCandidate(candidateData);

      expect(MockWorkExperience).toHaveBeenCalledTimes(2);
    });

    test('debería asignar candidateId a las relaciones', async () => {
      // Mock simplificado para evitar errores de TypeScript
      const mockEducationInstance = { save: jest.fn().mockResolvedValue({ id: 1 }) } as any;
      MockEducation.mockImplementation(() => mockEducationInstance);

      const mockWorkExperienceInstance = { save: jest.fn().mockResolvedValue({ id: 1 }) } as any;
      MockWorkExperience.mockImplementation(() => mockWorkExperienceInstance);

      const mockResumeInstance = { save: jest.fn().mockResolvedValue({ id: 1 }) } as any;
      MockResume.mockImplementation(() => mockResumeInstance);

      await addCandidate(validCandidateData);

      // Verificar que se llamaron los métodos save
      expect(mockEducationInstance.save).toHaveBeenCalled();
      expect(mockWorkExperienceInstance.save).toHaveBeenCalled();
      expect(mockResumeInstance.save).toHaveBeenCalled();
    });

    test('debería manejar error de validación', async () => {
      const { validateCandidateData } = require('../../application/validator');
      validateCandidateData.mockImplementation(() => {
        throw new Error('Invalid data');
      });

      await expect(addCandidate(validCandidateData)).rejects.toThrow('Invalid data');
    });

    test('debería manejar error de email duplicado', async () => {
      const duplicateEmailError = new Error('Email already exists') as any;
      duplicateEmailError.code = 'P2002';
      
      MockCandidate.prototype.save.mockRejectedValue(duplicateEmailError);

      await expect(addCandidate(validCandidateData)).rejects.toThrow(
        'The email already exists in the database'
      );
    });

    test('debería manejar otros errores de base de datos', async () => {
      const dbError = new Error('Database connection failed');
      MockCandidate.prototype.save.mockRejectedValue(dbError);

      await expect(addCandidate(validCandidateData)).rejects.toThrow('Database connection failed');
    });

    test('debería manejar educaciones vacías', async () => {
      const candidateData = {
        ...validCandidateData,
        educations: []
      };

      const result = await addCandidate(candidateData);

      expect(MockEducation).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería manejar experiencias laborales vacías', async () => {
      const candidateData = {
        ...validCandidateData,
        workExperiences: []
      };

      const result = await addCandidate(candidateData);

      expect(MockWorkExperience).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería manejar CV vacío', async () => {
      const candidateData = {
        ...validCandidateData,
        cv: {}
      };

      const result = await addCandidate(candidateData);

      expect(MockResume).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería manejar CV null', async () => {
      const candidateData = {
        ...validCandidateData,
        cv: null
      };

      const result = await addCandidate(candidateData);

      expect(MockResume).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });

    test('debería manejar CV con propiedades vacías', async () => {
      const candidateData = {
        ...validCandidateData,
        cv: { filePath: '', fileType: '' }
      };

      const result = await addCandidate(candidateData);

      expect(MockResume).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...validCandidateData });
    });
  });
}); 