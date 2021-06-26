import { Controller, Get, Param } from '@nestjs/common';

@Controller("randomNumber")
export class RandomNumberController {
    @Get()
    randomNumber() {
        return Math.random() * 100;
    }

    @Get("/:number")
    async findOne(@Param("number") param: string) {
        return { param };
    }
}
