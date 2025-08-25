import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Todo, CreateTodoRequest, UpdateTodoRequest, ReorderRequest } from '../models/todo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiUrl = `${environment.apiUrl}/todos`;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido ocorreu';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Dados inválidos enviados';
          break;
        case 404:
          errorMessage = 'Recurso não encontrado';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor';
          break;
        default:
          errorMessage = `Erro ${error.status}: ${error.message}`;
      }
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  private loadTodos(): void {
    this.http
      .get<Todo[]>(this.apiUrl)
      .pipe(catchError(this.handleError))
      .subscribe({
        next: (todos) => {
          const sortedTodos = todos.sort((a, b) => a.reOrder - b.reOrder);
          this.todosSubject.next(sortedTodos);
        },
        error: (error) => {
          console.error('Erro ao carregar todos:', error);
          this.todosSubject.next([]);
        },
      });
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  createTodo(request: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, request).pipe(
      tap((newTodo) => {
        const currentTodos = this.todosSubject.value;
        const updatedTodos = [...currentTodos, newTodo].sort((a, b) => a.reOrder - b.reOrder);
        this.todosSubject.next(updatedTodos);
      }),
      catchError(this.handleError)
    );
  }

  updateTodo(id: number, request: UpdateTodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, request).pipe(
      tap((updatedTodo) => {
        const currentTodos = this.todosSubject.value;
        const todoIndex = currentTodos.findIndex((t) => t.id === id);
        if (todoIndex !== -1) {
          const updatedTodos = [...currentTodos];
          updatedTodos[todoIndex] = updatedTodo;
          this.todosSubject.next(updatedTodos.sort((a, b) => a.reOrder - b.reOrder));
        }
      }),
      catchError(this.handleError)
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value;
        const filteredTodos = currentTodos.filter((t) => t.id !== id);
        this.todosSubject.next(filteredTodos);
      }),
      catchError(this.handleError)
    );
  }

  reorderTodos(reorderRequests: ReorderRequest[]): Observable<Todo[]> {
    return this.http.put<Todo[]>(`${this.apiUrl}/reorder`, reorderRequests).pipe(
      tap((updatedTodos) => {
        const sortedTodos = updatedTodos.sort((a, b) => a.reOrder - b.reOrder);
        this.todosSubject.next(sortedTodos);
      }),
      catchError(this.handleError)
    );
  }

  refresh(): void {
    this.loadTodos();
  }
}
