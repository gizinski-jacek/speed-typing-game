import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface APIQuote {
  _id: string;
  content: string;
  author: String;
  tags: string[];
  authorSlug: string;
  length: number;
  dateAdded: string;
  dateModified: string;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private endpoint = 'https://quotable.io/random';

  constructor(private http: HttpClient) {}

  getRandomQuote(difficulty: string): Observable<APIQuote> {
    let query = {};
    if (difficulty === 'veryeasy') {
      query = { maxLength: 64 };
    }
    if (difficulty === 'easy') {
      query = { minLength: 64, maxLength: 128 };
    }
    if (difficulty === 'medium') {
      query = { minLength: 128, maxLength: 256 };
    }
    if (difficulty === 'hard') {
      query = { minLength: 256 };
    }
    return this.http.get<APIQuote>(this.endpoint, { params: query });
  }
}
