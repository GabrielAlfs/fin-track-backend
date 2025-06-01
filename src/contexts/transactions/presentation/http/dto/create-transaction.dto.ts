import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount of the transaction',
    example: 100.5,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({
    description: 'Description of the transaction',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
