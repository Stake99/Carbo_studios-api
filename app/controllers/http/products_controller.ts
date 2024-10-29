import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  private async isValidImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url)
      const contentType = response.headers.get('content-type')
      return response.ok && (contentType?.startsWith('image/') ?? false)
    } catch (error) {
      return false
    }
  }

  // Fetch all products
  public async index({ response }: HttpContext) {
    try {
      const products = await Product.all()
      return response.json(products)
    } catch (error) {
      return response.status(500).json({
        message: 'Error fetching products',
        error: error.message,
      })
    }
  }

  // Create a new product
  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'sku', 'price', 'stock', 'category', 'description', 'image_url'])

      // Validate required fields
      if (!data.name || !data.sku || !data.price || !data.stock) {
        return response.status(400).json({
          message: 'Name, SKU, price, and stock are required fields',
        })
      }

      // Validate image URL if provided
      if (data.image_url) {
        const isValidImage = await this.isValidImageUrl(data.image_url)
        if (!isValidImage) {
          return response.status(400).json({
            message: 'Invalid image URL. Please provide a valid image URL.',
          })
        }
      }

      const product = new Product()
      product.name = data.name
      product.sku = data.sku
      product.price = data.price
      product.stock = data.stock
      product.category = data.category
      product.description = data.description
      product.image_url = data.image_url

      await product.save()

      return response.status(201).json(product)
    } catch (error) {
      return response.status(500).json({
        message: 'Error creating product',
        error: error.message,
      })
    }
  }

  // Fetch a single product by ID
  public async show({ params, response }: HttpContext) {
    try {
      const product = await Product.find(params.id)

      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }

      return response.json(product)
    } catch (error) {
      return response.status(500).json({
        message: 'Error fetching product',
        error: error.message,
      })
    }
  }

  // Update an existing product by ID
  public async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.find(params.id)

      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }

      const data = request.only(['name', 'sku', 'price', 'stock', 'category', 'description', 'image_url'])

      if (!data.name || !data.sku || !data.price || !data.stock) {
        return response.status(400).json({
          message: 'Name, SKU, price, and stock are required fields',
        })
      }

      // Validate new image URL if provided
      if (data.image_url && data.image_url !== product.image_url) {
        const isValidImage = await this.isValidImageUrl(data.image_url)
        if (!isValidImage) {
          return response.status(400).json({
            message: 'Invalid image URL. Please provide a valid image URL.',
          })
        }
      }

      product.merge(data)
      await product.save()

      return response.json(product)
    } catch (error) {
      return response.status(500).json({
        message: 'Error updating product',
        error: error.message,
      })
    }
  }

  // Delete a product by ID
  public async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.find(params.id)

      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }

      await product.delete()

      return response.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting product',
        error: error.message,
      })
    }
  }
}
