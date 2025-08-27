
export interface Book {
  id: number;
  title: string;
  authorId: number;
  publishedYear: number;
  available: boolean;
}

export interface Author {
  id: number;
  name: string;
  country?: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  joinDate: string;
}
