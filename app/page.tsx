import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Kids playing with colorful sneakers"
          fill
          className="aspect-auto"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-500/70 to-orange-400/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Cool Kids
            <span className="block text-yellow-300">Sneakers</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Step into style with our amazing collection of trendy sneakers designed just for kids!
          </p>

          <div className="pt-8">
            <Link href="/catalog">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Discover Our Products
              </Button>
            </Link>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 animate-bounce">
            <div className="w-16 h-16 bg-yellow-400 rounded-full opacity-70" />
          </div>
          <div className="absolute bottom-32 right-16 animate-pulse">
            <div className="w-12 h-12 bg-pink-400 rounded-full opacity-60" />
          </div>
          <div className="absolute top-1/3 right-20 animate-bounce delay-300">
            <div className="w-8 h-8 bg-blue-400 rounded-full opacity-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
