import { validate } from 'class-validator';
import { CreateContactDto } from './create-contact.dto';

function createDto(overrides: Partial<CreateContactDto> = {}): CreateContactDto {
  const dto = new CreateContactDto();
  dto.name = 'Jane Doe';
  dto.email = 'jane@example.com';
  dto.message = 'Hello, I have a question.';
  Object.assign(dto, overrides);
  return dto;
}

describe('CreateContactDto', () => {
  it('passes validation with valid data', async () => {
    const errors = await validate(createDto());
    expect(errors).toHaveLength(0);
  });

  it('fails when name is missing', async () => {
    const dto = createDto();
    // @ts-expect-error testing missing field
    dto.name = undefined;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('name');
  });

  it('fails when name is empty', async () => {
    const errors = await validate(createDto({ name: '' }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('name');
  });

  it('fails when email is missing', async () => {
    const dto = createDto();
    // @ts-expect-error testing missing field
    dto.email = undefined;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('email');
  });

  it('fails when email format is invalid', async () => {
    const errors = await validate(createDto({ email: 'not-an-email' }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('email');
  });

  it('fails when message is missing', async () => {
    const dto = createDto();
    // @ts-expect-error testing missing field
    dto.message = undefined;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('message');
  });

  it('fails when message is empty', async () => {
    const errors = await validate(createDto({ message: '' }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]!.property).toBe('message');
  });
});
