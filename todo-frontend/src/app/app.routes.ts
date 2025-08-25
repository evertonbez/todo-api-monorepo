import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    loadChildren: () => import('./todos/todos.routes').then((r) => r.todosRoutes),
  },
];
