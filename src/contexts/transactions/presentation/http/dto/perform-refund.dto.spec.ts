import { validate } from 'class-validator';
import { PerformRefundDto } from './perform-refund.dto';

describe('PerformRefundDto', () => {
  it('should pass validation when description is a valid string under 255 characters', async () => {
    const dto = new PerformRefundDto();
    dto.description = 'Refund due to duplicate charge';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation when description is not provided', async () => {
    const dto = new PerformRefundDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when description is not a string', async () => {
    const dto = new PerformRefundDto();
    dto.description = 12345 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should fail validation when description exceeds 255 characters', async () => {
    const dto = new PerformRefundDto();
    dto.description = 'a'.repeat(256);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should pass validation when description is exactly 255 characters', async () => {
    const dto = new PerformRefundDto();
    dto.description = 'a'.repeat(255);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
