export class CreateMessageDto {
  readonly title: string;
  readonly text: string;
  readonly codeMessage: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly fileUrl: string;
  readonly typeFile: string;
  readonly status: string;
  readonly type: string;
  readonly senderType: string;
  readonly userSender: string;
  readonly userReceiver: string;
  readonly adminSender: string;
  readonly adminReceiver: string;
  readonly ticket: string;
  readonly userBroadcast: string;
  readonly adminBroadcast: string;
}
