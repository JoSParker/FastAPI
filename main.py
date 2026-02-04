from fastapi import FastAPI
from models import Product
app = FastAPI()


products = [
    Product(id=1, name="Laptop", description="A powerful laptop", price=999.99, quantity=10),
    Product(id=2, name="Smartphone", description="A sleek smartphone", price=889.99, quantity=20),
    Product(id=3, name="Headphones", description="Noise-cancelling headphones", price=199.99, quantity=15),
    Product(id=4, name="Smartwatch", description="A stylish smartwatch", price=299.99, quantity=25)
]
@app.get("/products")
def get_products():
    
    return (products)
@app.get("/products/{id}")
def get_product_by_id(id:int):
    for product in products:
        if product.id==id: 
            
         return products[id-1]
@app.post("/product")
def add_product(product:Product):
    products.append(product)
    return product
