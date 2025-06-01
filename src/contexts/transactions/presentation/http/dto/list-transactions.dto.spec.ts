import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ListTransactionsDto } from './list-transactions.dto';

describe('ListTransactionsDto', () => {
  it('should pass validation with default values', async () => {
    const dto = plainToInstance(ListTransactionsDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when page is less than 1', async () => {
    const dto = plainToInstance(ListTransactionsDto, { page: 0 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'page')).toBe(true);
  });

  it('should fail when limit is greater than 50', async () => {
    const dto = plainToInstance(ListTransactionsDto, { limit: 100 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });

  it('should fail when limit is less than 1', async () => {
    const dto = plainToInstance(ListTransactionsDto, { limit: 0 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'limit')).toBe(true);
  });

  it('should pass when type is a valid enum value', async () => {
    const dto = plainToInstance(ListTransactionsDto, { type: 'income' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when type is invalid', async () => {
    const dto = plainToInstance(ListTransactionsDto, { type: 'invalid' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'type')).toBe(true);
  });

  it('should fail when order is invalid', async () => {
    const dto = plainToInstance(ListTransactionsDto, { order: 'up' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'order')).toBe(true);
  });

  it('should pass when startDate and endDate are valid and endDate >= startDate', async () => {
    const dto = plainToInstance(ListTransactionsDto, {
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2025-12-31T23:59:59.999Z',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when endDate is before startDate', async () => {
    const dto = plainToInstance(ListTransactionsDto, {
      startDate: '2025-12-31T23:59:59.999Z',
      endDate: '2025-01-01T00:00:00.000Z',
    });
    const errors = await validate(dto);
    const endDateError = errors.find((e) => e.property === 'endDate');
    expect(endDateError).toBeDefined();
    expect(endDateError?.constraints?.EndDateAfterStartDate).toBeDefined();
  });

  it('should fail when startDate is not a date', async () => {
    const dto = plainToInstance(ListTransactionsDto, {
      startDate: 'not-a-date',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'startDate')).toBe(true);
  });

  it('should fail when endDate is not a date', async () => {
    const dto = plainToInstance(ListTransactionsDto, {
      endDate: 'not-a-date',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'endDate')).toBe(true);
  });

  it('should pass with all fields set correctly', async () => {
    const dto = plainToInstance(ListTransactionsDto, {
      page: 2,
      limit: 20,
      sort: 'createdAt',
      order: 'asc',
      type: 'refund',
      startDate: '2025-01-01T00:00:00.000Z',
      endDate: '2025-12-31T23:59:59.999Z',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
