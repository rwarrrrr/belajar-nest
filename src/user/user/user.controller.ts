import { Body, Controller, Get, Header, HttpCode, HttpException, HttpRedirectResponse, Inject, Optional, Param, ParseIntPipe, Post, Query, Redirect, Req, Res, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { user } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

// @UseGuards(RoleGuard)
@Controller('/api/user')
export class UserController {

    //===========decorator dalam function============//
    //@Req()
    //@Param(key)
    //@Body()
    //@Query(key)
    //@Header()
    //@Ip()
    //@HostParam()
    //===========decorator dalam function============//

    //===========HTTP decorator ============//
    //@GET(key)
    //@POST(key)
    //@PUT(key)
    //@DELETE(key)
    //@PATCH(key)
    //@ALL()
    //===========HTTP decorator ============//
    
    //===========RESPONSE decorator ============//
    //@HttpCode(code)
    //@Header(key,value)
    //@Redirect(location,code)
    //@Next()
    //===========RESPONSE decorator ============//    

    //npm install cookie-parser
    //npm install --save-dev @type/cookie-parser

    // @Inject()
    // @Optional()
    // private userService: UserService
    constructor(
        private userService: UserService,
        private connection: Connection,
        private mailService: MailService,
        @Inject('EmailService') private emailService: MailService,
        private userRepository: UserRepository,
        private memberService: MemberService
    ){}

    @Post('login')
    @UseFilters(ValidationFilter)//error handling
    @UsePipes(new ValidationPipe(loginUserRequestValidation))//parser
    @UseInterceptors(TimeInterceptor)//menambah response body
    @Header('Content-Type', 'application/json')
    login(@Body() request: LoginUserRequest){
        return `Hello ${request.username}`
    } 

    @Get('current')
    // @UseGuards(new RoleGuard(['admin', 'operator']))
    @Roles(['admin', 'operator'])
    current(@Auth() user: user): Record<string, any> {
        return {
            data: `hello ${user.first_name}`
        }
    }

    @Get('/connection')
    async getConnection(): Promise<string>{
        // this.userRepository.save()
        this.mailService.send()
        this.emailService.send()
        console.info(this.memberService.getConnectionName())
        console.info(this.memberService.sendEmail())
        return this.connection.getName()
    }

    @Get('/create')
    async create(@Query() query: any): Promise<user>{
        if(!query.first_name){
            throw new HttpException({
                code: 400,
                errors: 'first_name is required'
            }, 400)
        }
        return await this.userRepository.save(query.first_name, query.last_name)
    }

    @Get('set-cookie')
    setCookiet(@Query() query: any, @Res() res: Response){
        res.cookie('name',query.name)
        res.status(200).send('success cookie')
    }

    @Get('get-cookie')
    getCookiet(@Req() req: Request){
        return req.cookies['name']
    }

    @Get('header')
    @Header('Content-Type','application/json')
    @HttpCode(200)
    header(){
        return{
            data : 'hello json'
        }
    }

    @Get('/redirect')
    @Redirect()
    redirect(): HttpRedirectResponse{
        return {
            url: '/api/user/header',
            statusCode: 301
        }
    }
    
    @Get('/hello')
    // @UseFilters(ValidationFilter)
    //localhost:3000/api/user/hello?name=nest&lastname=js
    async query(@Query() query: any): Promise<string>{
        return await `${this.userService.sayHello(query.name)} ${this.userService.sayHello(query.lastname)}`;
    }

    @Get('/:id')
    //localhost:3000/api/user/{id}
    param(@Param('id', ParseIntPipe) id: number): string{
        return `GET ${id}`;
    }

    @Get('express')
    expressRes(@Res() res: Response){
        res.status(200).send("sample express")
    }

    @Get('express/:id')
    expressReq(@Req() req: Request){
        return `GET ${req.params.id}`;
    }


    @Post()
    post(){
        return 'string'
    }


}
