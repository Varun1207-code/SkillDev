import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
    try {
        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // Validate URL
        try {
            new URL(url)
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
        }

        // Fetch the webpage
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        })

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: response.status })
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // Remove unwanted elements but keep structure
        $('script, style, nav, header, footer, .sidebar, .navigation, .ad, .advertisement, iframe, noscript').remove()

        // Try to find main content area
        let content = ''
        const mainSelectors = [
            'main',
            'article',
            '.content',
            '.main-content',
            '#content',
            '#main',
            '.documentation',
            '.doc-content',
            '[role="main"]'
        ]

        for (const selector of mainSelectors) {
            const element = $(selector)
            if (element.length > 0) {
                content = element.html() || ''
                break
            }
        }

        // If no main content found, get body
        if (!content) {
            content = $('body').html() || ''
        }

        // Clean up the content but preserve structure
        const $content = cheerio.load(content)

        // Remove empty paragraphs and divs
        $content('p:empty, div:empty').remove()

        // Add classes to elements for better styling
        $content('h1, h2, h3, h4, h5, h6').each((_, el) => {
            $(el).addClass('doc-heading')
        })
        $content('pre, code').each((_, el) => {
            $(el).addClass('doc-code')
        })
        $content('ul, ol').each((_, el) => {
            $(el).addClass('doc-list')
        })
        $content('a').each((_, el) => {
            $(el).addClass('doc-link')
            // Make external links absolute
            const href = $(el).attr('href')
            if (href && !href.startsWith('http')) {
                const baseUrl = new URL(url)
                const absoluteUrl = new URL(href, baseUrl.origin).toString()
                $(el).attr('href', absoluteUrl)
            }
        })

        content = $content.html() || ''

        // Get page title
        const title = $('title').text() || $('h1').first().text() || 'Documentation'

        return NextResponse.json({
            title,
            content,
            url
        })
    } catch (error) {
        console.error('Fetch docs error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
