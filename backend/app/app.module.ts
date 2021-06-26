import { Module } from '@nestjs/common';
import { RandomNumberController } from './controllers/randomNumber.controller';
import { HelloController } from './controllers/hello.controller';

@Module({
    controllers: [RandomNumberController, HelloController]
})
export class AppModule { }
