import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

// process.cwd() 返回Node.js进程的当前工作目录。
const postsDirectory = path.join(process.cwd(), "posts");

/**
 * 异步获取文件，输出排序后的博客
 * gray-matter 库可以解析 markdown文件顶部的元数据部分 (YAML Front Matter)
 */
export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf-8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 演示动态路由
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  /* 
  Returns an array that looks like this:
   [
     {
       params: {
         id: 'ssg-ssr'
       }
     },
     {
       params: {
         id: 'pre-rendering'
       }
     }
   ]
  */

  // 必须返回如上格式的数据，每个对象包含键 params , params 包含 id（因为我们创建的路由的 [id].js）
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
        other: "???"
      }
    };
  });
}

// 通过 id 异步获取数据
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data
  };
}
