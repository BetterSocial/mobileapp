import {AnonUser} from '../../../types/service/AnonProfile.type';

export interface PhotoProfileProps {
  anonUser: AnonUser;
  isAnonimity: boolean;
  loadingAnonUser: boolean;
  avatarUrl: string;
}

export interface TextAreaChatProps extends PhotoProfileProps {
  placeholder?: string;
  defaultValue?: string;
  onChangeMessage: (message: string) => void;
  onSend: () => void;
  disabledButton?: boolean;
}
