const target = import.meta.env.VITE_LIMITLESS_WEB

function get (endpoint, callback) {

   fetch(target + endpoint, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
      }

   })
      .then(res => res.json())
      .then(res => callback(res))
      .catch(err => {
         console.error(err)
      })
}

function post (endpoint, body, callback) {

   fetch(target + endpoint, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)

   })
      .then(res => res.json())
      .then(res => callback(res))
      .catch(err => {
         console.error(err)
      })
}

export { get, post }