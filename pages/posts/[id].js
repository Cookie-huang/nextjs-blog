import Layout from "../../components/layout";
import Head from "next/head";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";

// 动态路由 先执行
// 路由访问的 id 必须有存在于这个数组中，不然404路由
export async function getStaticPaths() {
  // paths数组中返回的对象中必须包括键为 id
  const paths = getAllPostIds();

  // 返回包含 { params:{id : xx } } 的数组 paths
  return {
    paths,
    fallback: false // not returned, 404 pages
  };
}

// 服务端渲染
export async function getStaticProps({ params }) {
  // 接收 id，异步获取数据
  const postData = await getPostData(params.id);

  return {
    props: {
      postData
    }
  };
}

// 用数据渲染组件缓存导出
export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
