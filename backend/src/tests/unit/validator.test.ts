import { validateCandidateData } from '../../application/validator';

describe('Validator Tests', () => {
  describe('validateCandidateData', () => {
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

    describe('Validación de nombres', () => {
      test('debería aceptar nombres válidos con acentos', () => {
        const data = { ...validCandidateData, firstName: 'José', lastName: 'García' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar nombres con números', () => {
        const data = { ...validCandidateData, firstName: 'Juan123' };
        expect(() => validateCandidateData(data)).toThrow('Invalid name');
      });

      test('debería rechazar nombres muy cortos', () => {
        const data = { ...validCandidateData, firstName: 'A' };
        expect(() => validateCandidateData(data)).toThrow('Invalid name');
      });

      test('debería rechazar nombres muy largos', () => {
        const data = { ...validCandidateData, firstName: 'A'.repeat(101) };
        expect(() => validateCandidateData(data)).toThrow('Invalid name');
      });

      test('debería rechazar nombres vacíos', () => {
        const data = { ...validCandidateData, firstName: '' };
        expect(() => validateCandidateData(data)).toThrow('Invalid name');
      });
    });

    describe('Validación de email', () => {
      test('debería aceptar emails válidos', () => {
        const data = { ...validCandidateData, email: 'test@example.com' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar emails sin @', () => {
        const data = { ...validCandidateData, email: 'testexample.com' };
        expect(() => validateCandidateData(data)).toThrow('Invalid email');
      });

      test('debería rechazar emails sin dominio', () => {
        const data = { ...validCandidateData, email: 'test@' };
        expect(() => validateCandidateData(data)).toThrow('Invalid email');
      });

      test('debería rechazar emails vacíos', () => {
        const data = { ...validCandidateData, email: '' };
        expect(() => validateCandidateData(data)).toThrow('Invalid email');
      });
    });

    describe('Validación de teléfono', () => {
      test('debería aceptar teléfonos españoles válidos', () => {
        const data = { ...validCandidateData, phone: '612345678' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería aceptar teléfonos que empiecen con 6, 7 o 9', () => {
        const validPhones = ['612345678', '712345678', '912345678'];
        validPhones.forEach(phone => {
          const data = { ...validCandidateData, phone };
          expect(() => validateCandidateData(data)).not.toThrow();
        });
      });

      test('debería rechazar teléfonos que no empiecen con 6, 7 o 9', () => {
        const data = { ...validCandidateData, phone: '812345678' };
        expect(() => validateCandidateData(data)).toThrow('Invalid phone');
      });

      test('debería rechazar teléfonos con menos de 9 dígitos', () => {
        const data = { ...validCandidateData, phone: '61234567' };
        expect(() => validateCandidateData(data)).toThrow('Invalid phone');
      });

      test('debería aceptar teléfono vacío (opcional)', () => {
        const data = { ...validCandidateData, phone: '' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    describe('Validación de dirección', () => {
      test('debería aceptar direcciones válidas', () => {
        const data = { ...validCandidateData, address: 'Calle Mayor 123, Madrid' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar direcciones muy largas', () => {
        const data = { ...validCandidateData, address: 'A'.repeat(101) };
        expect(() => validateCandidateData(data)).toThrow('Invalid address');
      });

      test('debería aceptar dirección vacía (opcional)', () => {
        const data = { ...validCandidateData, address: '' };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    describe('Validación de educación', () => {
      test('debería aceptar educación válida', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: '2022-06-30'
          }]
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar institución vacía', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: '',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid institution');
      });

      test('debería rechazar institución muy larga', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: 'A'.repeat(101),
            title: 'Ingeniería Informática',
            startDate: '2018-09-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid institution');
      });

      test('debería rechazar título vacío', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: 'Universidad Complutense',
            title: '',
            startDate: '2018-09-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid title');
      });

      test('debería rechazar fecha de inicio inválida', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: 'invalid-date'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid date');
      });

      test('debería rechazar fecha de fin inválida', () => {
        const data = {
          ...validCandidateData,
          educations: [{
            institution: 'Universidad Complutense',
            title: 'Ingeniería Informática',
            startDate: '2018-09-01',
            endDate: 'invalid-date'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid end date');
      });
    });

    describe('Validación de experiencia laboral', () => {
      test('debería aceptar experiencia laboral válida', () => {
        const data = {
          ...validCandidateData,
          workExperiences: [{
            company: 'TechCorp',
            position: 'Desarrollador Full Stack',
            description: 'Desarrollo de aplicaciones web',
            startDate: '2022-07-01',
            endDate: '2023-12-31'
          }]
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar empresa vacía', () => {
        const data = {
          ...validCandidateData,
          workExperiences: [{
            company: '',
            position: 'Desarrollador',
            startDate: '2022-07-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid company');
      });

      test('debería rechazar posición vacía', () => {
        const data = {
          ...validCandidateData,
          workExperiences: [{
            company: 'TechCorp',
            position: '',
            startDate: '2022-07-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid position');
      });

      test('debería rechazar descripción muy larga', () => {
        const data = {
          ...validCandidateData,
          workExperiences: [{
            company: 'TechCorp',
            position: 'Desarrollador',
            description: 'A'.repeat(201),
            startDate: '2022-07-01'
          }]
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid description');
      });
    });

    describe('Validación de CV', () => {
      test('debería aceptar CV válido', () => {
        const data = {
          ...validCandidateData,
          cv: {
            filePath: 'uploads/cv.pdf',
            fileType: 'application/pdf'
          }
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });

      test('debería rechazar CV sin filePath', () => {
        const data = {
          ...validCandidateData,
          cv: {
            fileType: 'application/pdf'
          }
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
      });

      test('debería rechazar CV sin fileType', () => {
        const data = {
          ...validCandidateData,
          cv: {
            filePath: 'uploads/cv.pdf'
          }
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
      });

      test('debería rechazar CV con filePath no string', () => {
        const data = {
          ...validCandidateData,
          cv: {
            filePath: 123,
            fileType: 'application/pdf'
          }
        };
        expect(() => validateCandidateData(data)).toThrow('Invalid CV data');
      });

      test('debería aceptar CV vacío', () => {
        const data = { ...validCandidateData, cv: {} };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });

    describe('Validación de candidato existente', () => {
      test('debería saltarse validaciones si el candidato ya existe (tiene ID)', () => {
        const data = {
          id: 1,
          firstName: 'Invalid Name 123',
          email: 'invalid-email',
          phone: 'invalid-phone'
        };
        expect(() => validateCandidateData(data)).not.toThrow();
      });
    });
  });
}); 