import {ReplyMessage} from '../../hooks/screens/useMessageHook.types';

export interface ChatReplyViewProps {
  type: 'SIGNED' | 'ANONYMOUS';
  messageType: string;
  replyData: ReplyMessage;
}
