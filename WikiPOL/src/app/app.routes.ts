import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home), //posem el nom de la classe
    title: 'Home'
  },
  {
    path:'sign-in',
    loadComponent: () => import('./sign-in/sign-in').then(m => m.SignIn),
    title: 'Sign-in'
  },
  {
    path:'sign-up',
    loadComponent: () => import('./sign-up/sign-up').then(m => m.SignUp),
    title: 'Sign-up'
  },
  {
    path: 'articles',
    children: [
      {
        path: 'create',
        loadComponent: () => import('./add-articles/add-articles').then(m => m.AddArticles),
        title: 'Create'
      },
      {
        path: 'search/:title/edit/:id',
        loadComponent: () => import('./edit-articles/edit-articles').then(m => m.EditArticles),
        title: 'Edit'
      },
      {
        path: 'search/:title',
        loadComponent: () => import('./articleslist/articleslist').then(m => m.Articleslist),
        title: 'Search'
      },
      {
        path: 'search/expand/:id',
        loadComponent: () => import('./articles/articles').then(m => m.Articles),
        title: 'Expand'
      },
      {//en aquest cas decideixo agafar el username de la sessió activa
      path:'fav',
      loadComponent: () => import('./fav/fav').then(m => m.Fav),
      title: 'Favorite'
      }
    ]
  },
  {
    path: 'reports',
    children: [
      {
        path:'',
        loadComponent: () => import('./report-list/report-list').then(m => m.ReportList),
        title: "Reports"
      },
      {
        path:'create',
        loadComponent: () => import('./add-report/add-report').then(m => m.AddReport),
        title: "Report create"
      },
      {
        path:'expand/:id',
        loadComponent: () => import('./reports/reports').then(m => m.Reports),
        title: "Report"
      },

    ]
  }
]
