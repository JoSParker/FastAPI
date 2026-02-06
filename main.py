from fastapi import FastAPI,Depends
from models import Product
import database_models
from fastapi.middleware.cors import CORSMiddleware
from database import session,engine
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"]
)
database_models.Base.metadata.create_all(bind=engine)


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
def add_product(product:Product,db:session() =Depends(get_db)):
    db.add(database_models.Product(**product.model_dump()))
    db.commit()
    return product
@app.put("/product/{id}")
def update_product(id:int, product:Product,db:session()=Depends(get_db)):
     db_product=db.query(database_models.Product).filter(database_models.Product.id==id).first()
     if db_product:
            db_product.name=product.name
            db_product.description=product.description
            db_product.price=product.price
            db_product.quantity=product.quantity
            db.commit()
            return product
     return "no product found"
@app.delete("/product/{id}")
def delete_product(id:int,db:session()=Depends(get_db)):
         db_product=db.query(database_models.Product).filter(database_models.Product.id==id).first()
         if db_product:
              db.delete(db_product)
              db.commit()
              return f"product {id} deleted"
         return "product not there"