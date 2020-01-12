import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { Command, CommandInterface } from './command.interface';
import {plainToClass} from 'class-transformer';
import { AddCredentialsCommand } from '../credentials/commands/add.credentials.command';

@Injectable()
export class CommandService {
  //
  // transform<T>(command: CommandInterface, output: T): T {
  //   // let o = new T();
  //   let result = Reflect.getMetadataKeys(output);
  //   let result2 = Reflect.getMetadata('argKey', output);
  //   return null;
  // }

  public commandParseMiddleware(ctx, next) {
    if (ctx.updateType === 'message' && ctx.updateSubTypes[0] === 'text') {
      const text = ctx.update.message.text.toLowerCase();
      if (text.startsWith('/')) {

        const command = this.extractCommand(text);
        const params = this.extractParams(text);

        ctx.state.command = {name: command, params, raw: text} as CommandInterface;

      }
    }
    return next();
  }

  private extractParams(rawCommand: string): Record<string, string> {
    let parsed = rawCommand.split(' ');

    if (parsed.length === 0) {
      return { };
    }

    parsed = parsed.slice(1, parsed.length);

    let currentParam = '';
    const params = {};

    parsed.forEach(str => {
      if (str[0] === '-') {
        currentParam = str.replace('-', '');
        params[currentParam] = true;
      } else {
        params[currentParam] = str;
      }
    });

    return params;
  }

  private extractCommand(rawCommand: string): Command {
    let command = rawCommand.split(' ').shift();

    if (command === undefined) {
      command = rawCommand;
    }
    command = command.replace('/', '');

    return command as Command;
  }

}
