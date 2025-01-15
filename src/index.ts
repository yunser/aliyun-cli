#! /usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import { getEcsRegionInstances } from './ecs';
import { table } from 'table'
import * as moment from 'moment'
import { getRdsRegionInstances } from './rds';
import { getDomainList } from './domain';
import { getBillingInfo } from './billing';
import { getCertList } from './cert';
import { getTencentServerRegionInstances } from './tencent-server';
import { getTencentMysqlRegionInstances } from './tencent-mysql';
import { getTencentLighthouseRegionInstances } from './tencent-lighthouse';
import { getCdnCertList } from './cdnCert';
import { getRedisRegionInstances } from './redis';
// import * as commander from 'commander'
const commander = require('commander')

const USER_HOME = process.env.HOME || process.env.USERPROFILE

let yunserFolder = path.resolve(USER_HOME, '.yunser')
if (!fs.existsSync(yunserFolder)) {
    fs.mkdirSync(yunserFolder)
}

let appFolder = path.resolve(yunserFolder, 'aliyun-cli')
if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
}

let dataFolder = path.resolve(appFolder, 'data')
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder)
}

const objList2Table = (list: object[]) => {
    const item0 = list[0]
    const fields = Object.keys(item0)
    const rows: any[] = []
    for (let item of list) {
        const row: any[] = []
        for (let field of fields) {
            row.push(item[field])
        }
        rows.push(row)
    }
    return [
        fields,
        ...rows,
    ]
}

