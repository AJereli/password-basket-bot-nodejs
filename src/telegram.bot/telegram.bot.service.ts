import { OnModuleInit, Injectable } from '@nestjs/common';
import { AppConfig } from '../config/app.config';
import Telegraf from 'telegraf';
import { UserService } from '../user/user.service';
import { QueryFailedError, Repository } from 'typeorm';
import { CommandService } from '../command/command.service';
import { AddCredentialsCommand } from '../credentials/commands/add.credentials.command';
import { plainToClass } from 'class-transformer';
import { BasketService } from '../backet/basket.service';
import { AddBasketCommand } from '../backet/commands/add.basket.command';
import { BaseException } from '../command/exceptions/base.exception';
import { UserEntity } from '../entites/user.entity';
import { CredentialsService } from '../credentials/credentials.service';
import { ShowCredentialsCommand } from '../credentials/commands/show.credentials.command';
import { DeleteCredentialsCommand } from '../credentials/commands/delete.credentials.command';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRecordEntity } from '../entites/message.record.entity';
// import { CommandParseMiddleware } from './telegram.bot.middleware';

@Injectable()
export class TelegramBotService {
  private bot: Telegraf<any>;
  // private userService: UserService;

  constructor(private readonly appConfig: AppConfig,
              private readonly userService: UserService,
              private readonly commandService: CommandService,
              private readonly basketService: BasketService,
              private readonly credentialsService: CredentialsService,
              @InjectRepository(MessageRecordEntity) private readonly messageRecordRepository: Repository<MessageRecordEntity>) {

    this.bot = new Telegraf<any>(appConfig.tgBotToken);


    this.bot.use((ctx, next) => this.logMessage(ctx, next));
    this.bot.use((ctx, next) => this.commandService.commandParseMiddleware(ctx, next));

    this.bot.start((ctx) => this.startCommand(ctx));
    // this.bot.mi
    this.bot.use(async (ctx, next) => {
      const tgId = ctx.update.message.chat.id;
      const user = await this.userService.findUser(tgId);
      if (user) {
        ctx.user = user;
        return  next();
      } else {
        return ctx.reply('Send /start command before');
      }
    });

    this.bot.use(async (ctx, next) => {
      const answer = await next();
      if (answer) {
        return this.saveMessage(answer);
      }
    });

    this.bot.command('clear', (ctx) => this.clear(ctx));

    this.bot.command('addCredentials', (ctx => this.addCredentials(ctx)));
    this.bot.command('updateCredentials', (ctx => this.updateCredentials(ctx)));
    this.bot.command('deleteCredentials', (ctx) => this.deleteCredentials(ctx));
    this.bot.command('addBasket', (ctx => this.addBasket(ctx, ctx.user)));
    this.bot.command('deleteBasket', (ctx => this.deleteBasket(ctx, ctx.user)));
    this.bot.command('show', ((ctx, next) => this.show(ctx)));

    this.bot.on('text', async (ctx) => {
      return ctx.reply('Unsupported command');
    });

    this.bot.catch(async (error, ctx) => {
      let answer = {};
      if (error instanceof BaseException) {
        const baseError = error as BaseException;
        answer = await ctx.reply(baseError.message);
      } else {
        console.log(error);
        answer = await ctx.reply('Wooops, something bad was happen');
      }
      await this.saveMessage(answer);
      return answer;
    });

    this.bot.startPolling();
  }

  async logMessage(ctx, next) {

    await this.saveMessage(ctx.message);
    return next();
  }

  private async saveMessage(message) {
    const messageRecord = new MessageRecordEntity();
    messageRecord.chatId = message.chat.id;
    messageRecord.messageId = message.message_id;
    messageRecord.telegramId = message.chat.id;

    await this.messageRecordRepository.save(messageRecord);
  }

  async clear(ctx) {
    try {
      const telegramId = ctx.user.telegramId;
      const records = await this.messageRecordRepository.find({
        telegramId,
      });

      for (const record of records) {
        await ctx.tg.deleteMessage(record.chatId, record.messageId);
      }

      await this.messageRecordRepository.remove(records);
    } catch (e) {
      console.log(e);
    }


  }

  async deleteCredentials(ctx) {
    const params = ctx.state.command.params;
    const model = plainToClass(DeleteCredentialsCommand, params);
    await this.credentialsService.delete(model, ctx.user);
    return ctx.reply('Deleted');

  }

  async updateCredentials(ctx) {
    const params = ctx.state.command.params;
    const model = plainToClass(AddCredentialsCommand, params);
    await this.credentialsService.update(model, ctx.user);

    return ctx.reply('Updated');
  }

  async show(ctx) {
    const params = ctx.state.command.params;
    const model = plainToClass(ShowCredentialsCommand, params);
    const basketTitle = model.basket || 'default';
    const result = await this.credentialsService.get(model, ctx.user);
    const mapped = result.map(c => c.toResponseString(basketTitle)).join('\n-------------\n');

    if (!mapped || mapped === '') {
      return  ctx.reply(`No credentials in basket '${basketTitle}'`);
    } else {
      return ctx.reply(mapped);
    }
  }

  public async addBasket(ctx, user: UserEntity) {
    const params = ctx.state.command.params;
    const model = plainToClass(AddBasketCommand, params);
    const result = await this.basketService.create(model, user);
    const basketName = result.basket.title;
    return ctx.reply('Created basket with name ' + basketName);
  }
  public async deleteBasket(ctx, user: UserEntity) {
    const params = ctx.state.command.params;
    const model = plainToClass(AddBasketCommand, params);
    const result = await this.basketService.delete(model, user);
    const basketName = result.title;
    return ctx.reply('Deleted basket with name ' + basketName);
  }

  public async addCredentials(ctx) {
    const params = ctx.state.command.params;
    const model = plainToClass(AddCredentialsCommand, params);
    const credentials = await this.credentialsService.create(model, ctx.user);
    return ctx.reply('Created credentials with name ' + credentials.title);
  }

  public async startCommand(ctx) {
    const tgId = ctx.update.message.chat.id;
    const username = ctx.update.message.chat.username;

    try {
      await this.userService.createUserWithBasket(tgId, username);
      return ctx.reply('Now you can use all feature of bot');
    } catch (e) {
      return ctx.reply('You already have an account in this bot');
    }

  }

}
