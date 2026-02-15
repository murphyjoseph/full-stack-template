import { NotFoundException } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import type { ContactsService } from './contacts.service';

vi.mock('../logger/logger.service', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const mockService: Record<keyof ContactsService, ReturnType<typeof vi.fn>> = {
  create: vi.fn(),
  findAll: vi.fn(),
  findOne: vi.fn(),
  remove: vi.fn(),
};

const controller = new ContactsController(mockService as any);

describe('ContactsController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('delegates to service and returns the created contact', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com', message: 'Hi' };
      const created = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockService.create.mockResolvedValue(created);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toBe(created);
    });
  });

  describe('findAll', () => {
    it('delegates to service', () => {
      const contacts = [{ id: 1 }, { id: 2 }];
      mockService.findAll.mockReturnValue(contacts);

      const result = controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toBe(contacts);
    });
  });

  describe('findOne', () => {
    it('returns the contact when found', async () => {
      const contact = { id: 5 };
      mockService.findOne.mockResolvedValue(contact);

      const result = await controller.findOne(5);

      expect(result).toBe(contact);
    });

    it('throws NotFoundException when contact is null', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes and returns the contact when found', async () => {
      const contact = { id: 3 };
      mockService.findOne.mockResolvedValue(contact);
      mockService.remove.mockResolvedValue(contact);

      const result = await controller.remove(3);

      expect(mockService.findOne).toHaveBeenCalledWith(3);
      expect(mockService.remove).toHaveBeenCalledWith(3);
      expect(result).toBe(contact);
    });

    it('throws NotFoundException when contact does not exist', async () => {
      mockService.findOne.mockResolvedValue(null);

      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
      expect(mockService.remove).not.toHaveBeenCalled();
    });
  });
});
