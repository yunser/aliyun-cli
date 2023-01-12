const tencentcloud = require("tencentcloud-sdk-nodejs");
const CdbClient = tencentcloud.cdb.v20170320.Client;
const DbbrainClient = tencentcloud.dbbrain.v20210527.Client;

export async function getTencentMysqlRegionInstances(secretId: string, secretKey: string, region: string) {
    const clientConfig = {
        credential: {
            secretId,
            secretKey,
        },
        region,
        profile: {
            httpProfile: {
                endpoint: "cdb.tencentcloudapi.com",
            },
        },
    }

    const cdbClient = new CdbClient(clientConfig);
    const data = await cdbClient.DescribeDBInstances({})
    const list = data.Items

    const dbbrainclientConfig = {
        credential: {
          secretId,
          secretKey,
        },
        region: "ap-guangzhou",
        profile: {
          httpProfile: {
            endpoint: "dbbrain.tencentcloudapi.com",
          },
        },
    }
      
    const client = new DbbrainClient(dbbrainclientConfig)
    for (let instance of list) {
        const params = {
            InstanceId: instance.InstanceId,
            RangeDays: 7,
            Product: 'mysql'
        }
        const data = await client.DescribeDBSpaceStatus(params)
        instance.DBSpaceStatus = data
    }

    return { list }
}
