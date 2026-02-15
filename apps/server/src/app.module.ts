import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // @SETUP aggressive rate limiting as added protection since no auth is implemented out of box.
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 10,
      },
      {
        name: 'long',
        ttl: 86400000, // 24 hours (1 day)
        limit: 100,
      },
    ]),
    PrismaModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
