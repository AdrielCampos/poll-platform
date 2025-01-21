export class OptionDto {
  id: number;
  text: string;
  votes: number;
}

export class PollDto {
  title: string;
  initialDate: string;
  finalDate: string;
  options: OptionDto[];
}
