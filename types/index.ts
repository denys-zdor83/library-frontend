export type Role = 'user' | 'librarian' | 'admin';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  avatar: string | null;
  avatar_url: string | null;
  country: string;
  city: string;
  postal_code: string;
  bio: string;
  registered_at: string;
  favorite_genres: FavoriteGenre[];
  permissions: string[];
}

export interface FavoriteGenre {
  id: number;
  genre: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  year: number;
  genre: number;
  genre_name: string;
  cover: string | null;
  cover_url: string | null;
  status: 'available' | 'reserved' | 'borrowed';
  total_copies: number;
  available_copies: number;
  borrow_count: number;
  average_rating: number;
  user_rating?: number | null;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  book: number;
  book_detail: Book;
  user: number;
  user_email: string;
  user_name: string;
  status: 'requested' | 'approved' | 'rejected' | 'cancelled' | 'returned';
  requested_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  due_date: string | null;
  notes: string;
}

export interface CartItem {
  id: number;
  book: number;
  book_detail: Book;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  page: number;
  page_size?: number;
  total_pages: number;
}

export interface ApiError {
  error: string;
  [key: string]: unknown;
}

export interface LibrarianProfile {
  id: number;
  user: number;
  permissions: string[];
}

export interface LibrarianUser extends User {
  librarian_profile: LibrarianProfile | null;
}
