const YEAR = new Date().getFullYear()

export default {
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Youming Tan.
        <a id="social-media"href="https://github.com/youming16">Github</a>
        <a id="social-media" href="https://twitter.com/Youming_Tan">Twitter</a>
      </small>
      <style jsx>{`
        footer {
          margin-top: 20rem;
        }
        #social-media {
          float: right;
          margin: 5px 5px;
        }
      `}</style>
    </footer>
  ),
}
