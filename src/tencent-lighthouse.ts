const tencentcloud = require("tencentcloud-sdk-nodejs");
const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;

export async function getTencentLighthouseRegionInstances(secretId: string, secretKey: string, region: string) {
    const clientConfig = {
        credential: {
            secretId,
            secretKey,
        },
        region,
        profile: {
            httpProfile: {
                endpoint: "lighthouse.tencentcloudapi.com",
            },
        },
    }
    const client = new LighthouseClient(clientConfig)
    const params = {}
    const data = await client.DescribeInstances(params)

    const list = data.InstanceSet
    return { list }
}
