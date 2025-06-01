import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PerformRefundDto {
  @ApiPropertyOptional({
    description: 'Description of the transaction',
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
