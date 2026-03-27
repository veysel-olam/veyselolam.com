export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  readingTime: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: Date;
  replies?: Comment[];
  _count?: { likes: number };
}