function showTencentServerList(list) {
    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(item.ExpiredTime).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(item.ExpiredTime)
            // // 公网 IP
            // const publicIp = item.publicIpAddress.ipAddress.join(',')
            // // 弹性 IP
            // const eipIp = item.eipAddress.ipAddress

            return {
                Name: item.InstanceName,
                // 'IP': publicIp || eipIp, // TODO 暂时只显示一个
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showTencentMysqlList(list) {
    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(item.DeadlineTime).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(item.DeadlineTime)
            // // 公网 IP
            // const publicIp = item.publicIpAddress.ipAddress.join(',')
            // // 弹性 IP
            // const eipIp = item.eipAddress.ipAddress

            return {
                Name: item.InstanceName,
                // 'IP': publicIp || eipIp, // TODO 暂时只显示一个
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showEcsList(list) {

    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(item.expiredTime).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(item.expiredTime)
            // 公网 IP
            const publicIp = item.publicIpAddress.ipAddress.join(',')
            // 弹性 IP
            const eipIp = item.eipAddress.ipAddress

            return {
                Name: item.instanceName,
                'IP': publicIp || eipIp, // TODO 暂时只显示一个
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showRedisList(list) {
    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(item.endTime).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(item.endTime)
            // // 公网 IP
            // const publicIp = item.publicIpAddress.ipAddress.join(',')
            // // 弹性 IP
            // const eipIp = item.eipAddress.ipAddress

            return {
                Name: item.instanceName,
                // 'IP': publicIp || eipIp, // TODO 暂时只显示一个
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showRdsList(list) {

    const viewList = list
    .sort((a, b) => {
        function score(item) {
            return - moment(item.expireTime).toDate().getTime()
        }
        return score(b) - score(a)
    })
    .map(item => {
        const expiredTime = moment(item.expireTime)
        return {
            Name: item.DBInstanceDescription,
            'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
        }
    })
    console.log(table(objList2Table(viewList)))
}

function showDomainList(list) {

    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(item.ExpirationDate).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(item.ExpirationDate)
            return {
                Name: item.DomainName,
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showCertList(list) {

    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(new Date(item.certEndTime)).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(new Date(item.certEndTime))
            return {
                Domain: item.domain,
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showCdnCertList(list) {
    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - moment(new Date(item.certExpireTime)).toDate().getTime()
            }
            return score(b) - score(a)
        })
        .map(item => {
            const expiredTime = moment(new Date(item.certExpireTime))
            return {
                Domain: item.domainName,
                'Expire Time': expiredTime.format('YYYY-MM-DD HH:mm:ss'),
            }
        })
    console.log(table(objList2Table(viewList)))
}

function showBillingList(list) {

    const viewList = list
        .sort((a, b) => {
            function score(item) {
                return - parseFloat(item.availableAmount.replace(/,/, ''))
            }
            return score(b) - score(a)
        })
        .map(item => {
            return {
                Name: item.name,
                'Available Amount': parseFloat(item.availableAmount.replace(/,/, '')).toFixed(2),
            }
        })
    console.log(table(objList2Table(viewList)))
}

const content = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
const pkg = JSON.parse(content)
const verson = pkg.version

commander
    .version('v' + verson)
    .description('Aliyun cli.')

commander
    .option('-v, --version', 'show version')

commander
    .helpOption('-h, --HELP')

const accessKeysPath = path.resolve(appFolder, 'accessKeys.json')

commander
    .command('init')
    .description('Initial')
    .action(async function (folder) {
        if (fs.existsSync(accessKeysPath)) {
            console.log(`accessKeys.json is exits`)
            return
        }

        const template = {
            "version": "1.0.0",
            "accessKeys": [
                {
                    "name": "NAME",
                    "accessKeyId": "ACCESS_KEY_ID",
                    "accessKeySecret": "ACCESS_KEY_SECRET",
                    "ecs": {
                        "regions": ["cn-beijing"]
                    },
                    "rds": {
                        "regions": ["cn-beijing"]
                    },
                    "domain": {},
                    "billing": {},
                    "cert": {}
                }
            ]
        }
        fs.writeFileSync(accessKeysPath, JSON.stringify(template, null, 4), 'utf-8')
        console.log(`Template created, path: ${accessKeysPath}`)
    })

commander
    .command('run')
    .description('Run tasks')
    .action(async function () {
        if (!fs.existsSync(accessKeysPath)) {
            console.log(`Config file accessKeys.json is not found.`)
            console.log('Run `aliyun init` to generate it, and edit.')
            return
        }

        const content = fs.readFileSync(accessKeysPath, 'utf-8')
        const db = JSON.parse(content)

        const infoPath = path.resolve(dataFolder, 'info.json')
        const ecsResultPath = path.resolve(dataFolder, 'aliyun-ecs.json')
        const redisResultPath = path.resolve(dataFolder, 'aliyun-redis.json')
        const rdsResultPath = path.resolve(dataFolder, 'aliyun-rds.json')
        const domainResultPath = path.resolve(dataFolder, 'aliyun-domain.json')
        const billingResultPath = path.resolve(dataFolder, 'aliyun-billing.json')
        const certResultPath = path.resolve(dataFolder, 'aliyun-cert.json')
        const cdnCertResultPath = path.resolve(dataFolder, 'aliyun-cdnCert.json')
        const tencentServerResultPath = path.resolve(dataFolder, 'tencent-server.json')
        const tencentMysqlResultPath = path.resolve(dataFolder, 'tencent-mysql.json')
        const tencentLighthouseResultPath = path.resolve(dataFolder, 'tencent-lighthouse.json')

        let ecsResults = []
        let redisResults = []
        let rdsResults = []
        let domainResults = []
        let billingResults = []
        let certResults = []
        let cdnCertResults = []
        let tencentServerResults = []
        let tencentMysqlResults = []
        let tencentLighthouseResults = []

        function handleList(list: any[], accessKey: any) {
            for (let item of list) {
                item.projectId = accessKey.id
                item.projectName = accessKey.name
            }
            return list
        }

        for (let accessKey of db.accessKeys) {
            const { name, type = 'aliyun', accessKeyId, accessKeySecret, ecs = {}, redis = {}, rds = {}, domain, billing, 
                cert, cdnCert } = accessKey

            if (type == 'aliyun') {
                const { regions: ecsRegions = [] } = ecs
                const { regions: rdsRegions = [] } = rds
                const { regions: redisRegions = [] } = redis
    
                
                for (let region of ecsRegions) {
                    // console.log('region', region)
                    const { list } = await getEcsRegionInstances(accessKeyId, accessKeySecret, region)
                    ecsResults.push(...handleList(list, accessKey))
                }
    
                for (let region of redisRegions) {
                    const { list } = await getRedisRegionInstances(accessKeyId, accessKeySecret, region)
                    redisResults.push(...handleList(list, accessKey))
                }

                for (let region of rdsRegions) {
                    // console.log('region', region)
                    const { list } = await getRdsRegionInstances(accessKeyId, accessKeySecret, region)
                    rdsResults.push(...handleList(list, accessKey))
                }
    
                if (!!domain) {
                    const { list } = await getDomainList(accessKeyId, accessKeySecret)
                    domainResults.push(...handleList(list, accessKey))
                }
                if (!!billing) {
                    const info = await getBillingInfo(accessKeyId, accessKeySecret)
                    billingResults.push({
                        ...info,
                        name: accessKey.name,
                    })
                }
                if (!!cert) {
                    const { list } = await getCertList(accessKeyId, accessKeySecret)
                    certResults.push(...handleList(list, accessKey))
                }
                if (!!cdnCert) {
                    const { list } = await getCdnCertList(accessKeyId, accessKeySecret)
                    cdnCertResults.push(...handleList(list, accessKey))
                }
            }
            if (type == 'tencent') {
                const { secretId, secretKey, server = {}, mysql = {}, lighthouse = {} } = accessKey
                const { regions: serverRegions = []} = server
                const { regions: mysqlRegions = []} = mysql
                const { regions: lighthouseRegions = []} = lighthouse
                for (let region of serverRegions) {
                    const { list } = await getTencentServerRegionInstances(secretId, secretKey, region)
                    tencentServerResults.push(...handleList(list, accessKey))
                }
                for (let region of mysqlRegions) {
                    const { list } = await getTencentMysqlRegionInstances(secretId, secretKey, region)
                    tencentMysqlResults.push(...handleList(list, accessKey))
                }
                for (let region of lighthouseRegions) {
                    const { list } = await getTencentLighthouseRegionInstances(secretId, secretKey, region)
                    tencentLighthouseResults.push(...handleList(list, accessKey))
                }
            }
        }

        fs.writeFileSync(ecsResultPath, JSON.stringify(ecsResults, null, 4), 'utf-8')
        fs.writeFileSync(redisResultPath, JSON.stringify(redisResults, null, 4), 'utf-8')
        fs.writeFileSync(rdsResultPath, JSON.stringify(rdsResults, null, 4), 'utf-8')
        fs.writeFileSync(domainResultPath, JSON.stringify(domainResults, null, 4), 'utf-8')
        fs.writeFileSync(billingResultPath, JSON.stringify(billingResults, null, 4), 'utf-8')
        fs.writeFileSync(certResultPath, JSON.stringify(certResults, null, 4), 'utf-8')
        fs.writeFileSync(cdnCertResultPath, JSON.stringify(cdnCertResults, null, 4), 'utf-8')
        fs.writeFileSync(tencentServerResultPath, JSON.stringify(tencentServerResults, null, 4), 'utf-8')
        fs.writeFileSync(tencentMysqlResultPath, JSON.stringify(tencentMysqlResults, null, 4), 'utf-8')
        fs.writeFileSync(tencentLighthouseResultPath, JSON.stringify(tencentLighthouseResults, null, 4), 'utf-8')

        const info = {
            updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        fs.writeFileSync(infoPath, JSON.stringify(info, null, 4), 'utf-8')

        if (ecsResults.length) {
            console.log('======== ECS ========')
            showEcsList(ecsResults)
        }
        if (redisResults.length) {
            console.log('======== Redis ========')
            showRedisList(redisResults)
        }
        if (rdsResults.length) {
            console.log('======== RDS ========')
            showRdsList(rdsResults)
        }
        if (domainResults.length) {
            console.log('======== Domain ========')
            showDomainList(domainResults)
        }
        if (billingResults.length) {
            console.log('======== Billing ========')
            showBillingList(billingResults)
        }
        if (certResults.length) {
            console.log('======== Cert ========')
            showCertList(certResults)
        }
        if (cdnCertResults.length) {
            console.log('======== CDN Cert ========')
            showCdnCertList(cdnCertResults)
        }
        if (tencentServerResults.length) {
            console.log('======== Tencent Server ========')
            showTencentServerList(tencentServerResults)
        }
        if (tencentMysqlResults.length) {
            console.log('======== Tencent MySQL ========')
            showTencentMysqlList(tencentMysqlResults)
        }
        if (tencentLighthouseResults.length) {
            console.log('======== Tencent Lighthouse ========')
            showTencentServerList(tencentLighthouseResults)
        }

        console.log(`Results saved, path: ${dataFolder}`)
        // console.log(`RDS results saved, path: ${rdsResultPath}`)
        // console.log(`Domain results saved, path: ${domainResultPath}`)
        // console.log(`Billing results saved, path: ${billingResultPath}`)
        // console.log(`SSL results saved, path: ${certResultPath}`)
    })

// commander
//     .command('monitor')
//     .description('tencent mysql monitor')
//     .action(async function (folder) {
//         const tencentMysqlResultPath = path.resolve(dataFolder, 'tencent-mysql.json')
//         if (!fs.existsSync(tencentMysqlResultPath)) {
//             console.log('Run `aliyun run` to generate tencent-mysql.json first.')
//             return
//         }

//         const instances = JSON.parse(fs.readFileSync(tencentMysqlResultPath, 'utf-8'))

//         console.log('instances', instances)
        
//     })

commander.parse(process.argv)


// Test
// console.log('asd')
// showEcsList([
//     {
//         "expiredTime": "2022-10-25T16:00Z",
//         "publicIpAddress": {
//             "ipAddress": [
//                 "123.57.61.88"
//             ]
//         },
//         "eipAddress": {
//             "allocationId": "",
//             "internetChargeType": "",
//             "ipAddress": ""
//         },
//         "instanceName": "test-name"
//     }
// ])