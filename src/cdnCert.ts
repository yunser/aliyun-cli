import Cdn20180510, * as $Cdn20180510 from '@alicloud/cdn20180510'
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export async function getCdnCertList(accessKeyId: string, accessKeySecret: string) {
    function createClient(): Cdn20180510 {
        let config = new $OpenApi.Config({
            accessKeyId,
            accessKeySecret,
        });
        config.endpoint = `cdn.aliyuncs.com`;
        return new Cdn20180510(config)
    }

    let client = createClient();
    let describeCdnHttpsDomainListRequest = new $Cdn20180510.DescribeCdnHttpsDomainListRequest({});
    let runtime = new $Util.RuntimeOptions({});
    try {
        const res = await client.describeCdnHttpsDomainListWithOptions(describeCdnHttpsDomainListRequest, runtime);
        const list = res.body.certInfos.certInfo
        return { list }
    } catch (error) {
        console.error(error)
    }
}
