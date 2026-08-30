import { IsNotEmpty, IsString } from "class-validator";
import { Role } from "@prisma/client";


export class CreateUserDto {

@IsString()
@IsNotEmpty()
firstName: string;

@IsString()
@IsNotEmpty()
lastName: string;

@IsString()
@IsNotEmpty()
mobileNumber: string;

@IsString()
@IsNotEmpty()
email: string;

@IsString()
@IsNotEmpty()
password: string;

}