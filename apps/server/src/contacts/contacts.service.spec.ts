import { ContactsService } from './contacts.service';

const mockPrisma = {
  contact: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
  },
};

const service = new ContactsService(mockPrisma as any);

describe('ContactsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('calls prisma.contact.create with the DTO', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com', message: 'Hi' };
      const created = { id: 1, ...dto, createdAt: new Date(), updatedAt: new Date() };
      mockPrisma.contact.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockPrisma.contact.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toBe(created);
    });
  });

  describe('findAll', () => {
    it('calls prisma.contact.findMany ordered by createdAt desc', async () => {
      const contacts = [{ id: 1 }, { id: 2 }];
      mockPrisma.contact.findMany.mockResolvedValue(contacts);

      const result = await service.findAll();

      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toBe(contacts);
    });
  });

  describe('findOne', () => {
    it('calls prisma.contact.findUnique with the id', async () => {
      const contact = { id: 5 };
      mockPrisma.contact.findUnique.mockResolvedValue(contact);

      const result = await service.findOne(5);

      expect(mockPrisma.contact.findUnique).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result).toBe(contact);
    });
  });

  describe('remove', () => {
    it('calls prisma.contact.delete with the id', async () => {
      const deleted = { id: 3 };
      mockPrisma.contact.delete.mockResolvedValue(deleted);

      const result = await service.remove(3);

      expect(mockPrisma.contact.delete).toHaveBeenCalledWith({ where: { id: 3 } });
      expect(result).toBe(deleted);
    });
  });
});
