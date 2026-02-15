import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactDto } from './dto/contact.dto';
import { logger } from '../logger/logger.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiBody({ type: CreateContactDto })
  @ApiResponse({ status: 201, type: ContactDto })
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    logger.info('Contact created', { contactId: contact.id, email: contact.email });
    return contact;
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, type: [ContactDto] })
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ContactDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) {
      logger.warn('Contact not found', { contactId: id });
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ContactDto })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) {
      logger.warn('Contact not found for deletion', { contactId: id });
      throw new NotFoundException(`Contact #${id} not found`);
    }
    logger.info('Contact deleted', { contactId: id });
    return this.contactsService.remove(id);
  }
}
