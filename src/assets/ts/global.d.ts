interface Window {
  lenis: any; // windowにlenisを追加するために指定
}

declare module '*.glsl' {
  const value: string
  export default value
}