import BssOpenApi20171214, * as $BssOpenApi20171214 from '@alicloud/bssopenapi20171214';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export async function getBillingInfo(accessKeyId: string, accessKeySecret: string): Promise<any> {
    
    function createClient() {
        let config = new $OpenApi.Config({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        });
        config.endpoint = `business.aliyuncs.com`;
        return new BssOpenApi20171214(config);
    }

    let client = createClient();
    let runtime = new $Util.RuntimeOptions({ });
    try {
        const res = await client.queryAccountBalanceWithOptions(runtime);
        return res.body.data
    } catch (error) {
        console.error(error)
    }    
}
