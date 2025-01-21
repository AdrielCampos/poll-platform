import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PollDto } from './dtos/poll';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('polls')
  async getPolls(
    @Query('initialDate') initialDate: string,
    @Query('finalDate') finalDate: string,
  ): Promise<string> {
    return await this.appService.getPolls({ initialDate, finalDate });
  }

  @Get('polls/:id')
  async getPoll(@Param('id') id: string): Promise<string> {
    return await this.appService.getPoll(id);
  }

  @Post('polls')
  async createPoll(@Body() data: PollDto): Promise<string> {
    return await this.appService.createPoll(data);
  }

  @Put('polls/:id')
  async editPoll(
    @Param('id') id: string,
    @Body() data: PollDto,
  ): Promise<string> {
    return await this.appService.editPoll(id, data);
  }

  @Delete('polls/:id')
  async deletePoll(@Param('id') id: string): Promise<string> {
    return await this.appService.deletePoll(id);
  }
}
