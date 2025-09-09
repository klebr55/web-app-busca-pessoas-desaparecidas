import { Variants, Transition } from "framer-motion";

const easeOut: Transition["ease"] = "easeOut";
const easeIn: Transition["ease"] = "easeIn";

export const overlayVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: easeOut } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: easeIn } },
};

export const modalVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: easeOut,
      scale: { type: "spring", stiffness: 220, damping: 24 },
      opacity: { duration: 0.28 },
      y: { duration: 0.32 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 18,
    filter: "blur(6px)",
    transition: { duration: 0.25, ease: easeIn },
  },
};

export const fadeStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const fadeItemUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.25, ease: easeIn } },
};

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 240, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export const listItemStagger = (index: number): any => ({
  opacity: 1,
  y: 0,
  transition: {
    delay: 0.15 + index * 0.04,
    type: "spring",
    stiffness: 240,
    damping: 20,
  },
});

export const listItemInitial = { opacity: 0, y: 18, scale: 0.95 };

export const buttonHover = { y: -3 };
export const buttonTap = { scale: 0.9 };

export const sectionEnter = (delay = 0.15): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.4, ease: easeOut },
  },
  exit: { opacity: 0, y: 12, transition: { duration: 0.25, ease: easeIn } },
});

export const premiumModalVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.92,
    rotateX: 8,
    filter: "blur(8px) saturate(60%)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px) saturate(100%)",
    transition: {
      duration: 0.65,
      ease: easeOut,
      opacity: { duration: 0.4 },
      rotateX: { type: "spring", stiffness: 140, damping: 18 },
      scale: { type: "spring", stiffness: 220, damping: 26 },
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    rotateX: -4,
    filter: "blur(6px) saturate(70%)",
    transition: { duration: 0.28, ease: easeIn },
  },
};
