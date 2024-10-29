import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  public name!: string

  @column()
  public sku!: string

  @column()
  public price!: number

  @column()
  public stock!: number

  @column()
  public category!: string | null

  @column()
  public description!: string | null

  @column()
  public image_url!: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}