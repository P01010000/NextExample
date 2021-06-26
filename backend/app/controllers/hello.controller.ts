import { Controller, Get, Param } from '@nestjs/common';

@Controller("hello")
export class HelloController {
    @Get()
    hello() {
        return { name: 'John Doe' };
    }
}
