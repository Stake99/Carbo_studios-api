/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import ProductsController from '#controllers/http/products_controller'
import AuthController from '#controllers/http/auth_controller'

router.on('/').render('pages/home')

// API routes group without CSRF protection
router.group(() => {
  router.get('/products', [ProductsController, 'index'])
  router.post('/products', [ProductsController, 'store'])
  router.get('/products/:id', [ProductsController, 'show'])
  router.put('/products/:id', [ProductsController, 'update'])
  router.delete('/products/:id', [ProductsController, 'destroy'])
  router.post('/register', [AuthController, 'register']).as('auth.register')
  router.post('/login', [AuthController, 'login']).as('auth.login')
}).prefix('/api')
