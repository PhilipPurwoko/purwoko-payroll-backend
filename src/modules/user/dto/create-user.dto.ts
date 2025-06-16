import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password with at least 6 characters',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    example: Role.employee,
    description: 'Role associated with the user',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    example: 50000,
    description: 'Standard hourly pay rate',
  })
  @IsNumber()
  @IsPositive()
  hourlyRate: number;

  @ApiProperty({
    example: 100000,
    description: 'Hourly pay rate for overtime',
  })
  @IsNumber()
  @IsPositive()
  overtimeRate: number;

  @ApiProperty({
    example: 2.0,
    description: 'Overtime multiplier applied to hourly rate',
  })
  @IsNumber()
  @IsPositive()
  overtimeMultiplier: number;
}
