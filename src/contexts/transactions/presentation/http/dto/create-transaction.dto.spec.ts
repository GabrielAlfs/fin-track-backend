import { validate } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

describe('CreateTransactionDto', () => {
  it('should pass validation with a valid amount and optional description', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 100.5;
    dto.description = 'Dinner at restaurant';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with a valid amount and no description', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 20.0;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when amount is missing', async () => {
    const dto = new CreateTransactionDto();
    dto.description = 'Missing amount';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should fail validation when amount is negative', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = -50;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should fail validation when amount is zero', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 0;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should fail validation when amount is not a number', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should fail validation when description is not a string', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 50;
    dto.description = 123 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation when description exceeds 255 characters', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 50;
    dto.description = 'a'.repeat(256);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should pass validation when description is exactly 255 characters', async () => {
    const dto = new CreateTransactionDto();
    dto.amount = 50;
    dto.description = 'a'.repeat(255);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
