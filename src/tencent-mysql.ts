const tencentcloud = require("tencentcloud-sdk-nodejs");
const CdbClient = tencentcloud.cdb.v20170320.Client;

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
    };
    const client = new CdbClient(clientConfig);
    const params = {};
    const data = await client.DescribeDBInstances(params)
    const list = data.Items
    return { list }
}
