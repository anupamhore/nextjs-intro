import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * since we want to use validators globally for all types of request hence we declare it in main.ts file
   * also we passed few params
   * whitelist -> set to true
   * forbidNonWhitelisted -> set to true, this does not allow any extra params to be passed in the request body other than
   * the validated fields
   * transform -> set to true, this will automatically transform the request body to the type defined
   *  public createUsers(
       @Body() createUserDto: CreateUserDto,...)
      Here createUserDto is just an object not of type CreateUserDto
   * but with transform set to true, it will automatically convert the request body to an instance
   * of CreateUserDto, meaning it will apply the validation rules defined in the CreateUserDto class.
   * This is useful when we want to ensure that the data we are working with
   * is of the correct type and to avoid type errors in our application.
    * This is useful for ensuring that the data we are working with is of the correct type and to avoid type errors in our application.
    * This is useful for ensuring that the data we are working with
    * is of the correct type and to avoid type errors in our application.
   */

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
