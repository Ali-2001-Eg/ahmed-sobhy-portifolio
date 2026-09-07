'use client';

import * as React from 'react';
import Matter from 'matter-js';
import { cn } from '@/lib/utils';

/**
 * A single body rendered inside the physics container.
 * `label` is required; everything else tunes the look of the default renderers.
 */
export interface PhysicsItem {
  id: string;
  label: string;
  /** Secondary line — only drawn by the `card` variant (and by `tag` if provided). */
  subtitle?: string;
  /** Any CSS color. Drives border/text/glow of the default renderers. */
  color?: string;
  /** Small leading glyph (emoji or a lucide icon element). */
  icon?: React.ReactNode;
  /** Compact stat chips shown at the bottom of a `card`. */
  meta?: { label: string; value: string }[];
  /** Makes the whole body clickable (click is suppressed after a drag). */
  href?: string;
}

export type PhysicsVariant = 'tag' | 'card';

export interface FallingPhysicsContainerProps {
  items: PhysicsItem[];
  /** `tag` = lightweight pills, `card` = larger project cards. Default `tag`. */
  variant?: PhysicsVariant;
  /** Height of the play area in px. Default 420 (`tag`) / 560 (`card`). */
  height?: number;
  className?: string;
  /** Downward gravity. Default 1. */
  gravity?: number;
  /** Bounciness, 0–1. Default 0.55. */
  restitution?: number;
  /** Surface friction. Default 0.25. */
  friction?: number;
  /** Vertical gap between staggered spawn rows, in px. Default 30. */
  spawnStagger?: number;
  /** How many bodies spawn side by side per row above the container. Default 3. */
  itemsPerSpawnRow?: number;
  /** Replace the default body markup entirely. */
  renderItem?: (item: PhysicsItem, variant: PhysicsVariant) => React.ReactNode;
}

const WALL_THICKNESS = 240;
// Small inset so a rotated pill resting against a wall isn't clipped by overflow.
const WALL_INSET = 6;

