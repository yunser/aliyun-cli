import Rds20140815, * as $Rds20140815 from '@alicloud/rds20140815';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

export async function getRdsRegionInstances(accessKeyId: string, accessKeySecret: string, regionId: string) {
    
    function createClient(): Rds20140815 {
        let config = new $OpenApi.Config({
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
        });
        config.endpoint = `rds.aliyuncs.com`;
        return new Rds20140815(config);
    }

    let client = createClient();
    let describeDBInstancesRequest = new $Rds20140815.DescribeDBInstancesRequest({
        regionId,
    });
    let runtime = new $Util.RuntimeOptions({});
    try {
        const res = await client.describeDBInstancesWithOptions(describeDBInstancesRequest, runtime);
        const list = res.body.items.DBInstance
        return { list }
    } catch (error) {
        console.error(error)
    }
}
