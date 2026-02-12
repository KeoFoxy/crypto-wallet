import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from '@/common/enums/role.enum';
import { CreateUserDto } from '../dto/createUserDto.dto';
import { USERS_MOCK } from '../mocks/users.mock';

describe('CreateUserDto', () => {
  const valid = USERS_MOCK.dtos.create;
  const findError = (errors: any[], prop: string) => errors.find((e) => e.property === prop);

  describe('Check if all fields is correct', () => {
    it('should pass validating if all fields are correct', async () => {
      const dto = plainToInstance(CreateUserDto, valid);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('email', () => {
    it('missing -> isNotEmpty', async () => {
      const invalid: any = { ...valid };
      delete invalid.email;

      const dto = plainToInstance(CreateUserDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isNotEmpty).toBe('email should not be empty');
    });

    it('empty -> isNotEmpty', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, email: '' });
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isNotEmpty).toBe('email should not be empty');
    });

    it('invalid -> isEmail', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, email: 'nope' });
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isEmail).toBe('email must be an email');
    });
  });

  describe('login', () => {
    it('missing -> isNotEmpty', async () => {
      const invalid: any = { ...valid };
      delete invalid.login;

      const dto = plainToInstance(CreateUserDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isNotEmpty).toBe('login should not be empty');
    });

    it('empty -> isNotEmpty', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, login: '' });
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isNotEmpty).toBe('login should not be empty');
    });

    it('not string -> isString', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, login: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isString).toBe('login must be a string');
    });
  });

  describe('password', () => {
    it('missing -> isStrongPassword', async () => {
      const invalid: any = { ...valid };
      delete invalid.password;

      const dto = plainToInstance(CreateUserDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'password');
      expect(err.constraints.isStrongPassword).toBe('password is not strong enough');
    });

    it('weak -> isStrongPassword', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, password: '123' });
      const errors = await validate(dto);

      const err = findError(errors, 'password');
      expect(err.constraints.isStrongPassword).toBe('password is not strong enough');
    });
  });

  describe('age', () => {
    it('missing -> isInt', async () => {
      const invalid: any = { ...valid };
      delete invalid.age;

      const dto = plainToInstance(CreateUserDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isInt).toBe('age must be an integer number');
    });

    it('float -> isInt', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, age: 1.5 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isInt).toBe('age must be an integer number');
    });

    it('0 -> isPositive', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, age: 0 });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isPositive).toContain('Age must be greater than zero!');
    });
  });

  describe('description', () => {
    it('missing -> isString', async () => {
      const invalid: any = { ...valid };
      delete invalid.description;

      const dto = plainToInstance(CreateUserDto, invalid);
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.isString).toBe('description must be a string');
    });

    it('too long -> maxLength', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, description: 'a'.repeat(1001) });
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.maxLength).toBe('description must be shorter than or equal to 1000 characters');
    });
  });

  describe('role', () => {
    it('missing -> should pass (optional)', async () => {
      const payload: any = { ...valid };
      delete payload.role;

      const dto = plainToInstance(CreateUserDto, payload);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('invalid enum -> isEnum', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, role: 'HACKER' as any });
      const errors = await validate(dto);

      const err = findError(errors, 'role');
      expect(err.constraints.isEnum).toBe(
        `role must be one of the following values: ${Object.values(Role).join(', ')}`
      );
    });

    it('valid enum -> should pass', async () => {
      const dto = plainToInstance(CreateUserDto, { ...valid, role: Role.User });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
