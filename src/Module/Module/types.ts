export interface ModuleItem {
  text: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface ModuleCardProps {
  title: string;
  difficulty: string;
  items: ModuleItem[];
  progress?: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  locked?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface ModuleItem {
  text: string;
  isCompleted: boolean;
  isLocked: boolean;
}