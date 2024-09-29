export type CreateCommentDto = {
  content: string;
  postId: number;
  commentId?: number;
  parentId?: number;
};

export type CommentsDto = {
  postId: number;
  commentId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  parentId?: number;
  userId: number;
  nickname: string;
  imageUrl: string;
};

export type CommentsResDto = {
  comments: CommentsDto[];
  total: number;
};