const md5 = require('md5')
const fs = require('fs')
// import fs from 'fs'
// console.log('Node version is: ' + process.version);
// console.log('version', process.versions)

const dbPath = '/Users/yunser/data/url/data.json'
const code_prefix = 'open-in-browser5-'

const features = utools.getFeatures()

const demo_urls = [
    {
        id: '',
        title: '百度翻译',
        url: 'https://fanyi.baidu.com/',
    },
    {
        title: 'npm',
        url: 'https://www.npmjs.com/',
    },
    {
        title: 'Github',
        url: 'https://github.com/',
        keywords: ['gh'],
    },
]

let urls = demo_urls

async function main() {
    
    // console.log('urls', JSON.stringify(ur))
    if (fs.existsSync(dbPath)) {
        const jsonContent = fs.readFileSync(dbPath, 'utf-8')
        let jsonData
        try {
            jsonData = JSON.parse(jsonContent)
        }
        catch (err) {
            console.error('JSON 格式解析出错')
            console.error(err)
        }
        if (jsonData) {
            urls = jsonData.data
        }
    }
    
    for (let item of urls) {
        item.id = md5(item.url)
    }
    
    for (let url of urls) {
        utools.setFeature({
            "code": code_prefix + url.id,
            explain: '默认浏览器打开 ' + url.url,
            cmds: [
                url.title,
                ...(url.keywords || []),
            ]
        })
    }
    for (let feature of features) {
        if (!feature.code.includes(code_prefix)) {
            utools.removeFeature(feature.code)
        }
        const isInUrls = !!urls.find(item => code_prefix + item.id == feature.code)
        if (!isInUrls) {
            utools.removeFeature(feature.code)
        }
    }
    
    const features2 = utools.getFeatures()
    
    // console.log('features2', features2)
    
    utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件5', code, type, payload)
        if (code == '链接编辑') {
            window.utools.hideMainWindow()
            window.utools.outPlugin()
            // Note: If you are using VS Code Insiders builds, the URL prefix is vscode-insiders://.
            utools.shellOpenExternal(`vscode://file${dbPath}`)
        }
        else if (code.includes(code_prefix)) {
            const item = urls.find(u => code_prefix + u.id == code)
            if (item) {
                console.log('找到', item)
                utools.shellOpenExternal(item.url)
                // utools.showNotification('hello')
                window.utools.hideMainWindow()
                window.utools.outPlugin()
            }
        }
    })
}

main()

window._plugin = {

    getList() {
        return urls
    },

    getConfigPath() {
        return dbPath
    },

    showPath(path) {
        utools.shellShowItemInFolder(path)
    }
}
