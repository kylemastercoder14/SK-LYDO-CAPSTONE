import React from 'react'
import db from '../lib/db'

const Test = async () => {
	const users = await db.user.findMany();
  return (
	<pre>
	  {JSON.stringify(users, null, 2)}
	</pre>
  )
}

export default Test
