import { Routes } from '@angular/router';

export const todosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todo-list/todo-list.component').then((c) => c.TodoListComponent),
    title: 'Lista de Tarefas',
  },
];
