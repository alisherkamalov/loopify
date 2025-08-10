import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isLoading: false
  }),
  actions: {
    async loadCart() {
      try {
        this.isLoading = true
        const res = await axios.get('https://backendlopify.vercel.app/basket', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.items = res.data.map(p => ({
          ...p,
          offsetX: p.offsetX ?? 0,
          released: p.released ?? false
        }))
      } catch (err) {
        console.error('Ошибка при загрузке корзины', err)
        this.items = []
      } finally {
        this.isLoading = false
      }
    },
    async addToCart(productId) {
      const token = localStorage.getItem('token')
      if (!token) return
      await axios.post(
        'https://backendlopify.vercel.app/basket',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await this.loadCart()
    },
    async removeFromCart(productId) {
      await axios.delete(
        `https://backendlopify.vercel.app/basket/${productId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      this.items = this.items.filter(p => p.productId._id !== productId)
    }
  }
})
