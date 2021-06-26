import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as http from 'http';
import { NextApiHandler } from 'next';
import { NestExpressApplication } from '@nestjs/platform-express';

export module Backend {

    let app: NestExpressApplication;

    export async function getApp() {
        if (!app) {
            app = await NestFactory.create<NestExpressApplication>(
                AppModule,
                { bodyParser: false }
            );
            app.setGlobalPrefix("api");

            await app.init();
        }
        app.disable('x-powered-by');

        return app;
    }

    export async function getListener() {
        const app = await getApp();
        const server: http.Server = app.getHttpServer();
        const [listener] = server.listeners("request") as NextApiHandler[];
        return listener;
    }
}
