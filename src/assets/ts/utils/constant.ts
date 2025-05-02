import { gsap } from "gsap";
// @ts-ignore
import { CustomEase } from "../vendor/CustomEase";

gsap.registerPlugin(CustomEase);

export const EASING = {
  TRANSFORM: CustomEase.create("transform", "M0,0 C0.44,0.05 0.17,1 1,1"),
  MATERIAL: CustomEase.create("material", "M0,0 C0.26,0.16 0.1,1 1,1"),
  OUT_BACK: CustomEase.create("out-back", "0.18, 0.89, 0.32, 1.28")
};

export const DURATION = {
  SHORT: 0.3,
  BASE: 0.5,
  FULL: 2.0,
};