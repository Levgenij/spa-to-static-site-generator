# Static Site Generator

[![npm version](https://badge.fury.io/js/spa-to-static-site-generator.svg)](https://badge.fury.io/js/spa-to-static-site-generator)

A Node.js module designed to generate static HTML files from a Single Page Application (SPA) (or any other type of web page) using Puppeteer. It opens each specified URL in a headless browser, captures the fully rendered HTML content, and saves it as static files. This can be particularly useful for SEO purposes, caching, and improving the initial load performance of your web application.

### Files Created

For each URL in the provided list, the script creates the following:

- Directory Structure: A directory that corresponds to the path of the URL.
- index.html: An HTML file containing the fully rendered content of the page.

For example, if the URLs are https://example.com/, https://example.com/page1, https://example.com/page2, etc., the script will create:

```
output/
├── index.html
├── page1/
│   └── index.html
├── page2/
│   └── index.html
├── about/
│   └── index.html
└── contact/
    └── index.html
```

## Installation

```bash
npm install static-site-generator
```

## Usage

1. Create your SPA build locally or deploy it to production
2. Create a list of URLs to process.
3. Generate the static files (ensure that all assets are correctly linked and served. Please note, this script generates only html files).
4. Create a script file, for example: `generate-static-site.js`
5. Update the code in `generate-static-site.js`:
    ```
    const generateStaticSite = require('spa-to-static-site-generator');
    
    const urls = [
        'http://example.com/page1',
        'http://example.com/page2',
        // Add more URLs as needed
    ];
    
    const outputDir = 'output';
    
    generateStaticSite(urls, outputDir)
        .then(() => {
            console.log('Static site generation complete.');
        })
        .catch(error => {
            console.error('Error generating static site:', error);
        });
    ```
6. Run the script `node generate-static-site.js`
7. Serve the Static Files: Deploy the generated static files to your web server or hosting service, ensuring that all assets are correctly linked and served.
8. If you are using NGINX, prepare your config:
    ```
    location / {
        # Other options
        expires        max;
        try_files      $uri $uri/ /index.html;
    }
    ```

## API
`generateStaticSite(urls, outputDir, [timeout], [retries])`

Generate static HTML files from a list of URLs.

- `urls` (Array<string>): Array of URLs to process.
- `outputDir` (string): Directory to save generated HTML files.
- `[timeout]` (number, optional): Navigation timeout in milliseconds. Default is 60000.
- `[retries]` (number, optional): Number of retry attempts on failure. Default is 3.
- `[makeScreenshots]` if true it will create screenshots of each page

## License
MIT
