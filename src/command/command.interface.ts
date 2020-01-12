
export type Command = 'addCredentials' | 'start'
                      | 'show' | 'addBasket'
  | 'deleteBasket' | 'deleteCredentials';

export interface CommandInterface {
  raw: string;
  name: Command;
  params: Record<string, string>;
}
