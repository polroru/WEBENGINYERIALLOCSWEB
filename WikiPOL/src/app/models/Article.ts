export interface Article{
  id: number;
  title: string;
  content: string;
  creatBy: string;
  actualitzatBy?:string,
  createdAt?: string,
  updatedAt?: string
};
