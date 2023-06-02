/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: false,
    env: {
        DEBUG: false
    }
}

module.exports = nextConfig
