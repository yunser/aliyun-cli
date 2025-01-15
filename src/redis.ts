import R_kvstore20150101, * as $R_kvstore20150101 from '@alicloud/r-kvstore20150101';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

export async function getRedisRegionInstances(accessKeyId: string, accessKeySecret: string, regionId: string): Promise<any> {
    
    function createClient(): R_kvstore20150101 {
        let config = new $OpenApi.Config({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        })
        config.endpoint = `r-kvstore.${regionId}.aliyuncs.com`
        return new R_kvstore20150101(config as any)
    }

    let client = createClient();
    let runtime = new $Util.RuntimeOptions({ });
    let describeInstancesRequest = new $R_kvstore20150101.DescribeInstancesRequest({
        regionId,
    })
    try {
        const res = await client.describeInstancesWithOptions(describeInstancesRequest, runtime);
        // console.log('res.body', res.body.instances)
        const list = res.body.instances.KVStoreInstance
        return { list }
      } catch (error) {
        console.error(error)
      }    
}
