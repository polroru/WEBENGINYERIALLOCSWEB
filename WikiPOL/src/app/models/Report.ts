export interface Report{
    _id: string,
    articleId: string,
    articleTitle: string,
    comment: string,
    creatBy: string,
    state: 'solved' | 'unsolved',
    createdAt?: string,
    updatedAt?: string
};