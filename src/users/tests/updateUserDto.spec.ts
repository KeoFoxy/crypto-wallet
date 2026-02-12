import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from '@/common/enums/role.enum';
import { UpdateUserDto } from '../dto/updateUserDto.dto';

describe('UpdateUserDto', () => {
  const findError = (errors: any[], prop: string) => errors.find((e) => e.property === prop);

  describe('Check if all fields is correct', () => {
    it('should pass validating if payload is empty (PartialType)', async () => {
      const dto = plainToInstance(UpdateUserDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('email', () => {
    it('invalid -> isEmail', async () => {
      const dto = plainToInstance(UpdateUserDto, { email: 'nope' });
      const errors = await validate(dto);

      const err = findError(errors, 'email');
      expect(err.constraints.isEmail).toBe('email must be an email');
    });
  });

  describe('login', () => {
    it('not string -> isString', async () => {
      const dto = plainToInstance(UpdateUserDto, { login: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'login');
      expect(err.constraints.isString).toBe('login must be a string');
    });
  });

  describe('password', () => {
    it('weak -> isStrongPassword', async () => {
      const dto = plainToInstance(UpdateUserDto, { password: '123' });
      const errors = await validate(dto);

      const err = findError(errors, 'password');
      expect(err.constraints.isStrongPassword).toBe('password is not strong enough');
    });
  });

  describe('age', () => {
    it('negative -> isPositive', async () => {
      const dto = plainToInstance(UpdateUserDto, { age: -1 });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isPositive).toContain('Age must be greater than zero!');
    });

    it('float -> isInt', async () => {
      const dto = plainToInstance(UpdateUserDto, { age: 1.5 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'age');
      expect(err.constraints.isInt).toBe('age must be an integer number');
    });
  });

  describe('description', () => {
    it('too long -> maxLength', async () => {
      const dto = plainToInstance(UpdateUserDto, { description: 'a'.repeat(1001) });
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.maxLength).toBe('description must be shorter than or equal to 1000 characters');
    });

    it('not string -> isString', async () => {
      const dto = plainToInstance(UpdateUserDto, { description: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'description');
      expect(err.constraints.isString).toBe('description must be a string');
    });
  });

  describe('role', () => {
    it('invalid enum -> isEnum', async () => {
      const dto = plainToInstance(UpdateUserDto, { role: 'HACKER' as any });
      const errors = await validate(dto);

      const err = findError(errors, 'role');
      expect(err.constraints.isEnum).toBe(
        `role must be one of the following values: ${Object.values(Role).join(', ')}`
      );
    });
  });
});
