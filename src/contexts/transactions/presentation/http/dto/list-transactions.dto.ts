import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EndDateAfterStartDate', async: false })
export class EndDateAfterStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(endDate: Date, args: ValidationArguments) {
    const dto = args.object as ListTransactionsDto;
    if (!endDate || !dto.startDate) return true;
    return endDate >= dto.startDate;
  }

  defaultMessage() {
    return `endDate must be greater than or equal to startDate.`;
  }
}

export class ListTransactionsDto {
  @ApiPropertyOptional({
    description: 'Page number to retrieve.',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit = 10;

  @ApiPropertyOptional({
    description: 'Sort field.',
    example: 'createdAt',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order.',
    example: 'desc',
    required: false,
  })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Transaction type to filter by.',
    example: 'income',
    enum: ['income', 'expense', 'refund'],
    required: false,
  })
  @IsString()
  @IsIn(['income', 'expense', 'refund'])
  @IsOptional()
  type?: 'income' | 'expense' | 'refund';

  @ApiPropertyOptional({
    description: 'Start date of the query period (ISO 8601 format).',
    example: '2025-01-01T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date of the query period (ISO 8601 format).',
    example: '2025-12-31T23:59:59.999Z',
    required: false,
  })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @Validate(EndDateAfterStartDateConstraint)
  endDate?: Date;
}
