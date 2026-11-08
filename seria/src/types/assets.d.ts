// Webpack asset imports (Remotion bundler): these resolve to URLs at bundle time.
declare module "*.woff2" {
  const url: string;
  export default url;
}
declare module "*.woff" {
  const url: string;
  export default url;
}
declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.svg" {
  const url: string;
  export default url;
}
declare module "*.wav" {
  const url: string;
  export default url;
}
