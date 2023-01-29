const YEAR = new Date().getFullYear()

export default {
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Youming Tan.
        <a href="/feed.xml">RSS</a>
      </small>
      <style jsx>{`
        footer {
          margin-buttom: 1rem;
        }
        a {
          float: right;
        }
      `}</style>
    </footer>
  ),
}
