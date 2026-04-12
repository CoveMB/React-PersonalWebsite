/** @type {import('next').NextConfig} */
const addMarkdownSourceRule = (configuration) => {
  configuration.module.rules.push({
    resourceQuery: /raw/,
    test: /\.md$/i,
    type: "asset/source",
  });

  return configuration;
};

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  webpack: (configuration) => addMarkdownSourceRule(configuration),
};

module.exports = nextConfig;
