import { RefObject, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type HomeSceneState = "arrival" | "discover" | "learn" | "grow" | "connect";

const SCENE_ORDER: HomeSceneState[] = ["arrival", "discover", "learn", "grow", "connect"];

export function useHomeScrollOrchestration(root: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const scope = root.current;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-draw-line]").forEach((line) => {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1,
          duration: 1.15,
          ease: "power2.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: line, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            if (!isActive) return;
            const scene = SCENE_ORDER[Math.min(index, SCENE_ORDER.length - 1)];
            scope.dataset.activeScene = scene;
          },
        });
      });
    }, scope);

    return () => context.revert();
  }, [root]);
}