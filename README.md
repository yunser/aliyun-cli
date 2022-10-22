# aliyun-cli

阿里云命令行工具，用于辅助自动化运维。


## 主要功能

* 命令行列出各种产品的到期时间。
    * 支持的产品
        * ECS
        * RDS
        * Domain
* 支持生成 JSON 数据，可用于自定义分析。


## 一些说明

使用脚本前，可在阿里云编辑实例名称，便于识别不同的实例。


## 安装/使用

安装 `@yunser/aliyun-cli`。

```
npm i -g @yunser/aliyun-cli
aliyun -v
```

生成配置文件。

```
cd
aliyun init
```

编辑 accessKeys.json，参考里面的示例，然后

```
aliyun run
```

输出：

```
======== ECS ========
╔════════════════════════════════╤═════════════════════╗
║ Name                           │ Expire Time         ║
╟────────────────────────────────┼─────────────────────╢
║ yunser-dev                     │ 2022-11-05 00:00:00 ║
╟────────────────────────────────┼─────────────────────╢
║ yunser-main                    │ 2022-11-11 00:00:00 ║
╚════════════════════════════════╧═════════════════════╝

======== RDS ========
╔══════════════╤═════════════════════╗
║ Name         │ Expire Time         ║
╟──────────────┼─────────────────────╢
║ yunser-prod  │ 2023-09-28 00:00:00 ║
╚══════════════╧═════════════════════╝

======== Domain ========
╔══════════════════╤═════════════════════╗
║ Name             │ Expire Time         ║
╟──────────────────┼─────────────────────╢
║ yunser.com       │ 2023-06-30 10:19:21 ║
╚══════════════════╧═════════════════════╝

ECS results saved, path: {xxx}/aliyun-ecs.json
RDS results saved, path: {xxx}/aliyun-rds.json
Domain results saved, path: {xxx}/aliyun-domain.json
```


## 配置文件介绍

```json
{
    "version": "1.0.0", // 命令行生成的，保存一样就行
    "accessKeys": [
        {
            "name": "NAME", // 名称，仅用于区分 Access Key，任意名称即可
            "accessKeyId": "ACCESS_KEY_ID", // 阿里云后台生成
            "accessKeySecret": "ACCESS_KEY_SECRET", // 阿里云后台生成
            "ecs": {
                "regions": [
                    "cn-beijing" // ECS 所属地区，支持多个。暂不支持自动识别，故需手动配置。去阿里云后台查看
                ]
            },
            "rds": {
                "regions": [
                    "cn-beijing" // RDS 所属地区
                ]
            },
            "domain": {} // {} 表示需要获取域名信息
        }
    ]
}

```

几个阿里云地域 ID

| 地区 | 地域 ID       |
|----|-------------|
| 杭州 | cn-hangzhou |
| 上海 | cn-shanghai |
| 北京 | cn-beijing  |
| 青岛 | cn-qingdao  |

基本很多都是拼音全拼（不保证一定是这样）
