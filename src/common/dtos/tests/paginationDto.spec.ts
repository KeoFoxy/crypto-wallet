import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SortDirection } from '@/common/enums/sortDirection.enum';
import { PaginationDto } from '../paginationDto.dto';

describe('PaginationDto', () => {
  const findError = (errors: any[], prop: string) => errors.find((e) => e.property === prop);

  describe('Check if all fields is correct', () => {
    it('should pass validating if payload is empty (defaults)', async () => {
      const dto = plainToInstance(PaginationDto, {});
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(1000);
    });

    it('should pass validating with valid full payload', async () => {
      const dto = plainToInstance(PaginationDto, {
        search: 'user',
        page: 1,
        limit: 10,
        sortColumn: 'createdAt',
        sortDirection: SortDirection.Desc,
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('search', () => {
    it('should throw if search is not string', async () => {
      const dto = plainToInstance(PaginationDto, { search: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'search');
      expect(err.constraints.isString).toBe('search must be a string');
    });
  });

  describe('page', () => {
    it('should throw if page < 1', async () => {
      const dto = plainToInstance(PaginationDto, { page: 0 });
      const errors = await validate(dto);

      const err = findError(errors, 'page');
      expect(err.constraints.min).toBe('Page number must be greater than 0');
    });

    it('should transform "2" to number and pass', async () => {
      const dto = plainToInstance(PaginationDto, { page: '2' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
      expect(dto.page).toBe(2);
    });

    it('should throw if page is NaN after transform', async () => {
      const dto = plainToInstance(PaginationDto, { page: 'abc' });
      const errors = await validate(dto);

      const err = findError(errors, 'page');
      expect(err.constraints.isNumber).toBe('page must be a number conforming to the specified constraints');
    });
  });

  describe('limit', () => {
    it('should throw if limit < 1', async () => {
      const dto = plainToInstance(PaginationDto, { limit: 0 });
      const errors = await validate(dto);

      const err = findError(errors, 'limit');
      expect(err.constraints.min).toBe('Limit must be greater than 0');
    });

    it('should transform "10" to number and pass', async () => {
      const dto = plainToInstance(PaginationDto, { limit: '10' });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
      expect(dto.limit).toBe(10);
    });

    it('should throw if limit is NaN after transform', async () => {
      const dto = plainToInstance(PaginationDto, { limit: 'abc' });
      const errors = await validate(dto);

      const err = findError(errors, 'limit');
      expect(err.constraints.isNumber).toBe('limit must be a number conforming to the specified constraints');
    });
  });

  describe('sortColumn', () => {
    it('should throw if sortColumn is not string', async () => {
      const dto = plainToInstance(PaginationDto, { sortColumn: 123 as any });
      const errors = await validate(dto);

      const err = findError(errors, 'sortColumn');
      expect(err.constraints.isString).toBe('sortColumn must be a string');
    });
  });

  describe('sortDirection', () => {
    it('should throw if sortDirection is not enum', async () => {
      const dto = plainToInstance(PaginationDto, { sortDirection: 'DOWN' as any });
      const errors = await validate(dto);

      const err = findError(errors, 'sortDirection');
      // у тебя кастомное сообщение
      expect(err.constraints.isEnum).toBe('Sort direction must be either asc or desc');
    });

    it('should pass if sortDirection is valid', async () => {
      const dto = plainToInstance(PaginationDto, { sortDirection: SortDirection.Asc });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
