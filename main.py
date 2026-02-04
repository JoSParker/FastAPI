from fastapi import FastAPI,Depends
from models import Product
import database_models
from database import session,engine
app = FastAPI()
database_models.Base.metadata.create_all(bind=engine)

products = [
    Product(id=1, name="Laptop", description="A powerful laptop", price=999.99, quantity=10),
    Product(id=2, name="Smartphone", description="A sleek smartphone", price=889.99, quantity=20),
    Product(id=3, name="Headphones", description="Noise-cancelling headphones", price=199.99, quantity=15),
    Product(id=4, name="Smartwatch", description="A stylish smartwatch", price=299.99, quantity=25)
]
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
def init_db():
    db = session()
    count = db.query(database_models.Product).count()
    if(count==0):
     for product in products:
        db.add(database_models.Product(**product.model_dump()))
     db.commit()
     
init_db()
@app.get("/products")
def get_products(db:session() = Depends(get_db)):
    
    db_products = db.query(database_models.Product).all()
    return (db_products)
@app.get("/products/{id}")
def get_product_by_id(id:int,db:session() = Depends(get_db)):
    db_product=db.query(database_models.Product).filter(database_models.Product.id==id).first()
        
    if db_product: 
            
         return db_product
@app.post("/product")
def add_product(product:Product):
    products.append(product)
    return product
@app.put("/product/{id}")
def update_product(id:int, product:Product):
    for i in range(len(products)):
        if products[i].id==id:
            products[i]=product
            return "prduct added"
    return "no product found"
@app.delete("/product/{id}")
def delete_product(id:int):
    for i in range(len(products)):
        if products[i].id==id:
            del products[i]
            return f"product {id} deleted"
    return "product not there"