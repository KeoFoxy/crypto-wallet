import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RefreshDto } from '../dto/refreshDto.dto';
import { AUTH_MOCK } from '../mocks/auth.mock';

describe('RefreshDto', () => {
  const valid = AUTH_MOCK.refreshBody;

  const findError = (errors: any[], prop: string) => errors.find((e) => e.property === prop);

  describe('Check if all fields is correct', () => {
    it('should pass validating if all fields are correct', async () => {
      const dto = plainToInstance(RefreshDto, valid);
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('refresh_token', () => {
    it('should throw an error if refresh_token is missing', async () => {
      const invalid: any = { ...valid };
      delete invalid.refresh_token;

      const dto = plainToInstance(RefreshDto, invalid);
      const errors = await validate(dto);

      expect(errors.length).not.toBe(0);

      const err = findError(errors, 'refresh_token');
      expect(err).toBeDefined();
      expect(err.constraints.isNotEmpty).toBe('refresh_token should not be empty');
    });

    it('should throw an error if refresh_token is empty string', async () => {
      const invalid: any = { ...valid, refresh_token: '' };

      const dto = plainToInstance(RefreshDto, invalid);
      const errors = await validate(dto);

      expect(errors.length).not.toBe(0);

      const err = findError(errors, 'refresh_token');
      expect(err.constraints.isNotEmpty).toBe('refresh_token should not be empty');
    });

    it('should throw an error if refresh_token is not string', async () => {
      const invalid: any = { ...valid, refresh_token: 123 };

      const dto = plainToInstance(RefreshDto, invalid);
      const errors = await validate(dto);

      expect(errors.length).not.toBe(0);

      const err = findError(errors, 'refresh_token');
      expect(err.constraints.isString).toBe('refresh_token must be a string');
    });
  });
});
