import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { PrismaClient } from '@prisma/client';

// Mock de Prisma
const mockPrisma = {
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
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

describe('Model Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Candidate Model', () => {
    const validCandidateData = {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      phone: '612345678',
      address: 'Calle Mayor 123, Madrid'
    };

    describe('Constructor', () => {
      test('debería crear una instancia de Candidate con datos válidos', () => {
        const candidate = new Candidate(validCandidateData);
        
        expect(candidate.firstName).toBe('Juan');
        expect(candidate.lastName).toBe('Pérez');
        expect(candidate.email).toBe('juan.perez@example.com');
        expect(candidate.phone).toBe('612345678');
        expect(candidate.address).toBe('Calle Mayor 123, Madrid');
        expect(candidate.education).toEqual([]);
        expect(candidate.workExperience).toEqual([]);
        expect(candidate.resumes).toEqual([]);
      });

      test('debería inicializar arrays vacíos si no se proporcionan', () => {
        const candidate = new Candidate(validCandidateData);
        
        expect(candidate.education).toEqual([]);
        expect(candidate.workExperience).toEqual([]);
        expect(candidate.resumes).toEqual([]);
      });

      test('debería manejar datos opcionales', () => {
        const dataWithoutOptionals = {
          firstName: 'Juan',
          lastName: 'Pérez',
          email: 'juan.perez@example.com'
        };
        
        const candidate = new Candidate(dataWithoutOptionals);
        
        expect(candidate.phone).toBeUndefined();
        expect(candidate.address).toBeUndefined();
      });
    });

    describe('save() - Crear nuevo candidato', () => {
      test('debería crear un nuevo candidato exitosamente', async () => {
        const mockCreatedCandidate = {
          id: 1,
          ...validCandidateData
        };
        
        mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);
        
        const candidate = new Candidate(validCandidateData);
        const result = await candidate.save();
        
        expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
          data: validCandidateData
        });
        expect(result).toEqual(mockCreatedCandidate);
      });

      test('debería crear candidato con educación', async () => {
        const candidateData = {
          ...validCandidateData,
          education: [{
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: new Date('2018-09-01'),
            endDate: new Date('2022-06-30')
          }]
        };
        
        const mockCreatedCandidate = { id: 1, ...validCandidateData };
        mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);
        
        const candidate = new Candidate(candidateData);
        await candidate.save();
        
        expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
          data: {
            ...validCandidateData,
            educations: {
              create: [{
                institution: 'Universidad Complutense',
                title: 'Ingeniería Informática',
                startDate: new Date('2018-09-01'),
                endDate: new Date('2022-06-30')
              }]
            }
          }
        });
      });

      test('debería crear candidato con experiencia laboral', async () => {
        const candidateData = {
          ...validCandidateData,
          workExperience: [{
            company: 'TechCorp',
            position: 'Desarrollador',
            description: 'Desarrollo web',
            startDate: new Date('2022-07-01'),
            endDate: new Date('2023-12-31')
          }]
        };
        
        const mockCreatedCandidate = { id: 1, ...validCandidateData };
        mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);
        
        const candidate = new Candidate(candidateData);
        await candidate.save();
        
        expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
          data: {
            ...validCandidateData,
            workExperiences: {
              create: [{
                company: 'TechCorp',
                position: 'Desarrollador',
                description: 'Desarrollo web',
                startDate: new Date('2022-07-01'),
                endDate: new Date('2023-12-31')
              }]
            }
          }
        });
      });

      test('debería crear candidato con CV', async () => {
        const candidateData = {
          ...validCandidateData,
          resumes: [{
            filePath: 'uploads/cv.pdf',
            fileType: 'application/pdf'
          }]
        };
        
        const mockCreatedCandidate = { id: 1, ...validCandidateData };
        mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);
        
        const candidate = new Candidate(candidateData);
        await candidate.save();
        
        expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
          data: {
            ...validCandidateData,
            resumes: {
              create: [{
                filePath: 'uploads/cv.pdf',
                fileType: 'application/pdf'
              }]
            }
          }
        });
      });

      test('debería manejar errores de conexión a BD', async () => {
        const connectionError = new Error('Connection failed');
        connectionError.name = 'PrismaClientInitializationError';
        
        mockPrisma.candidate.create.mockRejectedValue(connectionError);
        
        const candidate = new Candidate(validCandidateData);
        
        await expect(candidate.save()).rejects.toThrow(
          'No se pudo conectar con la base de datos. Por favor, asegúrese de que el servidor de base de datos esté en ejecución.'
        );
      });

      test('debería manejar otros errores de BD', async () => {
        const dbError = new Error('Database error');
        mockPrisma.candidate.create.mockRejectedValue(dbError);
        
        const candidate = new Candidate(validCandidateData);
        
        await expect(candidate.save()).rejects.toThrow('Database error');
      });
    });

    describe('save() - Actualizar candidato existente', () => {
      test('debería actualizar un candidato existente', async () => {
        const updateData = {
          id: 1,
          firstName: 'Juan Updated',
          lastName: 'Pérez Updated',
          email: 'juan.updated@example.com'
        };
        
        const mockUpdatedCandidate = { ...updateData };
        mockPrisma.candidate.update.mockResolvedValue(mockUpdatedCandidate);
        
        const candidate = new Candidate(updateData);
        const result = await candidate.save();
        
        expect(mockPrisma.candidate.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            firstName: 'Juan Updated',
            lastName: 'Pérez Updated',
            email: 'juan.updated@example.com'
          }
        });
        expect(result).toEqual(mockUpdatedCandidate);
      });

      test('debería manejar error cuando no se encuentra el candidato', async () => {
        const notFoundError = new Error('Record not found');
        notFoundError.code = 'P2025';
        
        mockPrisma.candidate.update.mockRejectedValue(notFoundError);
        
        const candidate = new Candidate({ id: 999, firstName: 'Juan' });
        
        await expect(candidate.save()).rejects.toThrow(
          'No se pudo encontrar el registro del candidato con el ID proporcionado.'
        );
      });
    });

    describe('findOne()', () => {
      test('debería encontrar un candidato por ID', async () => {
        const mockCandidate = { id: 1, ...validCandidateData };
        mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);
        
        const result = await Candidate.findOne(1);
        
        expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
          where: { id: 1 }
        });
        expect(result).toBeInstanceOf(Candidate);
        expect(result?.firstName).toBe('Juan');
      });

      test('debería retornar null si no se encuentra el candidato', async () => {
        mockPrisma.candidate.findUnique.mockResolvedValue(null);
        
        const result = await Candidate.findOne(999);
        
        expect(result).toBeNull();
      });
    });
  });

  describe('Education Model', () => {
    const validEducationData = {
      institution: 'Universidad Complutense',
      title: 'Ingeniería Informática',
      startDate: '2018-09-01',
      endDate: '2022-06-30',
      candidateId: 1
    };

    describe('Constructor', () => {
      test('debería crear una instancia de Education con datos válidos', () => {
        const education = new Education(validEducationData);
        
        expect(education.institution).toBe('Universidad Complutense');
        expect(education.title).toBe('Ingeniería Informática');
        expect(education.startDate).toEqual(new Date('2018-09-01'));
        expect(education.endDate).toEqual(new Date('2022-06-30'));
        expect(education.candidateId).toBe(1);
      });

      test('debería manejar endDate opcional', () => {
        const dataWithoutEndDate = { ...validEducationData };
        delete dataWithoutEndDate.endDate;
        
        const education = new Education(dataWithoutEndDate);
        
        expect(education.endDate).toBeUndefined();
      });
    });

    describe('save() - Crear nueva educación', () => {
      test('debería crear una nueva educación exitosamente', async () => {
        const mockCreatedEducation = {
          id: 1,
          ...validEducationData,
          startDate: new Date('2018-09-01'),
          endDate: new Date('2022-06-30')
        };
        
        mockPrisma.education.create.mockResolvedValue(mockCreatedEducation);
        
        const education = new Education(validEducationData);
        const result = await education.save();
        
        expect(mockPrisma.education.create).toHaveBeenCalledWith({
          data: {
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: new Date('2018-09-01'),
            endDate: new Date('2022-06-30'),
            candidateId: 1
          }
        });
        expect(result).toEqual(mockCreatedEducation);
      });
    });

    describe('save() - Actualizar educación existente', () => {
      test('debería actualizar una educación existente', async () => {
        const updateData = {
          id: 1,
          institution: 'Universidad Actualizada',
          title: 'Título Actualizado',
          startDate: '2019-09-01',
          endDate: '2023-06-30',
          candidateId: 1
        };
        
        const mockUpdatedEducation = { ...updateData };
        mockPrisma.education.update.mockResolvedValue(mockUpdatedEducation);
        
        const education = new Education(updateData);
        const result = await education.save();
        
        expect(mockPrisma.education.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            institution: 'Universidad Actualizada',
            title: 'Título Actualizado',
            startDate: new Date('2019-09-01'),
            endDate: new Date('2023-06-30'),
            candidateId: 1
          }
        });
        expect(result).toEqual(mockUpdatedEducation);
      });
    });
  });

  describe('WorkExperience Model', () => {
    const validWorkExperienceData = {
      company: 'TechCorp',
      position: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web',
      startDate: '2022-07-01',
      endDate: '2023-12-31',
      candidateId: 1
    };

    describe('Constructor', () => {
      test('debería crear una instancia de WorkExperience con datos válidos', () => {
        const workExperience = new WorkExperience(validWorkExperienceData);
        
        expect(workExperience.company).toBe('TechCorp');
        expect(workExperience.position).toBe('Desarrollador Full Stack');
        expect(workExperience.description).toBe('Desarrollo de aplicaciones web');
        expect(workExperience.startDate).toEqual(new Date('2022-07-01'));
        expect(workExperience.endDate).toEqual(new Date('2023-12-31'));
        expect(workExperience.candidateId).toBe(1);
      });

      test('debería manejar description opcional', () => {
        const dataWithoutDescription = { ...validWorkExperienceData };
        delete dataWithoutDescription.description;
        
        const workExperience = new WorkExperience(dataWithoutDescription);
        
        expect(workExperience.description).toBeUndefined();
      });
    });

    describe('save() - Crear nueva experiencia laboral', () => {
      test('debería crear una nueva experiencia laboral exitosamente', async () => {
        const mockCreatedWorkExperience = {
          id: 1,
          ...validWorkExperienceData,
          startDate: new Date('2022-07-01'),
          endDate: new Date('2023-12-31')
        };
        
        mockPrisma.workExperience.create.mockResolvedValue(mockCreatedWorkExperience);
        
        const workExperience = new WorkExperience(validWorkExperienceData);
        const result = await workExperience.save();
        
        expect(mockPrisma.workExperience.create).toHaveBeenCalledWith({
          data: {
            company: 'TechCorp',
            position: 'Desarrollador Full Stack',
            description: 'Desarrollo de aplicaciones web',
            startDate: new Date('2022-07-01'),
            endDate: new Date('2023-12-31'),
            candidateId: 1
          }
        });
        expect(result).toEqual(mockCreatedWorkExperience);
      });
    });
  });

  describe('Resume Model', () => {
    const validResumeData = {
      candidateId: 1,
      filePath: 'uploads/cv.pdf',
      fileType: 'application/pdf'
    };

    describe('Constructor', () => {
      test('debería crear una instancia de Resume con datos válidos', () => {
        const resume = new Resume(validResumeData);
        
        expect(resume.candidateId).toBe(1);
        expect(resume.filePath).toBe('uploads/cv.pdf');
        expect(resume.fileType).toBe('application/pdf');
        expect(resume.uploadDate).toBeInstanceOf(Date);
      });

      test('debería establecer uploadDate automáticamente', () => {
        const beforeCreation = new Date();
        const resume = new Resume(validResumeData);
        const afterCreation = new Date();
        
        expect(resume.uploadDate.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
        expect(resume.uploadDate.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
      });
    });

    describe('save() - Crear nuevo CV', () => {
      test('debería crear un nuevo CV exitosamente', async () => {
        const mockCreatedResume = {
          id: 1,
          ...validResumeData,
          uploadDate: new Date()
        };
        
        mockPrisma.resume.create.mockResolvedValue(mockCreatedResume);
        
        const resume = new Resume(validResumeData);
        const result = await resume.save();
        
        expect(mockPrisma.resume.create).toHaveBeenCalledWith({
          data: {
            candidateId: 1,
            filePath: 'uploads/cv.pdf',
            fileType: 'application/pdf',
            uploadDate: expect.any(Date)
          }
        });
        expect(result).toBeInstanceOf(Resume);
      });

      test('debería rechazar actualización de CV existente', async () => {
        const resume = new Resume({ id: 1, ...validResumeData });
        
        await expect(resume.save()).rejects.toThrow(
          'No se permite la actualización de un currículum existente.'
        );
      });
    });
  });
}); 