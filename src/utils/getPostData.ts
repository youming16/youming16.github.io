import readingTime from 'reading-time'

type Post = {
  title: string
  file: string
  rawContent: () => string
}

export default function getPostData(post: Post) {
  return {
    tag: post.file.split('/').pop().split('.').shift(),
    readingTime: readingTime(post.rawContent()).text,
  }
}
