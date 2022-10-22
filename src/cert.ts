import cas20200407, * as $cas20200407 from '@alicloud/cas20200407';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export async function getCertList(accessKeyId: string, accessKeySecret: string) {
    function createClient(): cas20200407 {
        let config = new $OpenApi.Config({
            accessKeyId,
            accessKeySecret,
        });
        config.endpoint = `cas.aliyuncs.com`;
        return new cas20200407(config);
    }

    let client = createClient();
    let listUserCertificateOrderRequest = new $cas20200407.ListUserCertificateOrderRequest({});
    let runtime = new $Util.RuntimeOptions({});
    try {
        const res = await client.listUserCertificateOrderWithOptions(listUserCertificateOrderRequest, runtime);
        // console.log('res', res)
        const list = res.body.certificateOrderList
        // console.log('list', list)
        return { list }
    } catch (error) {
        console.error(error)
    }
}
