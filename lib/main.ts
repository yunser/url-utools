import { uid } from 'uid'
const md5 = require('md5')
const fs = require('fs')
// import fs from 'fs'
// console.log('Node version is: ' + process.version);
// console.log('version', process.versions)
console.log('fs', fs, fs.readFileSync)
const code_prefix = 'open-in-browser5-'

const features = utools.getFeatures()

// console.log('features', features)

const dbPath = '/Users/yunser/data/url/data.json'

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
    }
    
    const features2 = utools.getFeatures()
    
    console.log('features2', features2)
    
    utools.onPluginEnter(({ code, type, payload }) => {
        console.log('用户进入插件', code, type, payload)
        if (code.includes(code_prefix)) {
            const item = urls.find(u => code_prefix + u.id == code)
            if (item) {
                console.log('找到', item)
                utools.shellOpenExternal(item.url)
                                window.utools.hideMainWindow()
                    // utools.showNotification('hello')
                    window.utools.outPlugin()
            }
        }
    })
    
    // window.exports = {
    //     'open-in-browser': {
    //         mode: 'none',
    //         args: {
    //             enter: (action) => {
    //                 console.log('action', action)
    //                 // window.utools.hideMainWindow()
    //                 // utools.showNotification('hello')
    //                 // window.utools.outPlugin()
    //             }
    //         }
    //     }
    // }
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
