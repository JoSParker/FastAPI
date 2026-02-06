// Static sample UI script — does not make network requests.
const sampleProducts = [];
let hasFetched = false;

function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

function showAlert(message, type='success'){
  const container = $('#alert-container');
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.innerHTML = `
    <span class="alert-icon">${type==='success'? '✓':'✕'}</span>
    <span class="alert-message">${message}</span>
    <span class="alert-close">×</span>
  `;
  container.appendChild(alert);
  
  const close = alert.querySelector('.alert-close');
  close.addEventListener('click', ()=> alert.remove());
  
  setTimeout(()=> alert.remove(), 5000);
}

function updateTotal(){
  $('#total-count').textContent = sampleProducts.length;
}

function switchView(viewName){
  $all('.view-section').forEach(v=> v.classList.remove('active'));
  $all('.nav-btn').forEach(b=> b.classList.remove('active'));
  
  const view = $(`#${viewName}-view`);
  const btn = $(`.nav-btn[data-view="${viewName}"]`);
  
  if(view) view.classList.add('active');
  if(btn) btn.classList.add('active');
}

function renderList(filterText=''){
  const tbody = $('#products-table tbody');
  tbody.innerHTML = '';
  
  const filtered = sampleProducts.filter(p=>{
    if(!filterText) return true;
    const t = filterText.toLowerCase();
    return String(p.id).includes(t) || p.name.toLowerCase().includes(t) || (p.description||'').toLowerCase().includes(t);
  });
  
  if(filtered.length===0){
    const tr = document.createElement('tr');
    tr.className = 'empty-row';
    tr.innerHTML = `<td colspan="5">${hasFetched? 'No products found.':'Click "Fetch All Products" to load data'}</td>`;
    tbody.appendChild(tr);
  } else {
    filtered.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p.id}</td><td>${p.name}</td><td>${p.description||'—'}</td><td>$${p.price.toFixed(2)}</td><td>${p.quantity}</td>`;
      tbody.appendChild(tr);
    });
  }
  updateTotal();
}

function simulateFetch(){
  // Simulate network delay
  setTimeout(()=>{
    // Simulate random failure (30% chance)
    if(Math.random() < 0.3){
      showAlert('Failed to fetch products', 'error');
      hasFetched = true;
      renderList();
    } else {
      // Load sample products
      sampleProducts.length = 0;
      sampleProducts.push(
        {id:1, name:"Laptop", description:"A powerful laptop", price:999.99, quantity:10},
        {id:2, name:"Smartphone", description:"A sleek smartphone", price:889.99, quantity:20},
        {id:3, name:"Headphones", description:"Noise-cancelling headphones", price:199.99, quantity:15},
        {id:4, name:"Smartwatch", description:"A stylish smartwatch", price:299.99, quantity:25}
      );
      hasFetched = true;
      renderList($('#search').value.trim());
      showAlert('Products fetched successfully', 'success');
    }
  }, 800);
}

function handleAdd(e){
  e.preventDefault();
  const form = e.target;
  
  setTimeout(()=>{
    // Simulate random failure (20% chance)
    if(Math.random() < 0.2){
      showAlert('Failed to add product', 'error');
    } else {
      const idVal = form.querySelector('input[name="id"]').value.trim();
      const name = form.querySelector('input[name="name"]').value.trim();
      const description = form.querySelector('input[name="description"]').value.trim();
      const price = parseFloat(form.querySelector('input[name="price"]').value) || 0;
      const quantity = parseInt(form.querySelector('input[name="quantity"]').value) || 0;
      
      if(!name){
        showAlert('Name is required', 'error');
        return;
      }
      
      const id = idVal? Number(idVal): (Math.max(0,...sampleProducts.map(p=>p.id))+1);
      sampleProducts.push({id, name, description, price, quantity});
      renderList($('#search').value.trim());
      showAlert(`Product "${name}" added successfully`, 'success');
      form.reset();
    }
  }, 600);
}

function handleUpdate(e){
  e.preventDefault();
  const form = e.target;
  
  setTimeout(()=>{
    const id = Number(form.querySelector('input[name="id"]').value);
    const p = sampleProducts.find(x=> x.id === id);
    
    if(!p){
      showAlert(`Product with ID ${id} not found`, 'error');
      return;
    }
    
    // Simulate random failure (20% chance)
    if(Math.random() < 0.2){
      showAlert('Failed to update product', 'error');
      return;
    }
    
    const name = form.querySelector('input[name="name"]').value.trim();
    const description = form.querySelector('input[name="description"]').value.trim();
    const price = form.querySelector('input[name="price"]').value;
    const quantity = form.querySelector('input[name="quantity"]').value;
    
    if(name) p.name = name;
    if(description) p.description = description;
    if(price) p.price = parseFloat(price);
    if(quantity) p.quantity = parseInt(quantity);
    
    renderList($('#search').value.trim());
    showAlert(`Product ID ${id} updated successfully`, 'success');
    form.reset();
  }, 600);
}

function handleDelete(e){
  e.preventDefault();
  const form = e.target;
  
  setTimeout(()=>{
    const id = Number(form.querySelector('input[name="id"]').value);
    const idx = sampleProducts.findIndex(x=> x.id === id);
    
    if(idx === -1){
      showAlert(`Product with ID ${id} not found`, 'error');
      return;
    }
    
    // Simulate random failure (20% chance)
    if(Math.random() < 0.2){
      showAlert('Failed to delete product', 'error');
      return;
    }
    
    const productName = sampleProducts[idx].name;
    sampleProducts.splice(idx, 1);
    renderList($('#search').value.trim());
    showAlert(`Product "${productName}" deleted successfully`, 'success');
    form.reset();
  }, 600);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderList();
  
  // Navigation
  $all('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> switchView(btn.dataset.view));
  });
  
  // Fetch button
  const fetchBtn = $('#fetch-btn');
  if(fetchBtn){
    fetchBtn.addEventListener('click', ()=>{
      fetchBtn.disabled = true;
      fetchBtn.textContent = 'Fetching...';
      simulateFetch();
      setTimeout(()=>{
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Fetch All Products';
      }, 1000);
    });
  }
  
  // Search
  const search = $('#search');
  if(search){
    search.addEventListener('input', ()=> renderList(search.value.trim()));
  }
  
  // Forms
  const addForm = $('#add-form');
  if(addForm) addForm.addEventListener('submit', handleAdd);
  
  const updateForm = $('#update-form');
  if(updateForm) updateForm.addEventListener('submit', handleUpdate);
  
  const deleteForm = $('#delete-form');
  if(deleteForm) deleteForm.addEventListener('submit', handleDelete);
});
