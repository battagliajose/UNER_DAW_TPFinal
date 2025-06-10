export class EmailDto {
  to: string;
  from?: string;
  cc: string[];
  subject: string;
  body: string;
  context: any;
}
