import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Todo, ReorderRequest } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './todo-list.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .cdk-drop-list {
        display: block;
        overflow: hidden;
      }

      .cdk-drag {
        display: block;
        position: relative;
        z-index: 1;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transform: rotate(2deg);
        z-index: 1000;
        position: fixed !important;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .cdk-drag-placeholder {
        background: #f3f4f6 !important;
        border: 2px dashed #d1d5db !important;
        opacity: 0.4;
        height: auto;
        min-height: 60px;
        border-radius: 8px;
        position: relative;
      }

      .cdk-drag-placeholder > * {
        visibility: hidden;
      }

      .cdk-drop-list-receiving {
        border: 2px solid #3b82f6;
      }

      .cdk-drag-disabled {
        cursor: not-allowed;
      }
    `,
  ],
})
export class TodoListComponent implements OnInit {
  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  todos$: Observable<Todo[]>;
  todoForm: FormGroup;

  isModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  currentTodoId: number | null = null;

  isDeleteModalOpen = false;
  isDeletingTodo = false;
  todoToDelete: Todo | null = null;

  isDragInProgress = false;

  private todoService = inject(TodoService);
  private fb = inject(FormBuilder);

  constructor() {
    this.todos$ = this.todoService.getTodos();
    this.todoForm = this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      price: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
      limitDate: ['', Validators.required],
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentTodoId = null;
    this.todoForm.reset({
      name: '',
      price: 0,
      limitDate: '',
    });
    this.isModalOpen = true;
    this.focusNameInput();
  }

  openEditModal(todo: Todo): void {
    this.isEditMode = true;
    this.currentTodoId = todo.id;
    this.todoForm.patchValue({
      name: todo.name,
      price: todo.price,
      limitDate: todo.limitDate,
    });
    this.isModalOpen = true;
    this.focusNameInput();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentTodoId = null;
    this.isSubmitting = false;
    this.todoForm.reset();
  }

  onSubmit(): void {
    if (this.todoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.todoForm.value;

      if (this.isEditMode && this.currentTodoId) {
        this.todoService.updateTodo(this.currentTodoId, formValue).subscribe({
          next: (todo) => {
            if (todo) {
              this.closeModal();
            }
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
      } else {
        this.todoService.createTodo(formValue).subscribe({
          next: () => {
            this.closeModal();
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
      }
    }
  }

  confirmDelete(todo: Todo): void {
    this.todoToDelete = todo;
    this.isDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.todoToDelete = null;
    this.isDeletingTodo = false;
  }

  executeDelete(): void {
    if (this.todoToDelete && !this.isDeletingTodo) {
      this.isDeletingTodo = true;
      this.todoService.deleteTodo(this.todoToDelete.id).subscribe({
        next: () => {
          this.cancelDelete();
        },
        error: () => {
          this.isDeletingTodo = false;
        },
      });
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  isHighValueTask(todo: Todo): boolean {
    return todo.price >= 1000;
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  onDrop(event: CdkDragDrop<Todo[]>): void {
    const todos = this.todosSubject.value;

    if (event.previousIndex !== event.currentIndex) {
      this.isDragInProgress = true;

      const reorderedTodos = [...todos];
      moveItemInArray(reorderedTodos, event.previousIndex, event.currentIndex);

      const reorderRequests: ReorderRequest[] = reorderedTodos.map((todo, index) => ({
        id: todo.id,
        orderIndex: index + 1,
      }));

      this.todoService.reorderTodos(reorderRequests).subscribe({
        next: () => {
          this.isDragInProgress = false;
        },
        error: (error) => {
          console.error('Erro ao reordenar todos:', error);
          this.isDragInProgress = false;
          this.todoService.refresh();
        },
      });
    }
  }

  private get todosSubject() {
    return this.todoService['todosSubject'];
  }

  private focusNameInput(): void {
    setTimeout(() => {
      if (this.nameInput?.nativeElement) {
        this.nameInput.nativeElement.focus();
      }
    }, 100);
  }
}
