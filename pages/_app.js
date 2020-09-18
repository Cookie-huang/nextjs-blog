/**
 * @description To use global CSS, import a CSS file in pages/_app.js.
 * 要使用全局样式，需要这个_app文件
 */

import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
