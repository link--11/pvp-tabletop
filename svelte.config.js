import adapter from '@sveltejs/adapter-static'
import 'dotenv/config'

/** @type {import('@sveltejs/kit').Config} */
const config = {
   kit: {
      adapter: adapter({
         pages: process.env.BUILD_DIR || 'build'
      })
   }
}

export default config
