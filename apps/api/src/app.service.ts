import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PollDto } from './dtos/poll';
import { z } from 'zod';
import { Option, Poll as PollType } from './classes/poll';

@Injectable()
export class AppService {
  private prisma = new PrismaClient();
  private readonly logger = new Logger(AppService.name);

  async getPolls(query: {
    initialDate?: string;
    finalDate?: string;
  }): Promise<string> {
    const { initialDate, finalDate } = query;
    const polls = await this.prisma.poll.findMany({
      where: {
        initialDate: initialDate && {
          gte: new Date(initialDate),
        },
        finalDate: finalDate && {
          lte: new Date(finalDate),
        },
      },
      include: {
        options: true,
      },
    });

    this.logger.log(`Polls found: ${polls.length}`);
    return JSON.stringify(polls);
  }

  async getPoll(id: string): Promise<string> {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    this.logger.log(`Poll found: ${poll?.title}`);
    return JSON.stringify(poll);
  }

  async createPoll(data: PollDto): Promise<string> {
    const pollSchema = z.object({
      title: z.string(),
      initialDate: z.string(),
      finalDate: z.string(),
      options: z.array(
        z.object({
          text: z.string(),
          votes: z.number(),
        }),
      ),
    });

    const parsedPollSchema = pollSchema.parse(data);

    const response = await this.prisma.poll.create({
      data: {
        ...parsedPollSchema,
        options: {
          create: parsedPollSchema.options.map((option) => ({
            text: option.text,
            votes: option.votes || 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    this.logger.log(`Poll created: ${response.title}`);
    return JSON.stringify(response);
  }

  async editPoll(id: string, data: PollDto): Promise<string> {
    const pollSchema = z
      .object({
        title: z.string(),
        initialDate: z.string(),
        finalDate: z.string(),
        options: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
            votes: z.number(),
          }),
        ),
      })
      .partial();

    const parsedPollSchema = pollSchema.parse(data);

    const response = await this.prisma.poll.update({
      where: { id },
      data: {
        ...parsedPollSchema,
        options: {
          upsert: parsedPollSchema.options?.map((option, index) => ({
            where: { id: option.id },
            update: {
              text: option.text,
              votes: option.votes,
            },
            create: {
              text: option.text,
              votes: option.votes || 0,
            },
          })),
        },
      },
      include: {
        options: true,
      },
    });

    this.logger.log(`Poll edited: ${response.title}`);
    return JSON.stringify(response);
  }

  async deletePoll(id: string): Promise<string> {
    const deleteOptions = await this.prisma.option.deleteMany({
      where: { pollId: id },
    });
    const response = await this.prisma.poll.delete({
      where: { id },
      include: {
        options: true,
      },
    });

    this.logger.log(`Poll deleted: ${response.title}`);
    return JSON.stringify(response);
  }

  async votePoll(pollId: string, optionId: number): Promise<string> {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
      },
    });

    const option = (poll?.options as any).find(
      (option) => option.id === optionId,
    );

    if (!option) {
      throw new Error('Option not found');
    }

    const response = await this.prisma.poll.update({
      where: { id: pollId },
      data: {
        options: {
          update: {
            where: { id: optionId },
            data: {
              votes: { increment: 1 },
            },
          },
        },
      },
      include: {
        options: true,
      },
    });

    this.logger.log(`Poll voted: ${response.title}`);
    return JSON.stringify(response);
  }
}