export function FallingPhysicsContainer({
  items,
  variant = 'tag',
  height,
  className,
  gravity = 1,
  restitution = 0.55,
  friction = 0.25,
  spawnStagger = 30,
  itemsPerSpawnRow = 3,
  renderItem,
}: FallingPhysicsContainerProps) {
  const sceneRef = React.useRef<HTMLDivElement | null>(null);
  const nodeRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const draggedRef = React.useRef(false);

  const areaHeight = height ?? (variant === 'card' ? 560 : 420);

  // Users who ask for less motion get a plain, static layout instead.
  const reducedMotion = usePrefersReducedMotion();
  // Only run the simulation while the section is actually on screen.
  const [inView, setInView] = React.useState(false);
  const active = inView && !reducedMotion;

  React.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    // Latch on first reveal: the simulation starts once and then keeps its
    // state, rather than re-dropping every time the section scrolls past.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(scene);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!active) return;
    const scene = sceneRef.current;
    if (!scene) return;

    const { Engine, Runner, Composite, Bodies, Body, Mouse, MouseConstraint, Events } = Matter;

    const width = scene.clientWidth;
    if (!width) return;

    // ---- Measure the real DOM nodes so bodies match their rendered size ----
    const nodes = nodeRefs.current.slice(0, items.length).filter(Boolean) as HTMLDivElement[];
    if (nodes.length !== items.length) return;
    // A body wider than the container can never settle between the walls, so cap
    // each node first and let its text wrap. Matters on narrow/mobile layouts.
    const maxItemWidth = Math.max(width - 2 * WALL_INSET - 16, 80);
    for (const node of nodes) node.style.maxWidth = `${maxItemWidth}px`;
    const sizes = nodes.map((node) => ({
      w: Math.max(Math.min(node.offsetWidth, maxItemWidth), 1),
      h: Math.max(node.offsetHeight, 1),
    }));

    const engine = Engine.create();
    engine.gravity.y = gravity;
    // Extra iterations keep stacked pills from jittering apart.
    engine.positionIterations = 8;
    engine.velocityIterations = 8;

    const makeWalls = (w: number, h: number) => [
      // floor
      Bodies.rectangle(w / 2, h + WALL_THICKNESS / 2, w * 3, WALL_THICKNESS, { isStatic: true }),
      // left / right
      Bodies.rectangle(-WALL_THICKNESS / 2 + WALL_INSET, h / 2, WALL_THICKNESS, h * 6, {
        isStatic: true,
      }),
      Bodies.rectangle(w + WALL_THICKNESS / 2 - WALL_INSET, h / 2, WALL_THICKNESS, h * 6, {
        isStatic: true,
      }),
    ];

    // Use the box's real height so a responsive container still gets a correct floor.
    const boxHeight = scene.clientHeight || areaHeight;
    let walls = makeWalls(width, boxHeight);
    Composite.add(engine.world, walls);

    // ---- Bodies, spawned in staggered rows above the container ----
    const tallest = Math.max(...sizes.map((s) => s.h));
    const bodies = items.map((item, i) => {
      const { w, h } = sizes[i];
      const col = i % itemsPerSpawnRow;
      const row = Math.floor(i / itemsPerSpawnRow);
      const slot = width / itemsPerSpawnRow;
      // Spread across the width, jittered so they don't fall in perfect columns.
      const x = clamp(
        slot * col + slot / 2 + (Math.random() - 0.5) * slot * 0.5,
        w / 2 + 4,
        width - w / 2 - 4
      );
      const y = -h / 2 - row * (tallest + spawnStagger) - 40;

      const body = Bodies.rectangle(x, y, w, h, {
        restitution,
        friction,
        frictionAir: 0.02,
        chamfer: { radius: Math.min(variant === 'card' ? 16 : h / 2, h / 2, w / 2) },
      });
      Body.setAngle(body, (Math.random() - 0.5) * 0.4);
      return body;
    });
    Composite.add(engine.world, bodies);

    // ---- Drag support ----
    const mouse = Mouse.create(scene);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);

    // Matter grabs the wheel and every touch move, which would trap page scroll
    // inside the container. Rebind them so the page stays scrollable and we only
    // swallow a touch move while a body is genuinely being held.
    const m = mouse as unknown as Record<string, (e: Event) => void>;
    scene.removeEventListener('wheel', m.mousewheel);
    scene.removeEventListener('DOMMouseScroll', m.mousewheel);
    scene.removeEventListener('touchstart', m.mousedown);
    scene.removeEventListener('touchmove', m.mousemove);
    scene.removeEventListener('touchend', m.mouseup);

    const onTouchStart = (e: TouchEvent) => m.mousedown(e);
    const onTouchMove = (e: TouchEvent) => {
      if (mouseConstraint.body) e.preventDefault();
      m.mousemove(e);
    };
    const onTouchEnd = (e: TouchEvent) => m.mouseup(e);
    scene.addEventListener('touchstart', onTouchStart, { passive: true });
    scene.addEventListener('touchmove', onTouchMove, { passive: false });
    scene.addEventListener('touchend', onTouchEnd, { passive: true });

    // Distinguish a click from a drag so `href` items don't navigate on release.
    const onStartDrag = () => {
      draggedRef.current = false;
    };
    const onMoveDrag = () => {
      if (mouseConstraint.body) draggedRef.current = true;
    };
    Events.on(mouseConstraint, 'startdrag', onStartDrag);
    Events.on(mouseConstraint, 'mousemove', onMoveDrag);

    // ---- Paint: copy body transforms onto the DOM nodes each frame ----
    let frame = 0;
    const draw = () => {
      for (let i = 0; i < bodies.length; i++) {
        const node = nodes[i];
        const body = bodies[i];
        if (!node) continue;
        const { w, h } = sizes[i];
        node.style.transform = `translate3d(${body.position.x - w / 2}px, ${
          body.position.y - h / 2
        }px, 0) rotate(${body.angle}rad)`;
        node.style.opacity = '1';
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    const runner = Runner.create();
    Runner.run(runner, engine);

    // Anything flung out of bounds gets dropped back in from the top.
    const onAfterUpdate = () => {
      const w = scene.clientWidth;
      for (const body of bodies) {
        const out =
          body.position.y > (scene.clientHeight || areaHeight) + 400 ||
          body.position.x < -300 ||
          body.position.x > w + 300;
        if (out) {
          Body.setPosition(body, { x: w / 2 + (Math.random() - 0.5) * w * 0.4, y: -80 });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        }
      }
    };
    Events.on(engine, 'afterUpdate', onAfterUpdate);

    // ---- Keep walls in sync with a resized container ----
    const ro = new ResizeObserver(() => {
      const w = scene.clientWidth;
      if (!w) return;
      Composite.remove(engine.world, walls);
      walls = makeWalls(w, scene.clientHeight || areaHeight);
      Composite.add(engine.world, walls);
    });
    ro.observe(scene);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      Events.off(engine, 'afterUpdate', onAfterUpdate);
      Events.off(mouseConstraint, 'startdrag', onStartDrag);
      Events.off(mouseConstraint, 'mousemove', onMoveDrag);
      scene.removeEventListener('touchstart', onTouchStart);
      scene.removeEventListener('touchmove', onTouchMove);
      scene.removeEventListener('touchend', onTouchEnd);
      scene.removeEventListener('mousedown', m.mousedown);
      scene.removeEventListener('mousemove', m.mousemove);
      scene.removeEventListener('mouseup', m.mouseup);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [
    active,
    items,
    variant,
    areaHeight,
    gravity,
    restitution,
    friction,
    spawnStagger,
    itemsPerSpawnRow,
  ]);

  const body = (item: PhysicsItem) =>
    renderItem ? renderItem(item, variant) : <DefaultBody item={item} variant={variant} />;

  // Static, readable fallback for reduced-motion users.
  if (reducedMotion) {
    return (
      <div className={cn('flex flex-wrap items-start gap-3', className)}>
        {items.map((item) => (
          <div key={item.id}>{body(item)}</div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sceneRef}
      style={{ height: areaHeight }}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl select-none touch-pan-y',
        className
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          style={{ willChange: 'transform', opacity: active ? 0 : 1 }}
          className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
          onClickCapture={(e) => {
            if (draggedRef.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          {body(item)}
        </div>
      ))}
    </div>
  );
}

/** Default look for both variants, built on the site's glass/token styling. */
function DefaultBody({ item, variant }: { item: PhysicsItem; variant: PhysicsVariant }) {
  const color = item.color ?? 'hsl(var(--primary))';

  if (variant === 'tag') {
    return (
      <div
        className="glass flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-sm font-semibold shadow-lg [&>svg]:shrink-0"
        style={{ borderColor: color, color, boxShadow: `0 0 24px -12px ${color}` }}
      >
        {item.icon}
        <span>{item.label}</span>
        {item.subtitle && (
          <span className="text-xs font-normal text-muted-foreground">{item.subtitle}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className="glass w-[240px] space-y-3 rounded-2xl p-5 shadow-xl"
      style={{ borderColor: color, boxShadow: `0 0 40px -20px ${color}` }}
    >
      <div className="flex items-center gap-2" style={{ color }}>
        {item.icon}
        <p className="text-[10px] font-bold uppercase tracking-widest">Case Study</p>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-foreground">{item.label}</h3>
      {item.subtitle && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.subtitle}</p>
      )}
      {item.meta && item.meta.length > 0 && (
        <div className="flex gap-4 border-t border-white/10 pt-3">
          {item.meta.map((stat) => (
            <div key={stat.label}>
              <p className="text-[10px] uppercase text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-bold" style={{ color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
