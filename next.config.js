/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    env: {
        DEBUG: true
    }
}

module.exports = nextConfig
