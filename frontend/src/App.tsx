import React, { useState } from 'react'
import './App.css'

type Product = { id: number; name: string; description?: string; price: number; quantity: number }

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')

  function addProduct(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const f = e.currentTarget
    const idVal = (f.elements.namedItem('id') as HTMLInputElement).value.trim()
    const name = (f.elements.namedItem('name') as HTMLInputElement).value.trim()
    const description = (f.elements.namedItem('description') as HTMLInputElement).value.trim()
    const price = parseFloat((f.elements.namedItem('price') as HTMLInputElement).value) || 0
    const quantity = parseInt((f.elements.namedItem('quantity') as HTMLInputElement).value) || 0
    const id = idVal ? Number(idVal) : (Math.max(0, ...products.map(p=>p.id)) + 1)
    setProducts(prev => [...prev, {id, name, description, price, quantity}])
    f.reset()
  }

  const filtered = products.filter(p=>{
    if(!search) return true
    const t = search.toLowerCase()
    return String(p.id).includes(t) || p.name.toLowerCase().includes(t) || (p.description||'').toLowerCase().includes(t)
  })

  return (
    <div className="app-root">
      <header className="site-header">
        <div className="top-left">
          <div className="total-pill">Total: <span id="total-count">{products.length}</span></div>
        </div>
        <div className="top-right">
          <input id="search" className="search" placeholder="Search by id, name or description..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </header>

      <main className="layout-grid">
        <div className="col-left">
          <section className="card add-card">
            <div className="card-header"><h2>Add Product</h2></div>
            <form onSubmit={addProduct} className="form-row">
              <input name="id" placeholder="ID" />
              <input name="name" placeholder="Name" />
              <input name="description" placeholder="Description" />
              <input name="price" placeholder="Price" />
              <input name="quantity" placeholder="Quantity" className="qty-input" />
              <div className="form-actions"><button className="btn-primary" type="submit">Add</button></div>
            </form>
            <div id="error-banner" className="error-banner">Failed to fetch products</div>
          </section>

          <section className="card products-card">
            <h3>Products</h3>
            <table id="products-table" className="products-table">
              <thead>
                <tr><th>ID</th><th>NAME</th><th>DESCRIPTION</th><th>PRICE</th><th>QUANTITY</th><th>ACTIONS</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="empty-row"><td colSpan={6}>No products found.</td></tr>
                ) : (
                  filtered.map(p=> (
                    <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.description}</td><td>${p.price.toFixed(2)}</td><td>{p.quantity}</td><td>—</td></tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="col-right">
          <section className="card promo-card">
            <h4>Track. Manage. Grow.</h4>
            <p className="promo-text">Streamline your inventory with smart product management that scales with your business.</p>
            <div className="powered">POWERED BY <span className="brand">TELUSKO</span></div>
          </section>

          <div className="avatar-wrap">
            <img src="https://placehold.co/220x220" alt="avatar" className="avatar" />
          </div>
        </aside>
      </main>
    </div>
  )
}
