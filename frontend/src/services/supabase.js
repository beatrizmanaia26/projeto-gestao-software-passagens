import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lzweeacgmykevnnhbvko.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6d2VlYWNnbXlrZXZubmhidmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI5MDgsImV4cCI6MjA4ODQ0ODkwOH0.uClrynmRcCt8OvjfotSzECKuJ9rK3g1UWun28kY1z-0'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções para o carrinho
export const cartService = {
  async getCartItems(userId) {
    // Buscar ou criar carrinho
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (cartError) throw cartError

    // Se não existe, criar
    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (createError) throw createError
      cart = newCart
    }

    // Buscar itens do carrinho com JOIN
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        trips (*),
        trip_seats (*),
        trip_cabins (*)
      `)
      .eq('cart_id', cart.id)

    if (itemsError) throw itemsError

    return items || []
  },

  async removeItem(itemId) {
    // Buscar item para pegar seat_id/cabin_id
    const { data: item, error: fetchError } = await supabase
      .from('cart_items')
      .select('seat_id, cabin_id')
      .eq('id', itemId)
      .single()

    if (fetchError) throw fetchError

    // Deletar item
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) throw deleteError

    // Restaurar disponibilidade
    if (item.seat_id) {
      await supabase
        .from('trip_seats')
        .update({ available: true })
        .eq('id', item.seat_id)
    }

    if (item.cabin_id) {
      await supabase
        .from('trip_cabins')
        .update({ available: true })
        .eq('id', item.cabin_id)
    }

    return { success: true }
  }
}

// Made with Bob
