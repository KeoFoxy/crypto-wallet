import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from '../dto/registerDto.dto';
import { AUTH_MOCK } from '../mocks/auth.mock';

describe('RegisterDto', () => {
  const valid = AUTH_MOCK.registerBody;
  const findError = (errors: any[], prop: string) => errors.find((e) => e.property === prop);

  describe('Check if all fields is correct', () => {
    it('should pass validating if all fields are correct', async () => {
      const dto = plainToInstance(RegisterDto, valid);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('email', () => {
    it('should throw if email is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.email;

      const dto = plainToInstance(RegisterDto, invalid);
      const errors = await validate(dto);
      expect(errors.length).not.toBe(0);

      const err = findError(errors, 'email');
      // при отсутствии email могут упасть и isEmail, и isNotEmpty — проверим isNotEmpty
      expect(err.constraints.isNotEmpty).toBe('email should not be empty');
    });

    it('should throw if email is empty', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, email: '' });
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isNotEmpty).toBe('email should not be empty');
    });

    it('should throw if email is invalid', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, email: 'not-email' });
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isEmail).toBe('email must be an email');
    });
  });

  describe('login', () => {
    it('should throw if login is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.login;

      const dto = plainToInstance(RegisterDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isNotEmpty).toBe('login should not be empty');
    });

    it('should throw if login is empty', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, login: '' });
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isNotEmpty).toBe('login should not be empty');
    });

    it('should throw if login is not a string', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, login: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isString).toBe('login must be a string');
    });
  });

  describe('password', () => {
    it('should throw if password is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.password;

      const dto = plainToInstance(RegisterDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'password');
      // чаще всего при undefined падает isStrongPassword
      expect(err.constraints.isStrongPassword).toBe('password is not strong enough');
    });

    it('should throw if password is weak', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, password: '123' });
      const errors = await validate(dto);

      const err = findError(errors, 'password');
      expect(err.constraints.isStrongPassword).toBe('password is not strong enough');
    });
  });

  describe('age', () => {
    it('should throw if age is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.age;

      const dto = plainToInstance(RegisterDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isInt).toBe('age must be an integer number');
    });

    it('should throw if age is not int', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, age: 1.2 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isInt).toBe('age must be an integer number');
    });

    it('should throw if age is not positive', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, age: 0 });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      // у тебя кастомное сообщение, может быть с пробелом в конце
      expect(err.constraints.isPositive).toContain('Age must be greater than zero!');
    });
  });

  describe('description', () => {
    it('should throw if description is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.description;

      const dto = plainToInstance(RegisterDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.isString).toBe('description must be a string');
    });

    it('should throw if description is not string', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, description: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.isString).toBe('description must be a string');
    });

    it('should throw if description too long', async () => {
      const dto = plainToInstance(RegisterDto, { ...valid, description: 'a'.repeat(1001) });
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.maxLength).toBe('description must be shorter than or equal to 1000 characters');
    });
  });
});
