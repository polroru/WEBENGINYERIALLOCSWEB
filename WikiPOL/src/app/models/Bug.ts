export interface Bug{
    _id: string,
    bug_description: string,
    reproduction_steps: string, 
    severity: number,
    additional_comments: string[],
    status: 'Open' | 'Work in progress' | 'Solved',
    createdAt?: string,
    updatedAt?: string 

}