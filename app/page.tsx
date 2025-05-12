"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, Suspense } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase"
import dynamic from 'next/dynamic'

// Client-only wrapper component to prevent hydration errors
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return <>{children}</>
}

export default function Home() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Mouse position for interactive effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })

      // Smooth follow with spring physics
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Insert the email into the waitlist table
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }])
      
      if (error) throw error
      
      // Success
      setIsSubmitted(true)
      setEmail("")
    } catch (err: any) {
      console.error('Error adding to waitlist:', err)
      setError(err.message || 'Failed to join waitlist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white font-light">
      {/* Cursor follower */}
      <motion.div
        className="fixed w-40 h-40 rounded-full pointer-events-none z-50 opacity-20 mix-blend-difference"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
          left: mouseX,
          top: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Hero Section with Advanced Graphics */}
      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-lines opacity-10"></div>

        {/* Animated lines */}
        <div className="absolute inset-0 overflow-hidden">
          <ClientOnly>
            <AnimatedLines count={10} />
          </ClientOnly>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <ClientOnly>
            <FloatingParticles count={40} />
          </ClientOnly>
        </div>

        {/* Main content with advanced typography */}
        <div className="container px-4 mx-auto z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="overflow-hidden inline-block mb-6 relative"
            >
              <RevealText text="Perfx" />

              {/* Animated underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-white to-transparent absolute bottom-0 left-0"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed">
                24/7 Perpetual futures exchange for currencies
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button
                variant="outline"
                className="group border-white/30 hover:border-white hover:bg-white/5 transition-all rounded-full px-8 py-6 text-lg backdrop-blur-sm"
              >
                <span className="relative overflow-hidden inline-block">
                  <span className="relative z-10">Read Whitepaper</span>
                  <motion.span
                    className="absolute inset-0 bg-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  />
                </span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                className="relative overflow-hidden bg-white text-black hover:bg-white rounded-full px-8 py-6 text-lg backdrop-blur-sm group"
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="relative z-10">Join Waitlist</span>
                <motion.span
                  className="absolute inset-0 bg-gray-200"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Advanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 w-full flex justify-center"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/50 text-sm uppercase tracking-widest">Scroll</p>
            <div className="relative h-16 w-1 overflow-hidden">
              <motion.div
                animate={{
                  y: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-b from-white via-white to-transparent"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section with Monochromatic Cards */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%)`,
            }}
          />
        </div>

        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 relative inline-block">
              The Solution
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-white to-transparent absolute -bottom-2 left-0"
              />
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Onchain Orderbook based perpetual futures exchange for currencies enabling 24/7 margin trading.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MonochromeFeatureCard
              title="24/7 Trading"
              description="Trade anytime, even after traditional markets are closed"
              delay={0}
            />
            <MonochromeFeatureCard
              title="Democratising Access"
              description="Open forex trading to previously restricted regions"
              delay={0.1}
            />
            <MonochromeFeatureCard
              title="Low Cost Trading"
              description="Compared to traditional financial alternatives"
              delay={0.2}
            />
            <MonochromeFeatureCard
              title="Real-time Trading"
              description="Immutable, manipulation-free environment"
              delay={0.3}
            />
            <MonochromeFeatureCard
              title="Hedge Forex Exposure"
              description="Without relying on centralized institutions"
              delay={0.4}
            />
            <MonochromeFeatureCard
              title="Deep Liquidity"
              description="Exchange tailored for high-frequency forex trading"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Market Highlight Section with Advanced Visualization */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-radial from-gray-900/30 to-black"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <svg width="100%" height="100%" className="opacity-5">
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>
        </div>

        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
                Bringing the Largest Financial Market to Solana
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Our innovative approach to funding rates and margin requirements enables trading even after traditional
                markets close, mimicking Trad-Fi OTC's while providing the benefits of decentralization.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px bg-white/20 flex-grow"></div>
                <span className="text-white/60">Perfx</span>
                <div className="h-px bg-white/20 flex-grow"></div>
              </div>
            </motion.div>

            {/* Advanced trading visualization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square"
            >
              <div className="relative w-full h-full">
                <ClientOnly>
                  <MonochromeTradingVisualization />
                </ClientOnly>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waitlist Section with Advanced Effects */}
      <section id="waitlist" className="py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/30"></div>
          <div className="absolute inset-0">
            <ClientOnly>
              <RadialCircles />
            </ClientOnly>
          </div>
        </div>

        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">Join the Waitlist</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-10">
              Be among the first to experience the future of currency trading.
            </p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6 relative"
            >
              {/* Glowing effect behind the form */}
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full blur-xl -z-10"></div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-black/30 backdrop-blur-md border-white/20 focus:border-white text-white h-14 rounded-full px-6"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-white rounded-full px-8 h-14 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Joining..." : "Join Now"}
                  </span>
                  <motion.span
                    className="absolute inset-0 bg-gray-200"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  />
                </Button>
              </div>
              <AnimatePresence>
                {isSubmitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-green-400 text-center font-light"
                  >
                    Thank you for joining our waitlist!
                  </motion.p>
                )}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-400 text-center font-light"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

// Advanced text reveal animation
function RevealText({ text }: { text: string }) {
  return (
    <h1 className="text-7xl md:text-9xl font-serif font-light tracking-tighter flex justify-center overflow-hidden">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 100, opacity: 0, rotateX: 50 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5 + i * 0.1,
            ease: [0.215, 0.61, 0.355, 1], // Cubic bezier for a more sophisticated animation
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  )
}

// Monochrome feature card with advanced animations
interface FeatureCardProps {
  title: string
  description: string
  delay: number
}

function MonochromeFeatureCard({ title, description, delay }: FeatureCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // Mouse hover effect
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-white/5 rounded-2xl blur-xl -z-10"
      ></motion.div>

      <div className="bg-black p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm relative overflow-hidden">
        {/* Animated geometric element */}
        <div className="mb-6 relative">
          <motion.div
            animate={{
              rotate: isHovered ? 90 : 45,
              borderColor: isHovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
            }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="w-12 h-12 border border-white/10 rounded-sm rotate-45"
          />

          <motion.div
            animate={{
              rotate: isHovered ? 0 : 45,
              backgroundColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
            }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-0 left-0 w-8 h-8 bg-white/5 rounded-sm"
          />

          {/* Animated dots */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(4)].map((_, i) => {
              const positions = [
                { left: "3px", top: "3px" },
                { left: "-3px", top: "-3px" },
                { left: "-3px", top: "3px" },
                { left: "3px", top: "-3px" },
              ]

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: i * 0.5,
                  }}
                  className="w-1 h-1 bg-white rounded-full absolute"
                  style={positions[i]}
                ></motion.div>
              )
            })}
          </div>
        </div>

        <motion.h3
          className="text-xl font-medium mb-3"
          animate={{ color: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.9)" }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-gray-400"
          animate={{ color: isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)" }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Animated border */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        ></motion.div>
      </div>
    </motion.div>
  )
}

// Monochrome trading visualization with advanced animations
function MonochromeTradingVisualization() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Sample data for visualization - using fixed values to prevent hydration errors
  const bids = [
    { price: "9.41", amount: "0.5", total: "4.71" },
    { price: "9.40", amount: "1.2", total: "11.28" },
    { price: "9.39", amount: "0.8", total: "7.51" },
    { price: "9.38", amount: "2.5", total: "23.45" },
    { price: "9.37", amount: "1.7", total: "15.93" },
  ]

  return (
    <div className="w-full h-full flex flex-col justify-center backdrop-blur-sm bg-black/20 rounded-2xl border border-white/10 p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 trading-grid opacity-5"></div>

      {/* Header with currency pair */}
      <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              backgroundColor: ["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.5)"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-3 h-3 rounded-full bg-white/50"
          />
          <span className="font-mono text-lg">EUR/USD</span>
        </div>
        <div className="font-mono text-white/80 text-lg">1.12499</div>
      </div>

      {/* Candlestick chart visualization */}
      <div className="h-48 w-full relative overflow-hidden mb-6">
        <div className="absolute inset-0">
          {/* Price line */}
          <motion.div
            initial={{ left: "10%" }}
            animate={{ left: ["10%", "90%", "30%", "70%", "10%"] }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute top-1/2 h-px w-full bg-white/30"
          ></motion.div>

          {/* Candlesticks */}
          <div className="flex justify-between h-full items-end">
            {[...Array(20)].map((_, i) => {
              const isUp = Math.random() > 0.5
              const height = 20 + Math.random() * 60
              const wickHeight = height + Math.random() * 20

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className={`w-2 ${isUp ? "bg-white/70" : "bg-white/30"} relative mx-px`}
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: wickHeight - height }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.05 + 0.2,
                      ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="absolute bottom-full w-px h-0 bg-white/50 left-1/2 -translate-x-1/2"
                  ></motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Order book visualization */}
      <div className="border-t border-white/10 pt-4">
        <div className="text-xs text-white/50 mb-2 flex justify-between">
          <span>PRICE</span>
          <span>AMOUNT</span>
          <span>TOTAL</span>
        </div>

        {/* Bid orders */}
        {[...Array(3)].map((_, i) => {
          const price = (1.0876 - i * 0.0001).toFixed(4)
          const amount = (Math.random() * 10).toFixed(2)
          const total = (Number.parseFloat(price) * Number.parseFloat(amount)).toFixed(2)
          const width = 30 + Math.random() * 70

          return (
            <motion.div
              key={`bid-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="flex justify-between items-center text-xs py-1 relative"
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1 + 0.3,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="absolute right-0 h-full bg-white/5 -z-10"
              ></motion.div>

              <motion.div
                animate={{ opacity: hoveredRow === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white/5 -z-10"
              ></motion.div>

              <span className="text-white/80">{price}</span>
              <span>{amount}</span>
              <span>{total}</span>
            </motion.div>
          )
        })}

        {/* Ask orders */}
        {[...Array(3)].map((_, i) => {
          const price = (1.0877 + i * 0.0001).toFixed(4)
          const amount = (Math.random() * 10).toFixed(2)
          const total = (Number.parseFloat(price) * Number.parseFloat(amount)).toFixed(2)
          const width = 30 + Math.random() * 70

          return (
            <motion.div
              key={`ask-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: (i + 3) * 0.1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="flex justify-between items-center text-xs py-1 relative"
              onMouseEnter={() => setHoveredRow(i + 3)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{
                  duration: 0.5,
                  delay: (i + 3) * 0.1 + 0.3,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="absolute right-0 h-full bg-white/5 -z-10"
              ></motion.div>

              <motion.div
                animate={{ opacity: hoveredRow === i + 3 ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white/5 -z-10"
              ></motion.div>

              <span className="text-white/60">{price}</span>
              <span>{amount}</span>
              <span>{total}</span>
            </motion.div>
          )
        })}
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>
    </div>
  )
}

// Floating particles animation
function FloatingParticles({ count = 20 }) {
  // Pre-compute values with deterministic calculations
  const particles = useMemo(() => {
    return [...Array(count)].map((_, i) => {
      // Use deterministic values based on index
      const seed = i * 0.1
      const size = 1 + (seed % 2) + 0.5
      const initialX = (i * 7) % 100
      const initialY = (i * 13) % 100
      const duration = 20 + (i * 5) % 20
      const opacity = 0.1 + (i * 0.01) % 0.2
      
      return { size, initialX, initialY, duration, opacity, i }
    })
  }, [count])

  return (
    <>
      {particles.map(({ size, initialX, initialY, duration, opacity, i }) => {
        // Use deterministic animation values
        const xOffset1 = ((i * 17) % 100) - 50
        const xOffset2 = ((i * 23) % 100) - 50
        const yOffset1 = ((i * 19) % 100) - 50
        const yOffset2 = ((i * 29) % 100) - 50
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              top: `${initialY}%`,
              opacity: opacity,
            }}
            animate={{
              x: [0, xOffset1, xOffset2, 0],
              y: [0, yOffset1, yOffset2, 0],
              opacity: [opacity, opacity * 2, opacity],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        )
      })}
    </>
  )
}

// Animated lines
function AnimatedLines({ count = 5 }) {
  // Pre-compute deterministic values for lines
  const lines = useMemo(() => {
    return [...Array(count)].map((_, i) => {
      // Use deterministic values based on index
      const isHorizontal = i % 2 === 0
      const position = (i * 17) % 100
      const duration = 15 + (i * 3) % 15
      const delay = (i * 0.7) % 3
      const size = 0.5 + (i * 0.1) % 0.3
      
      return { isHorizontal, position, duration, delay, size, i }
    })
  }, [count])

  return (
    <>
      {lines.map(({ isHorizontal, position, duration, delay, size, i }) => {
        return (
          <motion.div
            key={i}
            className="absolute bg-white/10"
            style={{
              [isHorizontal ? "height" : "width"]: `${size}px`,
              [isHorizontal ? "width" : "height"]: "100%",
              [isHorizontal ? "top" : "left"]: `${position}%`,
            }}
            animate={{
              [isHorizontal ? "left" : "top"]: ["-100%", "200%"],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
              delay,
            }}
          />
        )
      })}
    </>
  )
}

// Radial circles animation for waitlist section
function RadialCircles() {
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/5"
          style={{
            width: `${(i + 1) * 20}%`,
            height: `${(i + 1) * 20}%`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 5 + i,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
