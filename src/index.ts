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
// import * as commander from 'commander'
const commander = require('commander')

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
        return {
            Name: item.instanceName,
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

const current_path = process.cwd()
const accessKeysPath = path.resolve(current_path, 'accessKeys.json')

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
    .action(async function (folder) {
        if (!fs.existsSync(accessKeysPath)) {
            console.log(`accessKeys.json not exits in curren path: ${current_path}`)
            console.log('run `aliyun init` to generate config file', )
            return
        }

        const content = fs.readFileSync(accessKeysPath, 'utf-8')
        const db = JSON.parse(content)

        const ecsResultPath = path.resolve(current_path, 'aliyun-ecs.json')
        const rdsResultPath = path.resolve(current_path, 'aliyun-rds.json')
        const domainResultPath = path.resolve(current_path, 'aliyun-domain.json')
        const billingResultPath = path.resolve(current_path, 'aliyun-billing.json')
        const certResultPath = path.resolve(current_path, 'aliyun-cert.json')
        let ecsResults = []
        let rdsResults = []
        let domainResults = []
        let billingResults = []
        let certResults = []

        for (let accessKey of db.accessKeys) {
            const { name, accessKeyId, accessKeySecret, ecs = {}, rds = {}, domain, billing, cert } = accessKey
            const { regions: ecsRegions = [] } = ecs
            const { regions: rdsRegions = [] } = rds

            for (let region of ecsRegions) {
                // console.log('region', region)
                const { list } = await getEcsRegionInstances(accessKeyId, accessKeySecret, region)
                // console.log('list', list)
                ecsResults.push(...list)
            }

            for (let region of rdsRegions) {
                // console.log('region', region)
                const { list } = await getRdsRegionInstances(accessKeyId, accessKeySecret, region)
                // console.log('list', list)
                rdsResults.push(...list)
            }

            if (!!domain) {
                const { list } = await getDomainList(accessKeyId, accessKeySecret)
                domainResults.push(...list)
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
                // console.log('list', list)
                certResults.push(...list)
            }
        }

        fs.writeFileSync(ecsResultPath, JSON.stringify(ecsResults, null, 4), 'utf-8')
        fs.writeFileSync(rdsResultPath, JSON.stringify(rdsResults, null, 4), 'utf-8')
        fs.writeFileSync(domainResultPath, JSON.stringify(domainResults, null, 4), 'utf-8')
        fs.writeFileSync(billingResultPath, JSON.stringify(billingResults, null, 4), 'utf-8')
        fs.writeFileSync(certResultPath, JSON.stringify(certResults, null, 4), 'utf-8')
        if (ecsResults.length) {
            console.log('======== ECS ========')
            showEcsList(ecsResults)
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

        console.log(`ECS results saved, path: ${ecsResultPath}`)
        console.log(`RDS results saved, path: ${rdsResultPath}`)
        console.log(`Domain results saved, path: ${domainResultPath}`)
        console.log(`Billing results saved, path: ${billingResultPath}`)
        console.log(`SSL results saved, path: ${certResultPath}`)
    })

commander.parse(process.argv)
