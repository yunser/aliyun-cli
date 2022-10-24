import * as tencentcloud from 'tencentcloud-sdk-nodejs'
const CvmClient = tencentcloud.cvm.v20170312.Client;

export async function getTencentServerRegionInstances(secretId: string, secretKey: string, region: string) {
    const clientConfig = {
        credential: {
            secretId,
            secretKey,
        },
        region,
        profile: {
            httpProfile: {
                endpoint: "cvm.tencentcloudapi.com",
            },
        },
    };

    const client = new CvmClient(clientConfig);
    const params = {};
    const data = await client.DescribeInstances(params)
    const list = data.InstanceSet
    return { list }
}
