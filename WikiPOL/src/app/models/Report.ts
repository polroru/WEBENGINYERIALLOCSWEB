export interface Report{
    _id?: string,
    articleId: string,
    creatBy: string,
    state: 'solved' | 'unsolved',
    createdAt?: string,
    updatedAt?: string
};