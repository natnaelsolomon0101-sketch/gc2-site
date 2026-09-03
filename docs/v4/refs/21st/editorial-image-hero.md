# Editorial Image Hero — Default
A hero section with a full-width landscape image above and a top-aligned tagline paired with a right-aligned serif headline, description, and call-to-action buttons below.

install: npx shadcn@latest add "https://21st.dev/r/felipemenezes098/hero-07?api_key=$API_KEY_21ST"

## Component
```tsx
'use client'

import * as React from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import Balancer from 'react-wrap-balancer'

import { cn } from '@/lib/utils'

import { Cta, type CtaProps } from '@/components/ui/hero-07-utils/cta'

export interface Hero07Props {
  tagline: string
  title: string
  description: string
  landscapeImage: string
  landscapeAlt?: string
  animation?: 'none' | 'subtle'
  primaryCTA?: CtaProps
  secondaryCTA?: CtaProps
  variant?: 'standard' | 'compact'
}

const variantStyles = {
  standard: {
    copy: 'pb-20 pt-10 sm:pb-28 sm:pt-12 lg:pb-32',
    tagline: 'text-sm sm:text-base',
    title: 'text-3xl sm:text-4xl md:text-5xl',
    description: 'text-sm sm:text-base',
    header: 'gap-6 sm:gap-8',
    grid: 'gap-10',
  },
  compact: {
    copy: 'pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24',
    tagline: 'text-sm',
    title: 'text-2xl sm:text-3xl md:text-4xl',
    description: 'text-sm',
    header: 'gap-4 sm:gap-5',
    grid: 'gap-8',
  },
} as const

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
}

const mediaItem: Variants = {
  hidden: { opacity: 0, y: -20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
}

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean
  variants?: Variants
  className?: string
  children: React.ReactNode
}>) {
  if (!active) return <div className={className}>{children}</div>

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  )
}

export function Hero07({
  tagline,
  title,
  description,
  landscapeImage,
  landscapeAlt = '',
  animation = 'none',
  primaryCTA,
  secondaryCTA,
  variant = 'standard',
}: Readonly<Hero07Props>) {
  const reduce = useReducedMotion()
  const animate = animation === 'subtle' && !reduce
  const vs = variantStyles[variant]

  const taglineElement = tagline && (
    <p
      className={cn(
        'text-muted-foreground max-w-xs leading-relaxed tracking-tight',
        vs.tagline,
      )}
    >
      <Balancer>{tagline}</Balancer>
    </p>
  )

  const titleElement = title && (
    <h1
      className={cn(
        'text-foreground font-serif font-normal tracking-tight text-balance',
        vs.title,
      )}
    >
      <Balancer>{title}</Balancer>
    </h1>
  )

  const descriptionElement = description && (
    <p
      className={cn(
        'text-muted-foreground max-w-xl leading-relaxed',
        vs.description,
      )}
    >
      <Balancer>{description}</Balancer>
    </p>
  )

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? 'link' }}
        />
      )}
    </div>
  )

  const mediaElement = landscapeImage && (
    <div className="relative w-full overflow-hidden">
      <div
        className={cn(
          'relative overflow-hidden rounded-t-sm',
          'mask-b-from-80% mask-b-to-95%',
        )}
      >
        <div
          aria-hidden
          className="bg-background/15 dark:bg-background/30 pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
        />
        <img
          src={landscapeImage}
          alt={landscapeAlt}
          decoding="async"
          className="aspect-[2/1] w-full object-cover object-center outline outline-black/10 sm:aspect-[9/4] dark:outline-white/10 dark:brightness-[0.97] dark:saturate-[0.92]"
        />
      </div>
    </div>
  )

  return (
    <section className="bg-background relative isolate w-full overflow-hidden">
      <Reveal active={animate} variants={mediaItem} className="w-full">
        {mediaElement}
      </Reveal>

      <motion.div
        className={cn(
          'relative z-10 mx-auto grid max-w-7xl grid-cols-1 px-6 lg:grid-cols-12',
          vs.copy,
          vs.grid,
        )}
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        <Reveal
          active={animate}
          className="flex lg:col-span-4 lg:col-start-1 lg:items-start lg:self-stretch"
        >
          {taglineElement}
        </Reveal>

        <Reveal
          active={animate}
          className={cn(
            'flex flex-col items-start lg:col-span-6 lg:col-start-7',
            vs.header,
          )}
        >
          {titleElement}
          {descriptionElement}
          {ctasElement}
        </Reveal>
      </motion.div>
    </section>
  )
}

export default Hero07;

```

## Demo (usage)
```tsx
import { Hero07 } from '@/components/ui/hero-07'

export default function Hero07Demo() {
  return (
    <Hero07
      tagline="Architecture, interiors, and spaces built to last"
      title="Design-led homes for people who care how a place feels."
      description="From first sketch to final detail, we shape residential projects that balance light, material, and daily life. Thoughtful planning, refined finishes, and a calm build process."
      landscapeImage="https://cdn.21st.dev/assets/mirror/18/18129f9729d7e9fd5393c61d23efb785da4320478b3a878a3e6dd084d86a229d.jpg"
      landscapeAlt="Modern residential architecture"
      animation="subtle"
      primaryCTA={{ ctaEnabled: false, text: 'View projects', link: '', variant: 'default' }}
      secondaryCTA={{ ctaEnabled: false, text: 'Book a consultation', link: '', variant: 'link' }}
    />
  )
}

```

0 of 2 free component retrievals left today. A paid 21st plan makes it unlimited: https://21st.dev/pricing
