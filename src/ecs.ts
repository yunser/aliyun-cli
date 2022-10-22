import Ecs20140526, * as $Ecs20140526 from '@alicloud/ecs20140526';
import Util, * as $Util from '@alicloud/tea-util';
import * as $OpenApi from '@alicloud/openapi-client';

export async function getEcsRegionInstances(accessKeyId: string, accessKeySecret: string, regionId: string): Promise<any> {
    
    function createClient(): Ecs20140526 {
        let config = new $OpenApi.Config({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        })
        config.endpoint = `ecs.${regionId}.aliyuncs.com`
        return new Ecs20140526(config)
    }

    let client = createClient();
    let runtime = new $Util.RuntimeOptions({ });
    let describeInstancesRequest = new $Ecs20140526.DescribeInstancesRequest({
        regionId,
    })
    try {
        const res = await client.describeInstancesWithOptions(describeInstancesRequest, runtime);
        const list = (res.body.instances as any).instance
        return { list }
      } catch (error) {
        console.error(error)
      }    
}
