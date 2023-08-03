import {AnonUser} from '../../../types/service/AnonProfile.type';

export interface PhotoProfileProps {
  anonUser?: AnonUser;
  isAnonimity: boolean;
  loadingAnonUser: boolean;
  avatarUrl: string;
  chatDisabled?: boolean;
}

export interface TextAreaChatProps extends PhotoProfileProps {
  placeholder?: string;
  defaultValue?: string;
  onChangeMessage: (message: string) => void;
  onSend: () => void;
  disabledButton?: boolean;
  disabledInput?: boolean;
  minHeight?: number;
  maxHeight?: number;
}
