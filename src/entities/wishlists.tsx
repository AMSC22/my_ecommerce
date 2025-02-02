export interface Wishlist {
    id: string,
    user_id: string,
        items: [
            {
                product_id: string,
                name: string,
                image: string,
                currency: string,
                price_per_unit: number,
                total_price: number,
            }
        ],
    total_price: number,
}

export interface Wishlists {
              product_id: string,
              name: string,
              image: string,
              description: string;
              currency: string,
              price_per_unit: number,
              total_price: number,
            }
              