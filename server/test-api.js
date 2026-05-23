const http = require('http')

function post(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body)
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length },
    }, (res) => {
      let body = ''
      res.on('data', c => body += c)
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }))
    })
    req.write(data)
    req.end()
  })
}

async function test() {
  console.log('=== Testing MongoDB Auth API ===\n')

  // Test admin login
  console.log('1. Admin Login Test...')
  const adminLogin = await post('/auth/login', { email: 'sumashreedhar074@gmail.com', password: 'suma@1999' })
  if (adminLogin.status === 200 && adminLogin.body.user?.role === 'admin') {
    console.log('   ✅ Admin login SUCCESS - role:', adminLogin.body.user.role)
  } else {
    console.log('   ❌ Admin login FAILED:', adminLogin.body)
  }

  // Test user signup
  console.log('\n2. User Signup Test...')
  const signup = await post('/auth/signup', { name: 'Test User', email: 'test@example.com', password: 'test123' })
  if (signup.status === 201) {
    console.log('   ✅ Signup SUCCESS - user:', signup.body.user?.name)
  } else if (signup.body.message?.includes('already exists')) {
    console.log('   ✅ User already exists (signup works)')
  } else {
    console.log('   ❌ Signup result:', signup.body)
  }

  // Test user login
  console.log('\n3. User Login Test...')
  const userLogin = await post('/auth/login', { email: 'test@example.com', password: 'test123' })
  if (userLogin.status === 200 && userLogin.body.user?.role === 'customer') {
    console.log('   ✅ User login SUCCESS - role:', userLogin.body.user.role)
  } else {
    console.log('   ❌ User login result:', userLogin.body)
  }

  // Test wrong credentials
  console.log('\n4. Wrong Password Test...')
  const badLogin = await post('/auth/login', { email: 'test@example.com', password: 'wrongpass' })
  if (badLogin.status === 401) {
    console.log('   ✅ Wrong password correctly rejected - 401')
  } else {
    console.log('   ❌ Expected 401, got:', badLogin.status)
  }

  console.log('\n=== All Tests Complete ✅ ===')
}

test().catch(console.error)
