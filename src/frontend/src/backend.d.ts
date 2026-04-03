import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    name: string;
    isNewArrival: boolean;
    description: string;
    sizes: Array<Size>;
    imageUrl: string;
    category: Category;
    price: bigint;
}
export interface Testimonial {
    name: string;
    message: string;
    rating: bigint;
}
export enum Category {
    dresses = "dresses",
    abayas = "abayas",
    ethnicSets = "ethnicSets"
}
export enum Size {
    large = "large",
    small = "small",
    xLarge = "xLarge",
    medium = "medium"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addTestimonial(id: string, testimonial: Testimonial): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getProductById(id: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
}
