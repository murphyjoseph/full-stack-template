import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ type: String, example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ type: String, example: 'jane@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ type: String, example: 'Hello, I have a question.' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
