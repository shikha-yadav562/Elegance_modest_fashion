import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Option "mo:core/Option";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
  type Product = {
    id : Text;
    name : Text;
    price : Nat;
    category : Category;
    description : Text;
    imageUrl : Text;
    sizes : [Size];
    isNewArrival : Bool;
  };

  module Product {
    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.price, product2.price);
    };
  };

  type Testimonial = {
    name : Text;
    rating : Nat;
    message : Text;
  };

  type Category = {
    #ethnicSets;
    #abayas;
    #dresses;
  };

  type Size = {
    #small;
    #medium;
    #large;
    #xLarge;
  };

  let products = Map.empty<Text, Product>();
  let testimonials = Map.empty<Text, Testimonial>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (products.containsKey(product.id)) { Runtime.trap("Product with this ID already exists") };
    products.add(product.id, product);
  };

  public shared ({ caller }) func addTestimonial(id : Text, testimonial : Testimonial) : async () {
    if (testimonials.containsKey(id)) { Runtime.trap("Testimonial with this ID already exists") };
    testimonials.add(id, testimonial);
  };

  public query ({ caller }) func getProductById(id : Text) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(product) { product.category == category });
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (_) { products.remove(id) };
    };
  };
};
