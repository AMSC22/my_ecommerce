export interface Cart {
    id: string,
    user_id: string,
        items: [
            {
                product_id: string,
                quantity: number,
                name: string,
                image: string,
                unity?: string,  // Représente l'unité de mésure comme le Kg, g, etc..
                currency: string,
                price_per_unit: number,
                total_price: number,
            }
        ],
    total_price: number,
}

export interface Carts {
              product_id: string,
              quantity: number,
              name: string,
              image: string,
              unity?: string,  // Représente l'unité de mésure comme le Kg, g, etc..
              currency: string,
              price_per_unit: number,
              total_price: number,
            }