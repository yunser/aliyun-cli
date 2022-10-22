const Core = require('@alicloud/pop-core');

export async function getDomainList(accessKeyId: string, accessKeySecret: string) {
    const domainClient = new Core({
        accessKeyId,
        accessKeySecret,
        endpoint: 'https://domain.aliyuncs.com',
        apiVersion: '2018-01-29'
    })
    
    const params = {
        "PageNum": 1,
        "PageSize": 100
    }
      
    const requestOption = {
        method: 'POST'
    }

    const ret = await domainClient.request('QueryDomainList', params, requestOption)
    const list = ret.Data.Domain

    return { list }
}
