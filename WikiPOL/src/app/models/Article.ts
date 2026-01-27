export interface Article{
  _id: string;
  title: string;
  content: string;
  creatBy: string;
  actualitzatBy?:string,
  createdAt?: string,
  updatedAt?: string
};
