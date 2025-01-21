export interface Options {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  initialDate: Date;
  finalDate: Date;
  options: Options[];
}
