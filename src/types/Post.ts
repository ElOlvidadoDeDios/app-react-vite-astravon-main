export interface PostDto {
  id: number;
  userId: number;
  userName: string;
  mail: string;
  publicationDate: string;
  postUrl: string;
  updatePost: string;
  content: string;
  urlMedia: string;
  likeCount: number;
  commentCount: number;
}

export interface GetPost {
  id: number;
  userId: number;
  publicationDate: string;
  postUrl: string;
  updatePost: string;
  content: string;
  urlMedia: string;
}
