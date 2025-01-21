export class Option {
  id: number;
  text: string;
  votes: number;
}

export class Poll {
  id: string;
  title: string;
  initialDate: Date;
  finalDate: Date;
  options: Option[];
}
