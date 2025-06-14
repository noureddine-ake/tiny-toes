export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  gender: 'boys' | 'girls';
  sizes: number[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Lightning Bolt Runners',
    description:
      'Super fast sneakers with lightning bolt design. Perfect for active boys who love to run and play.',
    price: 45.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [16, 17, 18, 19],
  },
  {
    id: 2,
    name: 'Rainbow Sparkle Shoes',
    description:
      'Colorful sneakers with sparkly details and rainbow accents. Makes every step magical!',
    price: 42.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [16, 17, 18],
  },
  {
    id: 3,
    name: 'Space Explorer Kicks',
    description:
      'Out-of-this-world sneakers with space theme design. Perfect for future astronauts!',
    price: 48.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [17, 18, 19],
  },
  {
    id: 4,
    name: 'Unicorn Dream Sneakers',
    description:
      'Magical unicorn-themed shoes with pastel colors and glittery horn details.',
    price: 44.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [16, 17, 18, 19],
  },
  {
    id: 5,
    name: 'Superhero Power Shoes',
    description:
      'Channel your inner superhero with these bold and powerful sneakers.',
    price: 46.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [16, 18, 19],
  },
  {
    id: 6,
    name: 'Butterfly Garden Sneakers',
    description:
      'Beautiful butterfly patterns with floral accents. Perfect for nature-loving girls.',
    price: 43.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [16, 17, 19],
  },
  {
    id: 7,
    name: 'Dinosaur Adventure Shoes',
    description:
      'Roar into adventure with these awesome dinosaur-themed sneakers.',
    price: 47.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [17, 18, 19],
  },
  {
    id: 8,
    name: 'Princess Castle Kicks',
    description:
      'Royal sneakers fit for a princess with castle and crown designs.',
    price: 45.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [16, 17, 18],
  },
  {
    id: 9,
    name: 'Ocean Wave Runners',
    description:
      'Surf-inspired sneakers with wave patterns and ocean blue colors.',
    price: 44.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [16, 17, 18, 19],
  },
  {
    id: 10,
    name: 'Fairy Tale Sparklers',
    description:
      'Enchanting sneakers with fairy tale themes and sparkly details.',
    price: 46.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [17, 18, 19],
  },
  {
    id: 11,
    name: 'Robot Tech Sneakers',
    description:
      'Futuristic robot-themed shoes with metallic accents and LED-style designs.',
    price: 49.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'boys',
    sizes: [16, 18, 19],
  },
  {
    id: 12,
    name: 'Mermaid Tail Shoes',
    description:
      'Dive into style with these beautiful mermaid-inspired sneakers.',
    price: 43.99,
    image: '/placeholder.svg?height=300&width=300',
    gender: 'girls',
    sizes: [16, 17, 18, 19],
  },
];
