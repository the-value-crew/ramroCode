const fs = require('fs')
const shiki = require('shiki')
const { getSVGRenderer } = require('shiki-renderer-svg')
    ; (async () => {
        const highlighter = await shiki.getHighlighter({
            theme: 'nord'
        })
        const svgRenderer = await getSVGRenderer({
            bg: '#2E3440',
            fontFamily: 'Droid Sans Mono',
            fontSize: 12
        })
        const code = 'var a = "Hello World";'
        const tokens = highlighter.codeToThemedTokens(code, 'js')
        const out = svgRenderer.renderToSVG(tokens)
        fs.writeFileSync('svg.svg', out)
        console.log('done: svg.svg')
    })()