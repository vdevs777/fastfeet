import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EnvModule } from "./env/env.module";
import { envSchema } from "./env";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
