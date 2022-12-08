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

  getRandomQuote(): Observable<APIQuote> {
    return this.http.get<APIQuote>(this.endpoint);
  }
}
