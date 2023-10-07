export interface TopicRepoItem {
  categories: string;
  created_at: string;
  deleted_at?: string | null;
  flg_show: string;
  icon_path: string;
  is_custom_topic: boolean;
  last_read_at: string;
  name: string;
  sign: boolean;
  sort: number;
  topic_id: string;
  updated_at: string;
  user_id: string;
  user_topics_id: string;
}
