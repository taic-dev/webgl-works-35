interface Window {
  lenis: any; // windowにlenisを追加するために指定
  isSp: boolean
}

declare module '*.glsl' {
  const value: string
  export default value
}