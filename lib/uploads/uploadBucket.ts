export const allowedBucketNames = ['question', 'user', 'document'] as const;

export type TBucketName = typeof allowedBucketNames[number];
